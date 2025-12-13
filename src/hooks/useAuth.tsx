import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { AuthContextType, User } from "../types";
import { API_ENDPOINTS } from "../config/constants";
import {jwtDecode} from "jwt-decode";
import { SessionWarningModal } from "../components/SessionWarningModal";

interface AuthProviderProps {
    children: ReactNode;
}

interface JwtPayload {
    exp: number;
    [key: string]: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("auth_token"));
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [refreshWarning, setRefreshWarning] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);

    const refreshToken = localStorage.getItem("refresh_token");
    let refreshTimer: NodeJS.Timeout;

    const activityEvents = ["mousemove", "keydown", "scroll", "click"];

    // ---------------- Token helpers ----------------
    const storeTokens = useCallback((token: string, refreshToken?: string,  userId?: string) => {
        setToken(token);
        localStorage.setItem("auth_token", token);
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
        if (userId) localStorage.setItem("user_id", userId);
    }, []);

    const signOut = useCallback(() => {
        setUser(null);
        setToken(null);
        setRefreshWarning(false);
        setShowWarningModal(false);
        localStorage.clear();   // <-- clear user_id
        clearTimeout(refreshTimer);
    }, []);

    // ---------------- Centralized API request ----------------
    const apiRequest = useCallback(
        async <T = any>(url: string, options: RequestInit = {}, retry = true): Promise<{ data?: T; error?: string }> => {
            try {
                const headers: Record<string, string> = {
                    "Content-Type": "application/json",
                    ...(options.headers instanceof Headers
                        ? Object.fromEntries(options.headers.entries())
                        : (options.headers as Record<string, string> | undefined) || {}),
                };
                if (token) headers["Authorization"] = `Bearer ${token}`;

                const res = await fetch(url, { ...options, headers });
                const data = await res.json();

                if (!res.ok) {
                    if (res.status === 401 && retry && refreshToken) {
                        const refreshRes = await fetch(API_ENDPOINTS.auth.refresh, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ refreshToken }),
                        });
                        const refreshData = await refreshRes.json();

                        if (refreshRes.ok && refreshData.token) {
                            storeTokens(refreshData.token);
                            scheduleRefresh(refreshToken);
                            return apiRequest(url, options, false);
                        } else {
                            signOut();
                            return { error: "Session expired" };
                        }
                    }
                    return { error: data.error || "Invalid OTP, Try again" };
                }

                return { data };
            } catch (err) {
                return { error: err instanceof Error ? err.message : String(err) };
            }
        },
        [token, refreshToken, signOut, storeTokens]
    );

    // ---------------- Auto-refresh & Warning ----------------
    const scheduleRefresh = useCallback(
        (rt: string) => {
            clearTimeout(refreshTimer);
            try {
                const decoded: JwtPayload = jwtDecode(rt);
                const now = Math.floor(Date.now() / 1000);
                const secondsLeft = decoded.exp - now;

                if (secondsLeft > 120) {
                    setTimeout(() => setShowWarningModal(true), (secondsLeft - 120) * 1000);
                } else {
                    setShowWarningModal(true);
                }

                const refreshInMs = Math.max((secondsLeft - 60) * 1000, 0);
                refreshTimer = setTimeout(async () => {
                    const { data } = await apiRequest(API_ENDPOINTS.auth.refresh, {
                        method: "POST",
                        body: JSON.stringify({ refreshToken: rt }),
                    });
                    if (data?.token) {
                        storeTokens(data.token, rt);
                        setShowWarningModal(false);
                        scheduleRefresh(rt);
                    } else {
                        signOut();
                    }
                }, refreshInMs);
            } catch {
                setShowWarningModal(true);
            }
        },
        [apiRequest, storeTokens, signOut]
    );

    // ---------------- Activity Tracking ----------------
    const resetActivityTimer = useCallback(() => {
        if (!refreshToken) return;
        clearTimeout(refreshTimer);
        scheduleRefresh(refreshToken);
    }, [refreshToken, scheduleRefresh]);

    useEffect(() => {
        activityEvents.forEach((e) => window.addEventListener(e, resetActivityTimer));
        return () => activityEvents.forEach((e) => window.removeEventListener(e, resetActivityTimer));
    }, [resetActivityTimer]);

    // ---------------- Extend session manually ----------------
    const extendSession = useCallback(async () => {
        if (!refreshToken) return signOut();
        const { data, error } = await apiRequest(API_ENDPOINTS.auth.refresh, {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
        });
        if (error || !data?.token) return signOut();
        storeTokens(data.token, refreshToken);
        setShowWarningModal(false);
        scheduleRefresh(refreshToken);
    }, [apiRequest, refreshToken, storeTokens, scheduleRefresh, signOut]);

    // ---------------- Restore session on mount ----------------
    useEffect(() => {
        if (!refreshToken) return;
        const restoreSession = async () => {
            setLoading(true);
            const { data, error } = await apiRequest(API_ENDPOINTS.auth.refresh, {
                method: "POST",
                body: JSON.stringify({ refreshToken }),
            });
            setLoading(false);
            if (error) return signOut();
            if (data?.token && data?.user) {
                setUser(data.user);
                storeTokens(data.token, refreshToken, data.user.id); // <-- user_id saved
                scheduleRefresh(refreshToken);
            }
        };
        restoreSession();
        return () => clearTimeout(refreshTimer);
    }, [apiRequest, refreshToken, storeTokens, signOut, scheduleRefresh]);

    // ---------------- Auth actions ----------------
    const sendOtp = useCallback(
        async (phone: string) => {
            setOtpLoading(true);
            const result = await apiRequest(API_ENDPOINTS.auth.sendOtp, { method: "POST", body: JSON.stringify({ phone }) });
            setOtpLoading(false);
            return result.data || { error: result.error };
        },
        [apiRequest]
    );

    const verifyOtp = useCallback(
        async (phone: string, otp: string) => {
            setLoading(true);
            const result = await apiRequest(API_ENDPOINTS.auth.verifyOtp, { method: "POST", body: JSON.stringify({ phone, otp }) });
            setLoading(false);
            if (result.error) return { error: result.error };
            const data = result.data;
            if (data?.token && data?.refreshToken && data?.user) {
                setUser(data.user);
                storeTokens(data.token, data.refreshToken, data.user.id); // <-- user_id saved
                scheduleRefresh(data.refreshToken);
            }
            return data;
        },
        [apiRequest, storeTokens, scheduleRefresh]
    );

    const updateName = useCallback(
        async (name: string) => {
            setLoading(true);
            const result = await apiRequest(API_ENDPOINTS.auth.setName, {
                method: "POST",
                body: JSON.stringify({ name }) });
            setLoading(false);
            if (result.error) return { error: result.error };

            const data = result.data;
            if (data?.user) {
                setUser(data.user);
            }
            return { success: true, ...data };
        },
        [apiRequest]
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                refreshToken,
                loading,
                otpLoading,
                refreshWarning,
                sendOtp,
                verifyOtp,
                updateName,
                signOut,
                extendSession,
            }}
        >
            {children}
            <SessionWarningModal visible={showWarningModal} onExtend={extendSession} onLogout={signOut} minutesLeft={2} />
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
