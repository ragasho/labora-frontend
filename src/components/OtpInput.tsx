import { useState, useRef, useEffect } from 'react';
import { cn } from './ui/utils';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function OtpInput({ 
  length = 6, 
  value, 
  onChange, 
  onComplete, 
  className, 
  disabled = false 
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update internal state when value prop changes
  useEffect(() => {
    const newOtp = value.split('').slice(0, length);
    while (newOtp.length < length) {
      newOtp.push('');
    }
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (index: number, digit: string) => {
    if (disabled) return;
    
    // Only allow single digits
    if (digit.length > 1) return;
    
    // Only allow numbers
    if (digit && !/^\d$/.test(digit)) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    const otpValue = newOtp.join('');
    onChange(otpValue);

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all digits are filled
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      if (otp[index]) {
        // Clear current field
        handleChange(index, '');
      } else if (index > 0) {
        // Move to previous field and clear it
        inputRefs.current[index - 1]?.focus();
        handleChange(index - 1, '');
      }
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, length);
        const newOtp = new Array(length).fill('');
        
        for (let i = 0; i < digits.length; i++) {
          newOtp[i] = digits[i];
        }
        
        setOtp(newOtp);
        onChange(newOtp.join(''));
        
        // Focus the next empty field or the last field
        const nextIndex = Math.min(digits.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
        
        if (digits.length === length && onComplete) {
          onComplete(digits);
        }
      });
    }
  };

  const handleFocus = (index: number) => {
    if (disabled) return;
    
    // Select all text in the input
    inputRefs.current[index]?.select();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, length);
    
    const newOtp = new Array(length).fill('');
    for (let i = 0; i < digits.length; i++) {
      newOtp[i] = digits[i];
    }
    
    setOtp(newOtp);
    onChange(newOtp.join(''));
    
    // Focus the next empty field or the last field
    const nextIndex = Math.min(digits.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
    
    if (digits.length === length && onComplete) {
      onComplete(digits);
    }
  };

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={el => { inputRefs.current[index] = el; }}          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-medium",
            "border-2 rounded-lg",
            "bg-white border-gray-200",
            "focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none",
            "transition-colors duration-200",
            "disabled:bg-gray-100 disabled:cursor-not-allowed",
            digit ? "border-green-300" : "",
          )}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}