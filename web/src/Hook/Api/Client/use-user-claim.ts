'use client';

import { useRecoilState } from 'recoil';
import { usePublicApi } from './use-client';
import { stringAtomFamily } from '@/recoil/atom';
import { atomKey } from '@/recoil/atom-key';
import { useState } from 'react';

const useUserClaim = () => {
  const { public_get_api } = usePublicApi();
  const [claimStoreList, setClaimStoreList]: any = useRecoilState(stringAtomFamily(atomKey.claim_store_list));
  const [claimLoading, setClaimLoading] = useState(true);

  const getClaimStoreList = () => {
    try {
      setClaimLoading(true);
      public_get_api({ path: 'cashback/claims/claim-stores' })
        .then((res: any) => {
          if (res.success && !res.error) {
            setClaimStoreList(res.data);
          }
        })
        .finally(() => setClaimLoading(false));
    } catch (error) {
      setClaimLoading(false);
    }
  };
  return {
    getClaimStoreList,
    claimStoreList,
    claimLoading,
  };
};

export default useUserClaim;
