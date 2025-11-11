import React from "react";

interface Props {
    visible: boolean;
    onExtend: () => void;
    onLogout: () => void;
    minutesLeft?: number;
}

export const SessionWarningModal: React.FC<Props> = ({ visible, onExtend, onLogout, minutesLeft = 2 }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-lg text-center">
                <h2 className="text-xl font-bold mb-4">Session Expiring Soon</h2>
                <p className="mb-4">
                    Your session will expire in {minutesLeft} minute{minutesLeft > 1 ? "s" : ""}. Do you want to extend it?
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={onExtend}
                    >
                        Extend Session
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={onLogout}
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};
