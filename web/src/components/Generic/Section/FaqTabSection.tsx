'use client';
import React, { useState } from 'react';
import Accordian from '@/components/Generic/Accordian';

const FaqTabSection = ({ tabs }: any) => {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.category_code);

  return (
    <div className="grid md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] gap-5 lg:gap-10">
      <div className="h-fit bg-border-gr p-[1px] rounded-[22px]">
        <nav className="h-full bg-black-600 rounded-[22px] p-4 space-y-2">
          {tabs?.map((tab: any, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab.category_code as number)}
              className={`w-full px-3 py-2 rounded-xl text-white text-left ${
                activeTab === tab.category_code ? 'bg-white-gr' : 'bg-transparent'
              } hover:bg-black-250 transition-ease`}
            >
              {tab.category_name}
            </button>
          ))}
        </nav>
      </div>
      <div className="space-y-4">
        {tabs
          .find((tab) => tab.category_code === activeTab)
          .faqs.map((item, index) => (
            <Accordian key={index} data={item} id={index} />
          ))}
      </div>
    </div>
  );
};

export default FaqTabSection;
