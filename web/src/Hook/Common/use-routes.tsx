'use client';
import {
  SvgCashOut,
  SvgChat,
  SvgCookies,
  SvgGame,
  SvgHome,
  SvgLogOut,
  SvgMoney,
  SvgMultiUser,
  SvgOffer,
  SvgRanking,
  SvgRewards,
  SvgSavings,
  SvgUser,
  SvgWallet,
} from '@/components/Generic/Icons';
import { useTranslation } from '@/i18n/client';
import { AppRoutes } from '@/routes-config';
import {
  BanknotesIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CursorArrowRaysIcon,
  EnvelopeIcon,
  HeartIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid';
import useGlobalState from '../use-global-state';

const useRoutes = () => {
  const { t } = useTranslation();
  const { setToggleChatSidebarValue } = useGlobalState();
  const stickyFooterLinks = [
    {
      label: t('nav_earn'),
      icon: <SvgHome className="size-5 transition-ease" />,
      url: AppRoutes.earn,
    },
    {
      label: t('nav_offers'),
      icon: <SvgMoney className="size-5 transition-ease" />,
      url: AppRoutes.offers,
    },
    {
      label: t('nav_playtime'),
      icon: <SvgGame className="size-6 transition-ease" />,
      url: AppRoutes.playtime,
    },
    {
      label: t('chat'),
      icon: <SvgChat className="size-5 transition-ease" />,
      url: null,
      onClick: () => {
        setToggleChatSidebarValue(true);
      },
    },
  ];
  const menuNavLinks = [
    {
      label: t('nav_earning'),
      icon: <SvgSavings className="size-6 group-hover:text-primary transition-ease" />,
      url: AppRoutes.overviewEarning,
    },
    {
      label: t('nav_cashout'),
      icon: <SvgCashOut className="size-6 group-hover:text-primary transition-ease" />,
      url: AppRoutes.cashout,
    },
    {
      label: t('nav_leaderboard'),
      icon: <SvgRanking className="size-6 group-hover:text-primary transition-ease" />,
      url: AppRoutes.leaderboard,
    },
    {
      label: t('nav_refer_earn'),
      icon: <SvgMultiUser className="size-6 group-hover:text-primary transition-ease" />,
      url: AppRoutes.referAndEarn,
    },

    // {
    //   label: t('nav_store'),
    //   icon: <SvgCart className="size-6 group-hover:text-primary transition-ease" />,
    //   url: AppRoutes.allStores,
    // },

    {
      label: t('nav_recommended_offers'),
      icon: <HeartIcon className="size-5 transition-ease" />,
      url: AppRoutes.recommendedOffers,
    },
    {
      label: t('nav_rewards'),
      icon: <SvgRewards className="size-6 group-hover:text-primary transition-ease" />,
      url: AppRoutes.rewards,
    },
  ];
  const menuMobNavLinks = [
    {
      label: t('footer_how_it_works'),
      icon: <InformationCircleIcon className="size-6 group-hover:text-primary transition-ease" />,
      url: '/how-it-works',
    },
    {
      label: t('footer_faq'),
      icon: <QuestionMarkCircleIcon className="size-6 group-hover:text-primary transition-ease" />,
      url: '/faq',
    },
    {
      label: t('footer_business_inquiries'),
      icon: <BriefcaseIcon className="size-6 group-hover:text-primary transition-ease" />,
      url: '/business-inquiries',
    },
    {
      label: t('footer_support'),
      icon: <EnvelopeIcon className="size-6 group-hover:text-primary transition-ease" />,
      url: '/support',
    },
    {
      label: t('footer_terms_service'),
      icon: <BookOpenIcon className="size-6 group-hover:text-primary transition-ease" />,
      url: '/terms',
    },
    {
      label: t('footer_privacy_policy'),
      icon: <ShieldCheckIcon className="size-6 group-hover:text-primary transition-ease" />,
      url: '/privacy-policy',
    },
    {
      label: t('footer_cookie_policy'),
      icon: <SvgCookies className="size-6 group-hover:text-primary transition-ease" />,
      url: '/cookie-policy',
    },
  ];
  const links = [
    {
      id: 1,
      name: t('nav_profile'),
      url: AppRoutes.profile,
      icon: <SvgUser className="size-4" />,
    },
    {
      id: 2,
      name: t('nav_refer_earn'),
      url: AppRoutes.referAndEarn,
      icon: <SvgMultiUser className="size-4" />,
    },
    {
      id: 3,
      name: t('nav_earning'),
      url: AppRoutes.overviewEarning,
      icon: <SvgSavings className="size-4" />,
    },
    {
      id: 5,
      name: t('nav_ongoing_offers'),
      url: AppRoutes.overviewOngoingOffer,
      icon: <SvgOffer className="size-4" />,
    },
    {
      id: 4,
      name: t('nav_withdraw'),
      url: AppRoutes.overviewWithdrawal,
      icon: <SvgCashOut className="size-4" />,
    },
    {
      id: 6,
      name: t('nav_chargebacks'),
      url: AppRoutes.overviewChargeBack,
      icon: <SvgWallet className="size-4" />,
    },
    {
      id: 8,
      name: t('missing_claims'),
      url: AppRoutes.overviewMissingClaim,
      icon: <BanknotesIcon className="size-4" />,
    },
    {
      id: 9,
      name: t('clicks'),
      url: AppRoutes.overviewClicksClaim,
      icon: <CursorArrowRaysIcon className="size-4" />,
    },
    {
      id: 7,
      name: t('nav_logout'),
      url: '/logout',
      icon: <SvgLogOut className="size-4" />,
    },
  ];
  return {
    stickyFooterLinks,
    menuNavLinks,
    links,
    menuMobNavLinks,
  };
};

export default useRoutes;
