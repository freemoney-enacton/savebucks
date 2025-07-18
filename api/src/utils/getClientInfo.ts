export const getIpDetails = async (clientIp: any) => {
  try {
    const fetchIp = await fetch(
      `http://ip-api.com/json/${clientIp}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`
    );

    if (!fetchIp.ok) {
      console.error("Failed to fetch IP details. Status code:", fetchIp.status);
      return null;
    }

    const response = await fetchIp.json();

    return response;
  } catch (error) {
    console.error("An error occurred while fetching IP details:", error);
  }
};
