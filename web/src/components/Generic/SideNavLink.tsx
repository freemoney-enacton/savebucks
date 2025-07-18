import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n/client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Accordion, AccordionItem } from '@nextui-org/react';
import { ChevronDown } from 'lucide-react';

export default function SideNavLink({ data }: any) {
  const pathname = usePathname();
  const currentPath = pathname === data?.url;
  const router = useRouter();
  const searchParams = useSearchParams();
  const catParams = searchParams.get('cat');
  const { t } = useTranslation();
  const [selectedKeys, setSelectedKeys] = useState(new Set(['1']));

  useEffect(() => {
    if (pathname.includes('/offers') && data.label === t('nav_offers')) {
      setSelectedKeys(new Set([data.label]));
    } else if (pathname.includes('/overview') && data.label === t('nav_earning')) {
      setSelectedKeys(new Set([data.label]));
    } else {
      setSelectedKeys(new Set([]));
    }
  }, [pathname, data?.label, t]);

  const handleSubCatClick = (item) => {
    if (data.label === t('nav_offers')) {
      let newSearchParams = new URLSearchParams(searchParams.toString());
      if (item.slug) {
        newSearchParams.set('cat', item.slug);
      } else {
        newSearchParams.delete('cat');
      }
      router.replace(`/offers?${newSearchParams.toString()}`);
    } else {
      router.push(item.route);
    }
  };

  function Icon() {
    return <ChevronDown className="flex-shrink-0 size-5 text-black transition-ease" />;
  }

  return data?.showSubMenu ? (
    <Accordion
      selectedKeys={selectedKeys}
      // @ts-ignore
      onSelectionChange={setSelectedKeys}
      className="bg-transparent rounded-[22px] p-0"
      itemClasses={{
        base: 'p-0',
        content: 'p-0 py-2',
        heading: 'p-0',
        titleWrapper: 'p-0',
        title: 'p-0 text-base',
        trigger: `p-0 pr-5 ${
          currentPath ? 'sidenav-active' : 'sidenav-link'
        } data-[focus-visible=true]:outline-0 data-[focus-visible=true]:outline-offset-0 rounded-[10px] !transition-background`,
      }}
    >
      <AccordionItem
        key={data?.label}
        title={
          <Link href={data?.url} className="flex items-center gap-4 py-3 pl-5 font-medium group text-black">
            <div>{data?.icon}</div>
            <p className="text-sm transition-ease">{data?.label}</p>
          </Link>
        }
        indicator={<Icon />}
        isCompact={false}
        textValue={data?.label}
      >
        {data?.showSubMenu && (
          <div className="flex flex-col ml-12 -my-2">
            {data?.subMenuData?.map((item: any, index) => {
              const isActive = item.route
                ? pathname === item.route
                : catParams === item?.slug || (!catParams && item?.name === 'All' && pathname === '/offers');
              return (
                <div
                  key={index}
                  onClick={() => handleSubCatClick(item)}
                  className={`cursor-pointer flex items-center gap-4 py-2 px-2 text-sm font-medium group hover:!text-black transition-ease ${
                    isActive ? '!text-black' : ''
                  }`}
                  style={{ color: 'color-mix(in srgb, var(--body_bg) 60%, transparent)' }}
                >
                  <span>{t(item?.name)}</span>
                </div>
              );
            })}
          </div>
        )}
      </AccordionItem>
    </Accordion>
  ) : (
    <Link
      href={data?.url}
      className={`sidenav-link flex items-center gap-4 px-5 py-3 rounded-[10px] ${
        currentPath ? 'sidenav-active' : ''
      } transition-ease`}
    >
      <div className="flex-shrink-0 size-5">{data?.icon}</div>
      <p className="text-sm font-semibold transition-ease">{data?.label}</p>
    </Link>
  );
}
