import { public_get_api } from '@/Hook/Api/Server/use-server';
import { auth } from '@/auth';
import AuthTab from '../AuthTab';
import OfferCard from '../Card/OfferCard';
import PartnerCard from '../Card/PartnerCard';

const CMSLoginSection = async () => {
  let [featuredTask, TaskProviderList] = await Promise.all([
    public_get_api({
      path: `tasks?page_number=1&limit=2&featured=1`,
    }),
    public_get_api({
      path: `providers/?type=tasks&featured=1`,
    }),
  ]);
  const session = await auth();
  return (
    <div className="relative z-0 overflow-x-clip overflow-y-visible section !pt-0">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-10 md:gap-6 items-center sm:pt-8 max-sm:max-w-[400px] mx-auto">
          <div className="relative space-y-2 sm:space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-6 md:max-w-[300px] lg:max-w-[524px] mx-auto">
              {featuredTask?.data?.length > 0 && featuredTask?.data.map((data, index) => <OfferCard data={data} key={index} />)}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-6 md:max-w-[300px] lg:max-w-[524px] mx-auto">
              {TaskProviderList?.data?.length > 0 &&
                TaskProviderList?.data?.slice(0, 2).map((data, index) => <PartnerCard data={data} key={index} />)}
            </div>
            <div className="md:hidden !mt-0 absolute right-1/2 transform translate-x-1/2 -bottom-8 z-[0] bg-orange h-14 w-14 filter blur-[72px] rounded-full"></div>
            <div className="max-md:hidden !mt-0 absolute left-[-12%] -bottom-full z-[0] bg-purple-600 h-[276px] w-[276px] filter blur-[322px] rounded-full"></div>
          </div>
          {!session?.user && (
            <div className="relative max-w-[460px] mx-auto w-full bg-black-600 p-4 sm:p-6 border border-gray-400 rounded-lg z-[1]">
              <AuthTab id="home-auth" />
            </div>
          )}
        </div>
      </div>
      <div className="absolute max-md:-top-20 md:bottom-24 -left-10 sm:left-0 -right-10 sm:right-0 opacity-15 z-[-1] transform max-md:rotate-12"></div>
    </div>
  );
};

export default CMSLoginSection;
