'use client';
import AuthModal from '@/components/Core/AuthModal';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { Spinner, useDisclosure } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ModalComponent from '../Modals/ModalComponent';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { useTranslation } from '@/i18n/client';
import { SvgStar } from '../Icons';

export default function PartnerCard({ data, providerType }: any) {
  const { t } = useTranslation();
  const [SurveyURL, setSurveyURL] = useState('');
  const [surveyLoading, setSurveyLoading] = useState(false);
  const { isOpen: outUrlIsOpen, onOpenChange: outUrlOnOpenChange } = useDisclosure();
  const { isOpen: authIsOpen, onOpen: authOnOpen, onOpenChange: authOnOpenChange, onClose: authOnClose } = useDisclosure();
  const { status } = useSession();
  const router = useRouter();
  const { public_get_api } = usePublicApi();

  const handleProviderRedirect = () => {
    setSurveyLoading(true);
    if (status === 'unauthenticated') {
      authOnOpen();
      setSurveyLoading(false);
    } else {
      switch (data?.render_type) {
        case 'same_tab':
          setSurveyLoading(false);
          router.push(`/${providerType}/${data.code}`);
          break;
        case 'new_tab':
          setSurveyLoading(false);
          window.open(`${window.location.origin}/${providerType}/${data.code}`, '_blank');
          break;
        case 'popup':
          public_get_api({ path: providerType === 'surveys' ? `surveys/${data.code}` : `tasks/redirect/${data.code}` })
            .then((res) => {
              if (res?.data && res?.success) {
                setSurveyURL(providerType === 'surveys' ? res?.data[0]?.survey_url : res?.data[0]?.offer_url);
                outUrlOnOpenChange();
              }
            })
            .finally(() => {
              setTimeout(() => {
                setSurveyLoading(false);
              }, 500);
            });

          break;
        default:
          break;
      }
    }
  };
  const handleTaskClick = () => {
    setSurveyLoading(true);
    if (status === 'unauthenticated') {
      authOnOpen();
      setSurveyLoading(false);
    } else {
      public_get_api({ path: providerType === 'surveys' ? `surveys/${data.code}` : `tasks/redirect/${data.code}` })
        .then((res) => {
          if (res?.data && res?.success) {
            handleProviderRedirect();
          } else {
            router.push(`/offers?network=${data.code}&network_name=${data.name}`);
          }
        })
        .finally(() => {
          setTimeout(() => {
            setSurveyLoading(false);
          }, 500);
        });
    }
  };
  return (
    <>
      <div
        onClick={providerType === 'survey' ? handleProviderRedirect : handleTaskClick}
        className="group p-[1px] bg-border-hover-gr rounded-[9px] cursor-pointer animate-fade-in"
      >
        <div className="relative bg-black-250 p-2 sm:p-3 flex items-center gap-2 sm:gap-2.5 rounded-lg overflow-hidden">
          {surveyLoading ? (
            <div className="flex items-center justify-center h-[100px] w-full place-content-center">
              <Spinner size="sm" className="text-white self-center" />
            </div>
          ) : (
            <>
              <div className="size-20 sm:size-[100px] flex-shrink-0 p-2 sm:p-3 border border-gray-400 rounded-xl overflow-hidden bg-white-gr grid place-content-center">
                {data?.logo && <Image className="w-auto h-auto" src={data?.logo} width={90} height={90} alt="logo" />}
              </div>
              <div className="w-full space-y-3">
                <div>
                  <h4 className="text-white text-sm sm:text-base font-semibold line-clamp-1 break-all">{data.name}</h4>
                  {/* <p className="text-xs sm:text-xs font-medium line-clamp-1 break-all">User satisfaction</p> */}
                </div>
                {data?.rating > 0 && (
                  <>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, index) => {
                        const fullStar = index < Math.floor(data.rating);

                        if (fullStar) {
                          return <SvgStar key={index} className="size-3 sm:size-4 text-yellow-500" />;
                        }

                        return <SvgStar key={index} className="size-3 sm:size-4 text-yellow-500/40" />;
                      })}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* hover effect */}
          <div className="opacity-0 group-hover:opacity-100 absolute inset-0 h-full w-full grid place-content-center bg-overlay/25 z-0 transition-ease filter group-hover:backdrop-blur-[1px]">
            <div className="text-black space-y-1">
              <div className="size-[30px] sm:size-10 mx-auto grid place-content-center bg-black rounded-full">
                <div className="w-0 h-0 ml-0.5 border-l-[8px] sm:border-l-[12px] border-l-white border-y-[6px] sm:border-y-[8px] border-y-transparent border-solid"></div>
              </div>
              <p className="text-xs font-semibold">{providerType === 'survey' ? t('start_survey') : t('start_offer')}</p>
            </div>
          </div>
        </div>
      </div>
      <ModalComponent isOpen={outUrlIsOpen} onOpenChange={outUrlOnOpenChange} customClass="relative !p-0 max-w-[570px]">
        {surveyLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Spinner size="sm" className="text-white self-center" />
          </div>
        ) : (
          <>
            <div className="iframe-parent">
              <button
                className="absolute bottom-0 right-0 p-3 bg-black/10 rounded-xl"
                onClick={() => window.open(SurveyURL, '_blank')}
              >
                <ArrowTopRightOnSquareIcon className="size-5 text-white cursor-pointer" />
              </button>
              <iframe src={SurveyURL} className="w-full min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-88px)]"></iframe>
            </div>
          </>
        )}
      </ModalComponent>
      <AuthModal isOpen={authIsOpen} onOpenChange={authOnOpenChange} onClose={authOnClose} />
    </>
  );
}
