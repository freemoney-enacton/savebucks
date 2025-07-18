'use client';
import { useRecoilState } from 'recoil';
import { atomKey } from '@/recoil/atom-key';
import { arrayAtomFamily } from '@/recoil/atom';
import { Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { usePublicApi } from '@/Hook/Api/Client/use-client';
import { useTranslation } from '@/i18n/client';

const ProviderSelect = ({ type, selectedSetting, setSelectedSetting }) => {
  const [surveyProviderList, setSurveyProviderList] = useRecoilState<any>(arrayAtomFamily(atomKey.surveyProviderList));
  const [taskProviderList, setTaskProviderList] = useRecoilState<any>(arrayAtomFamily(atomKey.taskProviderList));
  const [activeTaskProviderList, setActiveTaskProviderList] = useRecoilState<any>(
    arrayAtomFamily(atomKey.activeTaskProviderList)
  );
  const [isOpen, setIsOpen] = useState(false);
  // const [providerInfo, setProviderInfo] = useState<any>(null);
  const { public_get_api } = usePublicApi();
  const { t } = useTranslation();

  const defaultOption = {
    network_code: 'all',
    network_name: type === 'surveys' ? t('all_survey_partners') : t('all_offer_partners'),
    network_icon: '',
  };

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchProviderList = async (apiPath, setStateFunction) => {
      try {
        const res = await public_get_api({ path: apiPath });
        if (res.success && res.data) {
          setStateFunction([defaultOption, ...res.data]);
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if (taskProviderList.length === 0) {
      fetchProviderList('cbearnings/provider-list?type=surveys', setSurveyProviderList);
    }
    if (surveyProviderList.length === 0) {
      fetchProviderList('cbearnings/provider-list?type=tasks', setTaskProviderList);
    }
    if (activeTaskProviderList.length === 0) {
      fetchProviderList('tasks/active-task-poviders', setActiveTaskProviderList);
    }
  }, []);

  const handleSelectionChange = (value) => {
    if (value === 'all') {
      setSelectedSetting('');
    } else {
      setSelectedSetting(value);
    }
    // const providerList =
    //   type === 'surveys' ? surveyProviderList : type === 'active_task' ? activeTaskProviderList : taskProviderList;
    // setProviderInfo(providerList.find((item) => item.network_code === value));
  };

  const providerList =
    type === 'surveys' ? surveyProviderList : type === 'active_task' ? activeTaskProviderList : taskProviderList;

  return (
    <Select
      isOpen={isOpen}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      onClose={() => setIsOpen(false)}
      placeholder={type === 'surveys' ? t('all_survey_partners') : t('all_offer_partners')}
      onChange={(e) => handleSelectionChange(e.target.value)}
      defaultSelectedKeys={['all']}
      value={selectedSetting}
      className="max-w-[200px] max-sm:self-end !rounded-lg"
      disallowEmptySelection={true}
      classNames={{
        label: 'group-data-[filled=true]:-translate-y-5',
        trigger:
          'border border-gray-400 !rounded-lg bg-black bg-white-gr justify-between py-2 !px-4 sm:p-2.5 h-fit min-h-[unset] [&>svg]:static [&>div]:!w-auto gap-1 sm:gap-2 data-[hover=true]:bg-white-gr',
        listboxWrapper: 'max-h-[200px]',
        listbox: 'border border-gray-400 rounded-lg',
        selectorIcon: 'shrink-0',
      }}
      listboxProps={{
        itemClasses: {
          base: [
            'rounded-full',
            'text-white',
            'transition-opacity',
            'data-[hover=true]:bg-transparent',
            'data-[selectable=true]:!bg-transparent',
            'data-[pressed=true]:bg-transparent',
            'data-[focus-visible=true]:ring-0',
          ],
        },
      }}
      popoverProps={{
        classNames: {
          base: '',
          content: 'p-0 bg-black-600 min-w-16 !rounded-lg',
        },
      }}
    >
      {providerList.map((item) => (
        <SelectItem key={item.network_code} value={item.network_code}>
          {item.network_name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default ProviderSelect;
