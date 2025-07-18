'use client';

const urlSearchParams = ({ countries, platform, page_number, limit, featured, network, category, name, sort_by }) => {
  const urlSearchParams = new URLSearchParams('');

  if (countries) countries.forEach((country) => urlSearchParams.append('countries', country.toString()));
  if (platform && platform !== 'undefined') urlSearchParams.append('platform', platform.toString());
  if (page_number) urlSearchParams.append('page', page_number.toString());
  if (limit) urlSearchParams.append('limit', limit.toString());
  if (featured) urlSearchParams.append('featured', featured.toString());
  if (network) urlSearchParams.append('network', network.toString());
  if (category) urlSearchParams.append('category', category.toString());
  if (name && name !== 'undefined') urlSearchParams.append('name', name);
  if (sort_by && sort_by !== 'undefined') urlSearchParams.append('sort_by', sort_by);

  return urlSearchParams.toString();
};

export default urlSearchParams;
