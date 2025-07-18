import { useUtils } from '@/Hook/use-utils';
import { useTranslation } from '@/i18n/client';
import { Tooltip } from '@nextui-org/react';
import { Info } from 'lucide-react';
const Pills = ({ label, tooltip = false, created_at = '', tooltip_text = '', tooltip_status = '' }) => {
  const { t } = useTranslation();
  const { formattedDate } = useUtils();
  const statusColors = {
    pending: 'text-yellow-700 bg-yellow-100',
    hold: 'text-yellow-700 bg-yellow-100',
    confirmed: 'text-green-700 bg-green-100',
    Approved: 'text-green-700 bg-green-100',
    created: 'text-blue-700 bg-blue-100',
    open: 'text-blue-700 bg-blue-100',
    clicked: 'text-blue-700 bg-blue-100',
    declined: 'text-red-500 bg-red-100',
    Declined: 'text-red-500 bg-red-100',
    expired: 'text-red-500 bg-red-100',
    Expired: 'text-red-500 bg-red-100',
    completed: 'text-green-700 bg-green-100',
    tracked: 'text-green-700 bg-green-100',
    processing: 'text-yellow-700 bg-yellow-100',
    closed: 'text-yellow-700 bg-yellow-100',
    'In Review': 'text-yellow-700 bg-yellow-100',
  };

  return (
    <div className="flex flex-wrap max-sm:justify-end gap-2 ">
      <div className={`px-3 py-1 ${statusColors[label]} text-xs font-medium rounded-full flex items-center justify-center`}>
        <div className="capitalize">{label}</div>
        {tooltip && (label == 'processing' || label == 'pending' || label == tooltip_status) && (
          <div className="tooltip-wrapper">
            <Tooltip
              showArrow={true}
              content={`${tooltip_text ? tooltip_text : t('expires_on')} ${formattedDate(created_at)}`}
              classNames={{
                content: ['text-white text-xs'],
              }}
            >
              <Info className="size-3 ml-2" />
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pills;
