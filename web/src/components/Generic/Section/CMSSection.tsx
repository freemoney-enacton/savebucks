import { auth } from '@/auth';
import HeadingCard from '../Card/HeadingCard';
import InfoCard from '../Card/InfoCard';
import StatsCard from '../Card/StatsCard';
import StepsCard from '../Card/StepsCard';
import Slider from '../Slider/Slider';
import CMSLoginSection from './CMSLoginSection';
import CtaSection from './CtaSection';
import FaqSection from './FaqSection';
import FeaturedSection from './FeaturedSection';
import HeroSectionWithImg from './HeroSectionWithImg';
import HiwSection from './HiwSection';
import InfoSection from './InfoSection';
import OverviewStatsSection from './OverviewStatsSection';
import PaymentModeSection from './PaymentModeSection';
import RewardsCtaSection from './RewardsCtaSection';
import SignupCTAWithBg from './SignupCTAWithBg';
import StatsSection from './StatsSection';
import TestimonialSection from './TestimonialSection';
import OfferSliderSection from '../Slider/OfferSliderSection';
import { createTranslation } from '@/i18n/server';
import { config } from '@/config';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import PartnerSliderSection from '../Slider/PartnerSliderSection';
import CMSHeroSectionV1 from '../Blocks/CMSHeroSectionV1';
import CMSStepSectionV1 from '../Blocks/CMSStepSectionV1';
import LeftContentRightImage from '../Blocks/LeftContentRightImage';
import TestimonialSlider from '../Slider/TestimonialSlider';
import TestimonialSectionV1 from './TestimonialSectionV1';
import ButtonComponent from '../ButtonComponent';
import { RocketLaunchIcon } from '@heroicons/react/24/solid';
import PartnerSection from './PartnerSection';
import HiwRepeaterSection from './HiwRepeaterSection';
import InfoCardsSection from './InfoCardsSection';
import HeroSectionWithMiniStats from './HeroSectionWithMiniStats';
import AuthTabSectionWithImages from './AuthTabSectionWithImages';
import StoreGridSliderSection from './StoreGridSliderSection';

