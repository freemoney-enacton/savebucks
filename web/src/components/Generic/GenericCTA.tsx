import { booleanDefaultFalseAtomFamily, objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { Spinner } from '@nextui-org/react';
import React from 'react';
import { useRecoilValue } from 'recoil';

const GenericCTA = ({ className }: { className?: string }) => {
  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  const settings_loading: any = useRecoilValue(booleanDefaultFalseAtomFamily(atomKey.settings_loading));
  return (
    <div
      className={`generic-cta py-2 sm:py-3.5 px-3 sm:px-6 ${className ? className : ''}`}
      style={{
        backgroundColor: settings?.cta_bar?.cta_bg_color,
      }}
    >
      {settings_loading ? (
        <Spinner color="primary" />
      ) : (
        <div className={`text-white max-sm:text-xs text-center`}>
          <span dangerouslySetInnerHTML={{ __html: settings?.cta_bar?.cta_content }}></span>
        </div>
      )}
    </div>
  );
};

export default GenericCTA;
