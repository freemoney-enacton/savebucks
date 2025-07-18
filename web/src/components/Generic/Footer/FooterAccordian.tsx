import { Accordion, AccordionItem } from '@nextui-org/react';
import { ChevronDown } from 'lucide-react';

export default function FooterAccordian({ title, children }: any) {
  function Icon() {
    return <ChevronDown size={20} className={`flex-shrink-0 text-footer-text transition-ease`} />;
  }
  return (
    <div className="sm:hidden">
      <Accordion
        className="bg-transparent rounded-[22px] p-0"
        itemClasses={{
          base: 'p-0',
          content: 'p-0 pt-2.5',
          heading: 'p-0',
          titleWrapper: 'p-0',
          title: 'p-0 text-base text-footer-text',
          trigger: 'p-0',
        }}
      >
        <AccordionItem key="1" title={title} className="p-[18px]s pb-5s" indicator={<Icon />}>
          {children}
        </AccordionItem>
      </Accordion>
    </div>
  );
}
