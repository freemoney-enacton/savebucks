import React from 'react';
import SectionTitleWithIcon from '../../Core/SectionTitleWithIcon';
import LineChart from './LineChart';

export default function ChartComponent({ title, footerText, data, img, tooltipLabel, showTooltipValueAsCurrency }: any) {
  return (
    <div className="space-y-4">
      <SectionTitleWithIcon img={img} title={title} />
      <LineChart data={data} showTooltipValueAsCurrency={showTooltipValueAsCurrency} tooltipLabel={tooltipLabel} />
      <div className="sm:pt-4">
        <p className="bg-white-heading-gr text-gradient font-medium text-center">{footerText}</p>
      </div>
    </div>
  );
}
