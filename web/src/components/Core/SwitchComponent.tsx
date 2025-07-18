import React from 'react';
import { Switch } from '@nextui-org/react';

export default function SwitchComponent({ isSelected, ...rest }: any) {
  return (
    <Switch
      classNames={{
        hiddenInput: 'z-[2]',
        base: ['group/switch switch-class'],
        wrapper: [
          'w-10 h-5 px-[3px] py-[2.5px] bg-black group-data-[selected=true]:bg-primary-gr bg-gray items-center gap-0 outline-0 !m-0 z-[1] transition-ease',
        ],
        thumb: [
          'w-3.5 h-3.5 bg-black-250 mt-[0.5px] group-data-[selected=true]:bg-black group-data-[selected=true]:w-3.5 group-data-[selected=true]:ml-auto shadow-sm transition-ease',
        ],
      }}
      defaultChecked
      {...rest}
      isSelected={isSelected}
      onValueChange={() => rest?.onToggle(!isSelected)}
    />
  );
}
