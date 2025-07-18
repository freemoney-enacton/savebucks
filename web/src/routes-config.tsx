export const AppRoutes = {
  home: '/',
  earn: '/earn',
  offers: '/offers',
  referAndEarn: '/refer-and-earn',
  cashout: '/cashout',
  cookiePolicy: '/cookie-policy',
  faq: '/faq',
  privacyPolicy: '/privacy-policy',
  terms: '/terms',
  hiw: '/how-it-works',
  businessInquiries: '/business-inquiries',
  support: '/support',
  leaderboard: '/leaderboard',
  login: '/login',
  register: '/register',
  allStores: '/all-stores',
  rewards: '/rewards',
  overviewEarning: '/overview/earning',
  overviewEarningOffer: '/overview/earning?type=offers',
  overviewEarningSurveys: '/overview/earning?type=surveys',
  overviewEarningShopping: '/overview/earning?type=shopping',
  overviewWithdrawal: '/overview/withdrawal',
  overviewOngoingOffer: '/overview/ongoing-offer',
  overviewChargeBack: '/overview/charge-back',
  overviewMissingClaim: '/overview/missing-claims',
  overviewClicksClaim: '/overview/clicks',
  notification: '/notification',
  profile: '/profile',
  chat: '/chat',
  playtime: '/playtime',
  recommendedOffers: '/recommended-offers',
};

export const publicRoutes = [
  '/',
  '/earn',
  '/offers',
  '/refer-and-earn',
  '/cashout',
  '/callback/social',
  '/blog',
  '/cookie-policy',
  '/faq',
  '/privacy-policy',
  '/terms',
  '/how-it-works',
  '/business-inquiries',
  '/support',
  '/leaderboard',
  '/all-stores',
  '/single-store',
  '/imprint',
];

export const authRoutes = ['/login', '/register', '/'];

export const apiAuthPrefix = '/api/auth';

export const DEFAULT_LOGIN_REDIRECT = '/earn';

export const DEFAULT_LOGOUT_REDIRECT = '/earn';
