import { DatePicker } from '@nextui-org/react';
import React from 'react';

const DatePickerComponent = ({
  value,
  onChange,
  minValue,
  maxValue,
}: {
  value?: any;
  onChange?: any;
  minValue?: any;
  maxValue?: any;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  React.useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    };
  }, [isOpen]);

  return (
    <DatePicker
      isOpen={isOpen}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      value={value}
      onChange={onChange}
      minValue={minValue}
      maxValue={maxValue}
      classNames={{
        base: 'date-picker',
        inputWrapper: 'bg-black rounded-lg test',
        innerWrapper: 'bg-black rounded-lg test',
      }}
    />
  );
};

export default DatePickerComponent;
