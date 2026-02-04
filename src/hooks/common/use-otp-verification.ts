import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FieldValues, Path, PathValue, UseFormSetValue } from 'react-hook-form';

interface TimerLike {
  reset: () => void;
}

interface UseOtpVerificationParams<TFieldValues extends FieldValues> {
  currentValue: string;
  originalValue: string;
  otpValue: string;
  otpFieldName: Path<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  timer: TimerLike;
}

interface UseOtpVerificationReturn {
  needsVerification: boolean;
  isVerified: boolean;
  markVerified: () => void;
}

export function useOtpVerification<TFieldValues extends FieldValues>(
  params: UseOtpVerificationParams<TFieldValues>,
): UseOtpVerificationReturn {
  const {
    currentValue,
    originalValue,
    otpValue,
    otpFieldName,
    setValue,
    timer,
  } = params;

  const verifiedValueRef = useRef<string | null>(null);

  const needsVerification = useMemo(() => {
    return currentValue.length > 0 && currentValue !== originalValue;
  }, [currentValue, originalValue]);

  const isVerified = useMemo(() => {
    if (!needsVerification) return true;
    return verifiedValueRef.current === currentValue;
  }, [currentValue, needsVerification]);

  useEffect(() => {
    if (!verifiedValueRef.current) return;

    if (verifiedValueRef.current !== currentValue) {
      verifiedValueRef.current = null;
      if (otpValue.length > 0) {
        setValue(
          otpFieldName,
          '' as PathValue<TFieldValues, typeof otpFieldName>,
        );
      }
      timer.reset();
    }
  }, [currentValue, otpFieldName, otpValue, setValue, timer]);

  const markVerified = useCallback(() => {
    verifiedValueRef.current = currentValue;
  }, [currentValue]);

  return {
    needsVerification,
    isVerified,
    markVerified,
  };
}
