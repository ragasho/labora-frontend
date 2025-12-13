import { useState, useEffect } from 'react';
import { X, Phone, Shield, User, Timer } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { OtpInput } from './OtpInput';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
    const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
    const [resendTimer, setResendTimer] = useState(0);

    const { sendOtp, verifyOtp, updateName } = useAuth();

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setPhoneNumber('');
            setOtp('');
            setName('');
            setError('');
            setStep('phone');
            setResendTimer(0);
        }
    }, [isOpen]);

    // Resend timer countdown
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    if (!isOpen) return null;

    const formatPhoneNumber = (phone: string) => {
        const digits = phone.replace(/\D/g, '');
        if (digits.length === 10) return `91${digits}`;
        if (digits.startsWith('91') && digits.length === 12) return digits;
        return phone;
    };

    const isValidPhoneNumber = (phone: string) => /^91\d{10}$/.test(formatPhoneNumber(phone));

    // ------------------- Handlers -------------------
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!isValidPhoneNumber(phoneNumber)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        try {
            const formattedPhone = formatPhoneNumber(phoneNumber);
            const result = await sendOtp(formattedPhone);
            if (result.error) setError(result.error);
            else {
                setStep('otp');
                setResendTimer(30);
            }
        } catch {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formattedPhone = formatPhoneNumber(phoneNumber);
            const otpResult = await verifyOtp(formattedPhone, otp);

            if (otpResult.error) {
                setError(otpResult.error);
                return;
            }

            if (otpResult.isNewUser) setStep('name');
            else onClose(); // existing user logged in
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        setError('');

        try {
            const formattedPhone = formatPhoneNumber(phoneNumber);
            const result = await sendOtp(formattedPhone);
            if (result.error) setError(result.error);
            else setResendTimer(30);
        } catch {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToPhone = () => {
        setStep('phone');
        setOtp('');
        setError('');
    };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold">
              Sign In or Sign Up
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <div className="p-6">
            {/* Step: phone */}
            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) {
                          setPhoneNumber(value);
                        }
                      }}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    We'll send you a 6-digit OTP to verify your number
                  </p>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading || !phoneNumber || phoneNumber.length !== 10}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            ):null}
              {/* Step: otp */}
              {step === "otp" &&(
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    We've sent a 6-digit OTP to
                  </p>
                  <p className="font-medium">+91 {phoneNumber}</p>
                </div>

                  <div className="space-y-4">
                      <div className="text-center">
                          <Label className="text-sm text-gray-600 mb-4 block">Enter the 6-digit OTP</Label>
                          <OtpInput
                              value={otp}
                              onChange={setOtp}
                              disabled={loading}
                              className="justify-center"
                          />
                      </div>
                  </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading || otp.length !== 6}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || loading}
                    className={`text-sm ${
                      resendTimer > 0 || loading
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-green-600 hover:text-green-700'
                    }`}
                  >
                    {resendTimer > 0 ? (
                      <span className="flex items-center justify-center gap-1">
                        <Timer className="w-3 h-3" />
                        Resend OTP in {resendTimer}s
                      </span>
                    ) : (
                      'Resend OTP'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToPhone}
                    className="text-sm text-gray-600 hover:text-gray-800 block w-full"
                  >
                    Change mobile number
                  </button>
                </div>
              </form>
            )}
              {/* Step: name */}
              {step === 'name' && (
                  <form
                      onSubmit={async e => {
                          e.preventDefault();
                          setError('');
                          setLoading(true);

                          try {
                              const formattedPhone = formatPhoneNumber(phoneNumber);
                              const updateResult = await updateName(name);

                              if (updateResult.error) setError(updateResult.error);
                              else onClose(); // user is now logged in with name
                          } catch {
                              setError('Failed to complete signup. Please try again.');
                          } finally {
                              setLoading(false);
                          }
                      }}
                      className="space-y-4"
                  >
                      <div className="text-center space-y-2">
                          <User className="w-8 h-8 text-green-600 mx-auto" />
                          <p className="text-sm text-gray-600">Almost done! Please enter your name</p>
                      </div>

                      <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                              id="name"
                              type="text"
                              placeholder="Enter your name"
                              value={name}
                              onChange={e => setName(e.target.value)}
                              required
                          />
                      </div>

                      {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading || !name}>
                          {loading ? 'Completing...' : 'Complete Signup'}
                      </Button>
                  </form>
              )}
          </div>
        </div>
      </div>
    </>
  );
}