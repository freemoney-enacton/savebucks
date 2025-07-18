'use client';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import useConstant from '@/Hook/Common/use-constant';
import { useTranslation } from '@/i18n/client';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { AppRoutes } from '@/routes-config';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { SvgCashOut, SvgGame, SvgHome, SvgMoney, SvgMultiUser, SvgRanking, SvgRewards, SvgSavings } from '../Icons';
import SideNavLink from '../SideNavLink';
import SkeletonComponent from '../Skeleton/SkeletonComponent';
import { HeartIcon } from '@heroicons/react/24/solid';

const Sidebar = () => {
  const { t } = useTranslation();
  const { EarningSubMenu } = useConstant();
  const { public_get_api } = usePublicApi();
  const [categories, setCategories] = useState<any>([]);
  const defaultCategory = {
    bg_color: '',
    icon: '/images/crown.png',
    id: 0,
    name: t('all'),
    show_menu: 1,
    slug: '',
    sort_order: 100,
    text_color: null,
  };

  const settings: any = useRecoilValue(objectAtomFamily(atomKey.settings));
  useEffect(() => {
    public_get_api({ path: `categories` }).then((res) => {
      if (res) {
        setCategories([defaultCategory, ...(res.data || [])]);
      }
    });
  }, []);

  const sideNavLinks = [
    {
      label: t('nav_earn'),
      icon: <SvgHome className="size-5" />,
      url: AppRoutes.earn,
    },
    {
      label: t('nav_offers'),
      icon: <SvgMoney className="size-5" />,
      url: AppRoutes.offers,
      showSubMenu: true,
      subMenuData: categories?.filter((e) => e.show_menu),
    },
    {
      label: t('nav_recommended_offers'),
      icon: <HeartIcon className="size-5" />,
      url: AppRoutes.recommendedOffers,
    },
    // {
    //   label: t('nav_store'),
    //   icon: <SvgCart className="size-5" />,
    //   url: AppRoutes.allStores,
    // },
    {
      label: t('nav_earning'),
      icon: <SvgSavings className="size-5" />,
      url: AppRoutes.overviewEarning,
      showSubMenu: true,
      subMenuData: EarningSubMenu,
    },
    {
      label: t('nav_cashout'),
      icon: <SvgCashOut className="size-5" />,
      url: AppRoutes.cashout,
    },
    {
      label: t('nav_leaderboard'),
      icon: <SvgRanking className="size-5" />,
      url: AppRoutes.leaderboard,
    },
    {
      label: t('nav_rewards'),
      icon: <SvgRewards className="size-5" />,
      url: AppRoutes.rewards,
    },
    {
      label: t('nav_refer_earn'),
      icon: <SvgMultiUser className="size-5" />,
      url: AppRoutes.referAndEarn,
    },
    {
      label: t('nav_playtime'),
      icon: <SvgGame className="size-5" />,
      url: AppRoutes.playtime,
    },
  ];
  return (
    <aside className="sidebar max-xl:hidden fixed inset-y-0 z-20 left-0 h-full w-full max-w-[224px] px-5 py-8 flex flex-col gap-8 bg-sidebar-gr text-black rounded-tr-[60px]">
      <div className="w-fit pl-4">
        {/* logo */}
        <Link href={AppRoutes.home} className="logo-wrapper h-10 grid place-content-center">
          {!settings?.default?.logo ? (
            <SkeletonComponent count={1} className="max-sm:hidden h-10 w-20 rounded-full" />
          ) : (
            <Image
              className="logo-img max-h-6 sm:max-h-10 !w-auto h-auto"
              src={settings?.default?.light_logo}
              alt="logo"
              width={1000}
              height={300}
            />
          )}
        </Link>
        {/* separator */}
        {/* <div className="hidden separator bg-gray-700 rounded-full h-[1px] my-4"></div> */}
      </div>

      {/* links */}
      <div className="space-y-5 overflow-y-auto">
        {sideNavLinks.filter(Boolean).map((link, index) => (
          <SideNavLink key={index} data={link} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
