'use client';
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Accordion, AccordionItem } from '@nextui-org/react';

export default function AccordionComponent({ data, id }: any) {
  function Icon({ id, open }) {
    return (
      <ChevronDown
        size={20}
        className={`flex-shrink-0 text-white transform transition-all duration-300 ${open === id ? 'rotate-180' : ''}`}
      />
    );
  }

  return (
    <Accordion
      className="p-0 bg-black-600 border border-gray-400 rounded-xl"
      itemClasses={{
        base: 'p-0',
        content: 'p-0 pt-5',
        heading: 'p-0',
        titleWrapper: 'p-0',
        title: 'p-0 text-base text-white',
        trigger: 'p-0',
        indicator: 'data-[open=true]:-rotate-180',
      }}
    >
      <AccordionItem
        key="1"
        title={data.question}
        className="p-[18px]"
        classNames={{
          heading: 'font-medium',
        }}
        indicator={<Icon id={id} open={true} />}
      >
        <div className="h-[1px] w-full bg-border-gr3 mb-5"></div>
        <p className="text-sm">{data.answer}</p>
      </AccordionItem>
    </Accordion>
  );
}