const CMSSection = async ({ item, page, searchParams = {} }) => {
  const { t } = await createTranslation();
  const session = await auth();

  const { cat, platform, name, sort_by }: any = searchParams ?? {};
  const urlSearchParams = new URLSearchParams();
  if (cat) urlSearchParams.append('category', cat);
  if (platform) urlSearchParams.append('platform', platform);
  if (name) urlSearchParams.append('name', name);
  if (sort_by) urlSearchParams.append('sort_by', sort_by);

  switch (item?.type) {
    case 'hero-section-with-login':
      return <CMSHeroSectionV1 data={item?.data} />;
    case 'left-content-right-image':
      return <LeftContentRightImage data={item?.data} />;
    case 'heading':
      return <HeadingCard title={item?.data?.title} sub_title={item?.data?.sub_title} />;
    case 'stats-mini-without-icons':
      return <OverviewStatsSection item={item?.data?.items} />;
    case 'login-component':
      return !session && <CMSLoginSection />;
    case 'stats-col-with-icons':
      return (
        <StatsSection>
          {item?.data?.items?.length > 0 && item?.data?.items?.map((data, index) => <StatsCard key={index} data={data} />)}
        </StatsSection>
      );
    case 'info-box-col':
      return (
        <InfoSection title={item?.data?.title}>
          {item?.data?.items?.length > 0 && item?.data?.items?.map((data, index) => <InfoCard key={index} data={data} />)}
        </InfoSection>
      );
    case 'hiw-cards-with-left-image':
      if (item?.data?.item_style === 'item_style_1' || item?.data?.item_style == null) {
        return (
          <HiwSection title={item?.data?.title} img={item?.data?.image ? item?.data?.image : '/images/hiw-feat.png'}>
            {item?.data?.items?.length > 0 &&
              item?.data?.items.map((data, index) => <StepsCard key={index} data={data} index={index} />)}
          </HiwSection>
        );
      } else if (item?.data?.item_style === 'item_style_2') {
        return <CMSStepSectionV1 data={item?.data} />;
      } else {
        return null;
      }

    case 'info-box-with-cta':
      return <FeaturedSection item={item?.data} />;
    case 'review-component':
      if (item?.data?.style === 'style2') {
        return (
          <TestimonialSectionV1 data={item?.data} title={item?.data?.title} sub_title={item?.data?.sub_title}>
            {item?.data?.items?.length > 0 && <TestimonialSlider data={item?.data?.items} />}
          </TestimonialSectionV1>
        );
      } else
        return (
          <TestimonialSection title={item?.data?.title} sub_title={item?.data?.sub_title}>
            {item?.data?.items?.length > 0 && <Slider data={item?.data?.items} />}
          </TestimonialSection>
        );
    case 'faqs-component':
      return <FaqSection title={item?.data?.title} />;
    case 'sign-up-cta':
      return !session && <CtaSection page={page} />;
    case 'hero-section-with-image':
      return <HeroSectionWithImg item={item?.data} />;
    case 'hero-section-with-right-image':
      return <RewardsCtaSection item={item?.data} />;
    case 'sign-up-cta-with-bg-image':
      return !session && <SignupCTAWithBg item={item?.data} />;
    case 'payment-options':
      return <PaymentModeSection />;
    case 'featured-offers':
      const featTaskResponse = await public_get_api({
        path: `tasks?page=1&limit=${config.FEATURED_TASK_NUMBER_TO_FETCH}&featured=1&${urlSearchParams.toString()}`,
      });
      return (
        featTaskResponse?.data?.length > 0 && (
          <OfferSliderSection
            type={'featured-offers'}
            title={item?.data?.title}
            img={item?.data?.icon_image}
            data={featTaskResponse?.data || []}
            style={item?.data?.style}
          />
        )
      );

    case 'vip-offers':
      const vipTaskResponse = await public_get_api({
        path:
          item?.data?.style == 'revenue_universe_featured_offers'
            ? `tasks/revu?page=1&limit=${config.FEATURED_TASK_NUMBER_TO_FETCH}`
            : `tasks/vip?page=1&limit=${config.FEATURED_TASK_NUMBER_TO_FETCH}&${urlSearchParams.toString()}`,
      });
      return (
        vipTaskResponse?.data?.length > 0 && (
          <OfferSliderSection
            data={vipTaskResponse?.data || []}
            type={'vip-offers'}
            title={item?.data?.title}
            img={item?.data?.icon_image}
            style={item?.data?.style}
          />
        )
      );

    case 'recommended-offers':
      const recommendedTaskResponse = await public_get_api({
        path: `tasks/recommended?page=1&limit=${config.FEATURED_TASK_NUMBER_TO_FETCH}&${urlSearchParams.toString()}`,
      });
      return (
        recommendedTaskResponse?.data?.length > 0 && (
          <OfferSliderSection
            data={recommendedTaskResponse?.data || []}
            type={'vip-offers'}
            title={item?.data?.title}
            img={item?.data?.icon_image}
            style={item?.data?.style}
          />
        )
      );

    case 'survey-partners':
      const surveyProviderResponse = await public_get_api({
        path: `providers/?type=surveys`,
      });
      return (
        surveyProviderResponse?.data?.length > 0 && (
          <PartnerSliderSection
            title={item?.data?.title || t('survey_partners')}
            img={item?.data?.icon_image}
            data={surveyProviderResponse?.data}
            providerType="survey"
            tooltip={true}
            tooltipContent={t('survey_partners_tooltip')}
          />
        )
      );
    case 'offer-partners':
      const offerProviderResponse = await public_get_api({
        path: item?.data?.style === 'iframe_providers' ? `providers/?type=tasks&iframe=1` : `providers/?type=tasks`,
      });
      return (
        offerProviderResponse?.data?.length > 0 && (
          <PartnerSliderSection
            title={item?.data?.title || t('offer_partners')}
            img={item?.data?.icon_image}
            data={offerProviderResponse?.data}
            providerType="tasks"
            tooltip={true}
            tooltipContent={t('offers_partners_tooltip')}
          />
        )
      );
    case 'top-stores':
      const isHandPicked = item?.data?.store_listing_logic === 'hand_picked';
      const storeIds = isHandPicked ? item?.data?.stores : null;
      const url = new URLSearchParams();
      if (storeIds) {
        url.append('store_ids', `${storeIds.join(',')}`);
      }
      url.append('limit', item?.data?.count ? item.data.count : config.FEATURED_STORE_NUMBER_TO_FETCH);
      url.append('logic', item?.data?.store_listing_logic || '');
      const stores = await public_get_api({
        path: `stores?page=1&${url.toString()}`,
      });
      return <StoreGridSliderSection data={stores?.data} title={item?.data?.title} img={item?.data?.icon_image} />;
    case 'button-component':
      return (
        <section className="section text-center">
          <div className="container">
            <ButtonComponent
              url={item?.data?.link}
              label={item?.data?.label}
              role="link"
              variant="primary"
              icon={<RocketLaunchIcon className="flex-shrink-0 size-5 transition-ease" />}
              customClass="w-full max-w-[410px]"
            />
          </div>
        </section>
      );
    case 'partner-section':
      return <PartnerSection data={item?.data} />;
    case 'hiw-repeater-section':
      return <HiwRepeaterSection data={item?.data} />;
    case 'info-cards-section':
      return <InfoCardsSection data={item?.data} />;
    case 'hero-section-with-mini-stats':
      return <HeroSectionWithMiniStats data={item?.data} />;
    case 'auth-tab-section-with-images':
      return !session && <AuthTabSectionWithImages data={item?.data} />;
    case 'rich-editor':
      return <p className="space-y-4" dangerouslySetInnerHTML={{ __html: item?.data?.content }}></p>;
    default:
      return <></>;
  }
};
export default CMSSection;
