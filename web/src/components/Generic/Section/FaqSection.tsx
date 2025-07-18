import Accordian from '@/components/Generic/Accordian';
import SectionTitle from '../../Core/SectionTitle';
import { public_get_api } from '@/Hook/Api/Server/use-server';
import Image from 'next/image';

export default async function FaqSection({ title }) {
  let [faqData] = await Promise.all([
    public_get_api({
      path: `cms/faq`,
    }),
  ]);
  if (faqData?.data?.length > 0) {
    return (
      <section className="section relative z-[1] overflow-hidden">
        <Image
          width={4000}
          height={2000}
          src="/images/faq-bg.webp"
          className="absolute top-1/2 -translate-y-1/2 left-0 w-full 2xl:max-w-[1150px] z-[-1]"
          alt="bg-img"
        />
        <div className="container">
          <div className="space-y-4 sm:space-y-10">
            <SectionTitle title={title} />
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              {faqData?.data.map((item, index) => (
                <Accordian key={index} data={item} id={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  } else {
    return null;
  }
}
