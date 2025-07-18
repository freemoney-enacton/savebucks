'use client';
import Input from '@/components/Core/Input';
import { Toast } from '@/components/Core/Toast';
import { config } from '@/config';
import { Accordion, AccordionItem } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import ButtonComponent from '../ButtonComponent';
import { useTranslation } from '@/i18n/client';
import { objectAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { ErrorMessage, Formik } from 'formik';
import { LoaderCircle } from 'lucide-react';
import { useRecoilState } from 'recoil';
import * as Yup from 'yup';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { CheckIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PencilIcon } from '@heroicons/react/24/solid';

const ReferNEarnLinkSection = ({ TermsNCondition }: any) => {
  const [edit, setEdit] = useState(false);
  const [slug, setSlug] = useState('');

  const settings: any = useRecoilState(objectAtomFamily(atomKey.settings));

  const { t } = useTranslation();
  const { public_post_api } = usePublicApi();
  const { data: session, update }: any = useSession();
  let referralLink = config.REFERRAL_URL + '?referral=' + session?.user?.user?.referral_code;
  const encodedReferralUrl = encodeURIComponent(referralLink);
  const referralSocials = [
    {
      url: `https://api.whatsapp.com/send?text=${t('join_refer')}%20${encodedReferralUrl}`,
      img: '/images/whatsapp.png',
      name: 'Whatsapp',
    },
    {
      url: `https://t.me/share/url?url=${encodedReferralUrl}&text=${t('join_refer')}`,
      img: '/images/telegram.png',
      name: 'Telegram',
    },
    {
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedReferralUrl}`,
      img: '/images/facebook-refer.png',
      name: 'Facebook',
    },
    {
      url: `https://twitter.com/intent/tweet?text=${t('join_refer')}&url=${encodedReferralUrl}`,
      img: '/images/twitter.png',
      name: 'Twitter',
    },
  ];

  const copyReferralLink = () => {
    let link = config.REFERRAL_URL + '?referral=' + session?.user?.user?.referral_code;
    navigator.clipboard.writeText(link);
    Toast.show(t('copied_to_clipboard'));
  };

  const changeReferralCode = async (values, { setSubmitting, resetForm }) => {
    try {
      const user: any = await public_post_api({
        path: `user/r/${values.slug}`,
        body: {},
      });
      if (user.success && user.data) {
        await update({ updated: true });
        setSubmitting(false);
        setEdit(false);
        resetForm();
        Toast.success(user?.msg || t('referral_code_updated_successfully'));
      } else {
        setSubmitting(false);
        Toast.error(user.error || t('referral_code_updated_failed'));
      }
    } catch (error) {
      Toast.error(t('referral_code_updated_failed'));
      setSubmitting(false);
    }
  };
  const referralCodeValidationSchema = Yup.object().shape({
    slug: Yup.string()
      .min(5, t('referral_code_must_be_at_least_5_characters'))
      .max(10, t('referral_code_must_be_at_most_10_characters'))
      .matches(/^[A-Za-z]+$/, t('referral_code_must_contain_only_alphabate'))
      .required(t('slug_is_required')),
  });
  const DefaultContent = () => {
    let referral_bonus = settings?.[0]?.bonuses?.find((bonus: any) => bonus.code == 'refer_bonus')?.amount;
    let referral_percent = settings?.[0]?.default?.referral_percent;
    let joining_bonus = settings?.[0]?.bonuses?.find((bonus: any) => bonus.code == 'join_no_refer')?.amount;
    let TermsNConditionFormatted = TermsNCondition?.description
      ? TermsNCondition?.description
          ?.replace('%{referral_bonus}', referral_bonus ? `${settings?.[0]?.currencySymbol}${referral_bonus}` : '')
          .replace('%{referral_percent}', referral_percent ? settings?.[0]?.default?.referral_percent + '%' : '0%')
          .replace('%{joining_bonus}', joining_bonus ? `${settings?.[0]?.currencySymbol}${joining_bonus}` : '')
      : '';
    return (
      <div className="max-w-[566px] mx-auto text-start">
        {TermsNConditionFormatted && (
          <div
            className="[&>ul]:pt-1 [&>ul]:space-y-1.5 [&>ul]:sm:space-y-2.5 [&>ul]:list-disc [&>ul]:list-inside [&>ul>li]:sm:text-sm [&>ul>li]:text-xs text-xs sm:text-sm cms-box"
            dangerouslySetInnerHTML={{ __html: TermsNConditionFormatted }}
          ></div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="relative grid lg:grid-cols-2 gap-5 lg:gap-20 text-white">
        <div className="space-y-2 sm:space-y-3">
          <p className="text-base sm:text-xl font-semibold">{t('share_your_referral_link')}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="w-full sm:max-w-[400px] px-3 sm:px-5 py-2.5 sm:py-4 bg-black rounded-lg">
              <p className="text-xs sm:text-sm line-clamp-1 break-all">
                {config.REFERRAL_URL}
                {'?referral='}
                {session?.user?.user?.referral_code}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                className="bg-gray-500 p-2 rounded-full"
                onClick={() => {
                  setEdit(true);
                  setSlug('');
                }}
              >
                <PencilIcon className="size-4 text-white" />
              </button>
              <ButtonComponent
                onClick={() => copyReferralLink()}
                role="button"
                variant="primary"
                label={t('copy')}
                customClass="!py-1.5 !px-2 !min-w-0 !text-xs !text-btn-primary-text"
              />
            </div>
          </div>
          <div>
            {edit && (
              <Formik initialValues={{ slug: '' }} validationSchema={referralCodeValidationSchema} onSubmit={changeReferralCode}>
                {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                  <form onSubmit={handleSubmit} className="flex items-center gap-2 text-sm">
                    <div className="max-w-[227px]">
                      <Input
                        type="text"
                        id="slug"
                        placeholder={slug}
                        customClass="!py-2.5"
                        value={values.slug}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.slug}
                        hint={
                          <>
                            <ErrorMessage name="slug" component="span" />
                          </>
                        }
                      />
                    </div>
                    <button type="submit" className="bg-green-500 p-2 rounded-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <LoaderCircle className="w-4 h-4 text-black stroke-[3px]" />
                      ) : (
                        <CheckIcon className="w-4 h-4 text-black stroke-[3px]" />
                      )}
                    </button>
                    <button type="button" className="bg-gray-500 p-2 rounded-full" onClick={() => setEdit(false)}>
                      <XMarkIcon className="w-4 h-4 text-black stroke-[3px]" />
                    </button>
                  </form>
                )}
              </Formik>
            )}
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <p className="text-base sm:text-xl font-semibold">{t('share_your_referral_link_via')}</p>
          <div className="flex items-center gap-3 sm:gap-4">
            {referralSocials.map((data, index) => (
              <a href={data.url} key={index} className="block h-7 sm:h-10 w-7 sm:w-10" target="_blank">
                {data.img ? (
                  <Image className="max-h-7 sm:max-h-10 !w-auto !h-auto" src={data.img} width={40} height={40} alt={data.name} />
                ) : null}
              </a>
            ))}
          </div>
        </div>
        {/* divider */}
        <div className="max-lg:hidden absolute top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[50px] bg-gray-700"></div>
      </div>
      {/* accordian */}
      <div className="text-center pt-4 sm:pt-7">
        <Accordion
          isCompact
          defaultExpandedKeys={['1']}
          itemClasses={{
            base: 'py-0 w-full',
            titleWrapper: 'w-fit flex-[none]',
            title: 'text-sm font-semibold',
            trigger: 'px-0 py-0 w-full flex items-center justify-center',
            indicator: '[&>svg]:stroke-[3px]',
            content: 'px-0',
            heading: '!w-full',
          }}
        >
          <AccordionItem
            key="1"
            aria-label={t('terms_and_conditions')}
            title={TermsNCondition?.title}
            indicator={<ChevronDownIcon className="w-4 h-4 text-white" />}
            classNames={{ content: 'p-0' }}
          >
            <DefaultContent />
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default ReferNEarnLinkSection;
