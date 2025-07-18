'use client';
import Otp from 'react-otp-input';

export default function OtpInput({ numInputs, value, onChange }: { numInputs: number; value: string; onChange: any }) {
  return (
    <div>
      <Otp
        numInputs={numInputs}
        value={value}
        onChange={onChange}
        renderSeparator={<span>-</span>}
        renderInput={(props) => <input {...props} />}
        inputStyle="text-sm !h-10 !w-10 sm:!w-12 sm:!h-12 bg-transparent !bg-input-gr rounded-lg border-0 placeholder:text-white placeholder:text-sm text-white focus:ring-0 focus:border-0 outline-none"
        containerStyle="justify-center gap-2 [&>span]:hidden"
        shouldAutoFocus
      />
    </div>
  );
}
