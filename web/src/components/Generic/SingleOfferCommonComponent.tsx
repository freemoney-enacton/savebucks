import React, { useEffect } from 'react';
import { useUtils } from '@/Hook/use-utils';
import { config } from '@/config';
import { useTranslation } from '@/i18n/client';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useDisclosure } from '@nextui-org/react';
import { CheckCircle, Lock } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import Card from '@/components/Core/Card';
import InputFileUpload from '@/components/Core/InputFileUpload';
import { PaperAirplaneIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';
import OfferModalSkeleton from './Skeleton/OfferModalSkeleton';
import OfferCategoriesBadge from './OfferCategoriesBadge';
import ButtonComponent from './ButtonComponent';
import OfferMobileModal from './Modals/OfferMobileModal';
import { ErrorMessage, Formik } from 'formik';
import * as Yup from 'yup';
import { Toast } from '../Core/Toast';
import Cookies from 'js-cookie';

const SingleOfferCommonComponent = ({ OfferModalData, loading }: { OfferModalData: any; loading: boolean }) => {
  const { t } = useTranslation();
  const { isOpen: outUrlIsOpen, onOpenChange: outUrlOnOpenChange } = useDisclosure();
  const [isMoreDetail, setIsMoreDetail] = useState(false);
  const [uploadedScreenShot, setUploadedScreenShot] = useState('');
  const [goal, setGoal] = useState([]);
  const { getCurrencyString } = useUtils();
  const { public_post_api } = usePublicApi();
  const isMobileApp = Cookies.get(config.IS_MOBILE_COOKIE);

  const locked = OfferModalData?.userDetails?.current_tier < OfferModalData?.tier;
  const MAXSIZE = '2mb';
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  const isIOS =
    (typeof navigator !== 'undefined' && navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null) || isMobileApp === 'ios';
  const isAndroid =
    (typeof navigator !== 'undefined' && navigator.userAgent.match(/Android/i) !== null) || isMobileApp === 'android';
  const isMobile =
    isIOS ||
    isAndroid ||
    (typeof navigator !== 'undefined' && navigator.userAgent.match(/webOS|BlackBerry|IEMobile|Opera Mini/i) !== null);
  const isDesktop = !isMobile;
  const deviceType = isIOS ? 'ios' : isAndroid ? 'android' : 'web';

  useEffect(() => {
    if (OfferModalData?.goal_url && OfferModalData?.goal_url !== '' && OfferModalData?.goal_url !== 'null') {
      const fetchGoalUrl = async () => {
        try {
          let goalUrl = OfferModalData.goal_url;
          if (goalUrl && goalUrl.startsWith('http://')) {
            goalUrl = goalUrl.replace('http://', 'https://');
          }
          const response = await fetch(goalUrl);
          const data = await response.json();
          if (data.status === 'success') {
            setGoal(data?.tiers || []);
          }
          // You can store this in state, e.g. setGoalUrlData(data)
        } catch (error) {
          console.log('🚀 ~ fetchGoalUrl ~ error:', error);
        }
      };
      fetchGoalUrl();
    }
  }, [JSON.stringify(OfferModalData?.goal_url)]);

  const appendUrl = (url: string, param: string | string[], value: string) => {
    try {
      const urlObject = new URL(url);
      if (Array.isArray(param)) {
        // If param is an array, append each param with the same value
        param.forEach((p) => {
          urlObject.searchParams.append(p, value);
        });
      } else {
        // Single param case
        urlObject.searchParams.append(param, value);
      }
      return urlObject.toString();
    } catch (error) {
      console.error('Invalid URL:', error);
      return url;
    }
  };

  const handleOutRedirect = async () => {
    // Track the click regardless of redirect type
    const body = {
      platform: deviceType,
      task_type: 'tasks',
      network: OfferModalData?.network,
      campaign_id: OfferModalData?.task_id,
    };

    const res = await public_post_api({ path: 'clicks/insert', body: body });
    let finalUrl = OfferModalData?.url;

    if (res?.data && OfferModalData?.url_param) {
      finalUrl = appendUrl(finalUrl, OfferModalData.url_param, res.data);
    }

    // Determine if the offer is compatible with the current device
    const offerPlatforms = OfferModalData?.platforms || [];
    const isDesktopOffer = offerPlatforms.includes(config.DESKTOP_KEY);
    const isIOSOffer = offerPlatforms.includes(config.IOS_KEY);
    const isAndroidOffer = offerPlatforms.includes(config.ANDROID_KEY);

    // Check if there's a platform mismatch requiring QR code
    const showQRCode =
      // Desktop user trying to access mobile-only offer
      (isDesktop && !isDesktopOffer && (isIOSOffer || isAndroidOffer)) ||
      // iOS user trying to access Android-only offer
      (isIOS && isAndroidOffer && !isIOSOffer) ||
      // Android user trying to access iOS-only offer
      (isAndroid && isIOSOffer && !isAndroidOffer);

    if (showQRCode) {
      outUrlOnOpenChange();
    } else {
      // Direct redirect case
      if (isDesktop) {
        window.open(finalUrl, '_blank');
      } else {
        if (typeof window !== 'undefined' && window.ReactNativeWebView !== undefined && OfferModalData?.open_external_browser) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: `OPEN_IN_EXTERNAL_BROWSER`,
              url: finalUrl,
            })
          );
        } else {
          window.open(finalUrl, '_blank', 'noopener,noreferrer');
        }
      }
    }
  };

  const profilePicValidationSchema = Yup.object().shape({
    receipt: Yup.mixed()
      .required(t('screenshot_required'))
      .test('fileSize', t('file_too_large'), (value: any) => {
        if (!value) return true;
        return value.size <= MAX_FILE_SIZE;
      })
      .test('fileType', t('unsupported_file_format'), (value: any) => {
        if (!value) return true;
        const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        return supportedFormats.includes(value.type);
      }),
  });

  const handleUploadScreenShot = (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      let form_body = new FormData();
      const body = {
        platform: deviceType,
        campaignId: OfferModalData?.task_id,
        network: OfferModalData?.network,
        screenshot: values.receipt,
      };
      for (let key in body) {
        form_body.append(key, body[key]);
      }
      public_post_api({ path: `tasks/upload`, body: form_body, addContentType: false })
        .then(async (res) => {
          if (res?.success && !res?.error) {
            setUploadedScreenShot(res?.data?.upload_path);
            Toast.success(t('screenshot_uploaded_successfully'));
          } else {
            Toast.error(res?.error);
          }
        })
        .finally(() => setSubmitting(false));
    } catch (error) {
      console.error('Error uploading screen shot', error);
      setSubmitting(false);
    }
  };
  return (
    <>
      <div className="px-4 sm:px-6 pt-6 space-y-6">
        {OfferModalData.banner_image && (
          <div className="-mx-4 sm:-mx-6 -mt-6 h-32 sm:h-[200px] overflow-hidden">
            <Image
              className="w-full h-full object-cover"
              src={OfferModalData.banner_image}
              width={500}
              height={100}
              alt="icons"
            />
          </div>
        )}
        {loading ? (
          <OfferModalSkeleton variant={'header'} />
        ) : (
          <div className="flex items-center gap-3.5">
            <div className="relative w-[90px] h-[90px] flex-shrink-0 rounded-lg overflow-hidden">
              {OfferModalData?.image ? (
                <Image className="w-full h-full object-cover" src={OfferModalData?.image} width={90} height={90} alt="logo" />
              ) : (
                <Image
                  className="w-full h-full object-cover"
                  src="/images/offer-1.png"
                  width={90}
                  height={90}
                  alt="fallback image"
                />
              )}
              {OfferModalData?.platforms?.length > 0 && (
                <div className="absolute top-1.5 right-1.5 px-1 py-1 flex items-center gap-1 bg-overlay/50 rounded-full z-[1]">
                  {OfferModalData?.platforms?.includes(config.DESKTOP_KEY) && (
                    <Image
                      loading="lazy"
                      className="size-3 sm:size-4"
                      src="/images/desktop.png"
                      width={25}
                      height={25}
                      alt="logo"
                    />
                  )}
                  {OfferModalData?.platforms?.includes(config.ANDROID_KEY) && (
                    <Image
                      loading="lazy"
                      className="size-3 sm:size-4"
                      src="/images/android.png"
                      width={25}
                      height={25}
                      alt="logo"
                    />
                  )}
                  {OfferModalData?.platforms?.includes(config.IOS_KEY) && (
                    <Image loading="lazy" className="size-3 sm:size-4" src="/images/ios.png" width={25} height={25} alt="logo" />
                  )}
                </div>
              )}
            </div>

            <div className="w-full space-y-1">
              <h4 className="text-white font-semibold line-clamp-2 pr-3">{OfferModalData?.name}</h4>
              <div className="flex items-end justify-between gap-2">
                <p className="text-white text-2xl font-bold tracking-[0.04em]">
                  {getCurrencyString(OfferModalData?.payout ? OfferModalData?.payout : 0)}
                </p>
                <OfferCategoriesBadge
                  name={OfferModalData?.category?.name}
                  backgroundColor={OfferModalData?.category?.bg_color}
                  textColor={OfferModalData?.badgeColor}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="h-full px-4 sm:px-6 overflow-y-auto">
        {loading ? (
          <OfferModalSkeleton />
        ) : (
          <div className="space-y-3 sm:space-y-6">
            <div className="space-y-3 sm:space-y-6">
              {OfferModalData?.description && (
                <Card
                  size="sm"
                  variant="white"
                  className="[&>p]:mb-1 [&>p]:text-sm [&>p]:text-white [&>p]:font-semibold [&>ul]:mb-1 [&>ul]:list-disc [&>ul]:list-inside [&>ul>li]:text-xs"
                >
                  <p>{t('description')}</p>
                  <span
                    className="mb-1 list-disc text-xs list-inside cms-box"
                    dangerouslySetInnerHTML={{ __html: OfferModalData?.description }}
                  ></span>
                </Card>
              )}

              {/* more details */}
              <div className="space-y-2 sm:space-y-2.5">
                <button
                  className="inline-flex items-center gap-1.5 text-white text-sm font-semibold"
                  onClick={() => setIsMoreDetail(!isMoreDetail)}
                >
                  {t('more_info')}{' '}
                  <span>
                    <ChevronDownIcon className={`size-3 stroke-[3px] ${isMoreDetail && 'rotate-180'} transition-ease`} />
                  </span>
                </button>
                <Card
                  size="sm"
                  variant="white"
                  className={`${
                    isMoreDetail ? 'h-16 sm:h-20 p-3' : '!mt-0 !p-0 h-0 invisible'
                  } flex items-center justify-between gap-2 sm:gap-3 transition-height ease-[ease] duration-500`}
                >
                  <div className="px-2 sm:px-3 text-center space-y-1 sm:space-y-1.5">
                    <p
                      className={`text-whites font-semibold text-xs sm:text-sm line-clamp-1 break-all ${
                        OfferModalData?.status === 'completed'
                          ? 'text-green-500'
                          : OfferModalData?.status === 'not_started'
                          ? 'text-red'
                          : 'text-blue-700'
                      }`}
                    >
                      {OfferModalData?.status === 'completed'
                        ? t('completed')
                        : OfferModalData?.status === 'not_started'
                        ? t('not_started')
                        : t('in_progress')}
                    </p>
                    <p className="text-xxs sm:text-xs">{t('status')}</p>
                  </div>
                  {OfferModalData?.category?.name ? (
                    <>
                      <div className="h-7 w-[1px] bg-gray-400 rounded-full"></div>
                      <div className="px-2 sm:px-3 text-center space-y-1 sm:space-y-1.5">
                        <p className="text-white font-semibold text-xs sm:text-sm line-clamp-1 break-all">
                          {OfferModalData?.category?.name}
                        </p>
                        <p className="text-xxs sm:text-xs">{t('category')}</p>
                      </div>
                    </>
                  ) : null}
                  <div className="h-7 w-[1px] bg-gray-400 rounded-full"></div>
                  <div className="px-2 sm:px-3 text-center space-y-1 sm:space-y-1.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="flex-shrink-0 h-5">
                        {OfferModalData?.provider?.logo && (
                          <Image
                            className="min-h-5 max-h-5 !w-auto !h-auto"
                            src={OfferModalData?.provider?.logo}
                            width={300}
                            height={80}
                            alt="icon"
                          />
                        )}
                      </div>
                      {/* <p className="text-white font-semibold text-xs sm:text-sm line-clamp-1 break-all">
                          {OfferModalData?.provider?.name}
                        </p> */}
                    </div>
                    <p className="text-xxs sm:text-xs">{t('provider')}</p>
                  </div>
                </Card>
              </div>

              {/* instructions */}
              {OfferModalData?.instructions && (
                <Card
                  size="sm"
                  variant="white"
                  className="[&>p]:mb-1 [&>p]:text-sm [&>p]:text-white [&>p]:font-semibold [&>ul]:mb-1 [&>ul]:list-disc [&>ul]:list-inside [&>ul>li]:text-xs"
                >
                  <p>{t('instructions')}</p>
                  <span
                    className="mb-1 list-disc text-xs list-inside cms-box"
                    dangerouslySetInnerHTML={{ __html: OfferModalData?.instructions }}
                  ></span>
                </Card>
              )}
            </div>
            {OfferModalData?.goals?.length > 0 && (
              <div className="space-y-2 sm:space-y-2.5">
                <p className="text-white text-sm font-semibold">{t('rewards')}</p>
                {OfferModalData?.goals?.map((goal: any, index: number) => (
                  <div className="space-y-2 sm:space-y-2.5" key={index}>
                    <div className="bg-white-gr rounded-lg p-2 flex items-center gap-3 text-white text-xs font-semibold">
                      <div className="w-full flex items-center gap-3">
                        <p className="min-w-14 flex-shrink-0 bg-gray-490 text-black rounded-lg px-2 py-1.5 text-center">
                          {getCurrencyString(goal?.cashback)}
                        </p>
                        <p>{goal?.name}</p>
                      </div>
                      {goal?.user_status == 'completed' && <CheckCircle className="flex-shrink-0 size-5 sm:size-6 text-green" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {goal?.length > 0 && (
              <div className="space-y-2 sm:space-y-2.5">
                <p className="text-white text-sm font-semibold">{t('rewards')}</p>
                {goal?.map((goal: any, index: number) => (
                  <div className="space-y-2 sm:space-y-2.5" key={index}>
                    <div className="bg-white-gr rounded-lg p-2 flex items-center gap-3 text-white text-xs font-semibold">
                      <div className="w-full flex items-center gap-3">
                        <p className="min-w-14 flex-shrink-0 bg-gray-490 text-black rounded-lg px-2 py-1.5 text-center">
                          {getCurrencyString(goal?.currency)}
                        </p>
                        <p>{goal?.requirements}</p>
                      </div>
                      {goal?.status == 'completed' && <CheckCircle className="flex-shrink-0 size-5 sm:size-6 text-green" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {OfferModalData?.screenshot_upload ? (
              <Formik
                initialValues={{
                  receipt: OfferModalData?.user_screenshot_upload ? OfferModalData?.user_screenshot_upload : '',
                }}
                enableReinitialize
                validationSchema={profilePicValidationSchema}
                onSubmit={handleUploadScreenShot}
              >
                {({ setFieldValue, isSubmitting, handleSubmit, values }) => (
                  <form className="space-y-2" onSubmit={handleSubmit}>
                    <h4 className="text-xs sm:text-sm font-semibold">
                      {t(OfferModalData?.user_screenshot_upload ? 'your_uploaded_screenshot' : 'upload_screenshot')}
                    </h4>
                    {/* File upload input */}
                    {!OfferModalData?.user_screenshot_upload && !uploadedScreenShot ? (
                      <>
                        <InputFileUpload value={values.receipt} onChange={(e) => setFieldValue('receipt', e)} />
                        <div className="flex justify-between">
                          <ErrorMessage name="receipt" component="p" className="text-red-500 text-xs" />
                          <p className="text-xs font-medium text-right">
                            {t('max_allowed_file_size')} {MAXSIZE}. {t('accepted_formats_jpeg_jpg_png_pdf')}
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <ButtonComponent
                            disabled={isSubmitting}
                            role="button"
                            variant="outline"
                            label={t('send')}
                            type="submit"
                            onClick={handleSubmit}
                            icon={<PaperAirplaneIcon className="size-4" />}
                            isLoading={isSubmitting}
                            customClass="!px-2.5 !py-1.5"
                          />
                          <p className="text-xs font-medium">{t('only_png_jpg_images_are_supported')}</p>
                        </div>
                      </>
                    ) : (
                      <div className={`w-full flex justify-center items-center self-center p-3 bg-black rounded-lg`}>
                        <div className="flex-shrink-0 size-16 bg-black-600 rounded-lg self-center">
                          <Image
                            src={
                              OfferModalData?.user_screenshot_upload ? OfferModalData?.user_screenshot_upload : uploadedScreenShot
                            }
                            alt={''}
                            className="h-full w-full object-cover rounded-lg"
                            width={80}
                            height={80}
                          />
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </Formik>
            ) : null}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 px-4 sm:px-6 pb-6">
        <ButtonComponent
          role={'button'}
          variant="primary"
          label={`${
            locked
              ? t('to_unlock_this_offer_you_must_reach_tier').replace(':TIER', OfferModalData?.tier)
              : `${t('earn')} ${getCurrencyString(OfferModalData.payout ? OfferModalData.payout : 0)}`
          }`}
          icon={locked ? <Lock className="w-4 h-4" /> : <RocketLaunchIcon className="w-4 h-4" />}
          customClass="w-full py-3"
          onClick={() => handleOutRedirect()}
          isLoading={loading}
          disabled={locked}
        />
      </div>
      <OfferMobileModal outUrlIsOpen={outUrlIsOpen} outUrlOnOpenChange={outUrlOnOpenChange} data={OfferModalData} />
    </>
  );
};

export default SingleOfferCommonComponent;
