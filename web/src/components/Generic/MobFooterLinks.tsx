'use client';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import FooterLink from './Footer/FooterLink';
import SkeletonComponent from './Skeleton/SkeletonComponent';
import { useRecoilState } from 'recoil';
import { arrayAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';

const MobFooterLinks = () => {
  const { public_get_api } = usePublicApi();
  const [isLoading, setIsLoading] = useState(true);
  const [FooterContent, setFooterContent]: any = useRecoilState(arrayAtomFamily(atomKey.footer_content));
  useEffect(() => {
    if (FooterContent.length > 0) {
      setIsLoading(false);
      return;
    }
    public_get_api({ path: 'cms/footers' }).then((res) => {
      if (res?.data && res?.success) {
        setFooterContent(res?.data ? res?.data.sort((a, b) => a.sort_order - b.sort_order) : []);
        setIsLoading(false);
      }
    });
  }, []);

  const RenderFooterContent = ({ item, index }) => {
    switch (item?.footer_type) {
      case 'links':
        return (
          <div key={index} className="space-y-2">
            {item?.title && <p className="text-base font-semibold">{item?.title}</p>}
            <ul className="space-y-2">
              {item?.footer_value &&
                item?.footer_value.map((link, index) => (
                  <li key={index}>
                    <FooterLink name={link.label} url={link.url} target={'_self'} />
                  </li>
                ))}
            </ul>
          </div>
        );
      case 'social_links':
        return (
          <div key={index} className="space-y-2">
            {item?.title && <p className="text-base font-semibold">{item?.title}</p>}
            <div className="flex items-center gap-4 flex-wrap max-w-[130px]">
              {item?.footer_value &&
                Object.entries(item?.footer_value)
                  .filter(([key, value]) => value !== null)
                  .map(([key, value]: any) => (
                    <Link key={key} href={value} className="text-gray-500 font-medium link " target="_blank">
                      <Image
                        src={`/images/${key}.png`}
                        className="w-[30px] h-[30px] hover:opacity-80 transition-ease"
                        alt="social-icons"
                        width={30}
                        height={30}
                      />
                    </Link>
                  ))}
            </div>
          </div>
        );
      default:
        return <></>;
    }
  };
  return (
    <div className="grid grid-cols-2 gap-5">
      {isLoading && (
        <>
          <div className="space-y-2.5">
            <SkeletonComponent count={5} variant="secondary" className="h-5 w-full rounded-lg" />
          </div>
          <div className="space-y-2.5">
            <SkeletonComponent count={5} variant="secondary" className="h-5 w-full rounded-lg" />
          </div>
        </>
      )}
      {FooterContent?.length > 0 &&
        FooterContent?.map((item, index) => <RenderFooterContent key={index} item={item} index={index} />)}
    </div>
  );
};

export default MobFooterLinks;
