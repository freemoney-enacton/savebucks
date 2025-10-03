export interface DaisyconAttribution {
  utmSource: string | null;
  affiliateClickCode: string | null;
}

const DAISYCON_SOURCE = 'daisycon';

export const extractDaisyconAttribution = (cookies: Record<string, any>): DaisyconAttribution => {
  const utmSourceRaw = typeof cookies?.utm_source === 'string' ? cookies.utm_source : null;
  const publisherId = typeof cookies?.publisher_id === 'string' ? cookies.publisher_id : null;
  const transactionId = typeof cookies?.transaction_id === 'string' ? cookies.transaction_id : null;

  if (
    utmSourceRaw &&
    publisherId &&
    transactionId &&
    utmSourceRaw.toLowerCase() === DAISYCON_SOURCE
  ) {
    return {
      utmSource: `${DAISYCON_SOURCE}_${publisherId}`,
      affiliateClickCode: transactionId,
    };
  }

  return {
    utmSource: null,
    affiliateClickCode: null,
  };
};
