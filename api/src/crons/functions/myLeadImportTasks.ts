import axios from "axios";
import { determineAndAssignCategoryToTask, getNetworkDetails, RemoveTaskAndGoals, sluggify, UpsertData} from "./baseImportTask";

class RateLimiter {
    private requestCount: number = 0;
    private windowStart: number = Date.now();
    private readonly maxRequests: number = 20;
    private readonly windowDuration: number = 60 * 1000; // 1 minute in milliseconds
  
    async limit(): Promise<void> {
      const now = Date.now();
      const elapsedTime = now - this.windowStart;
  
      // Reset window if more than windowDuration has passed
      if (elapsedTime > this.windowDuration) {
        this.requestCount = 0;
        this.windowStart = now;
      }
  
      // Check if we've hit the limit
      if (this.requestCount >= this.maxRequests) {
        const waitTime = this.windowDuration - elapsedTime;
        if (waitTime > 0) {
          console.log(`Rate limit reached. Waiting ${waitTime}ms before next request.`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          // Reset for the new window
          this.requestCount = 0;
          this.windowStart = Date.now();
        }
      }
  
      // Increment the request count
      this.requestCount++;
    }
}

export async function handleMyLeadImportTasks(){
    const networkDetails = await getNetworkDetails("mylead");
    const apiUrl = `https://api.mylead.eu/api/external/v1`;
    let page = 1;
    let limit = 500;
    let hasMoreData=true;
    let import_id = "mylead_" + Math.random().toString(36).substring(2, 9); 
    
    let access_token=await getToken(apiUrl,networkDetails.pub_id!,networkDetails.api_key!);
    let expiresAt = Date.now() + (((access_token.tokenExpire ?? 3600) - 60) * 1000);
    while(hasMoreData) {
        //check for rate limit 
        await new RateLimiter().limit();
        //generate new token if access token is expired
        if(Date.now()>expiresAt){
            access_token=await getToken(apiUrl,networkDetails.pub_id!,networkDetails.api_key!);
            expiresAt = Date.now() + (((access_token.tokenExpire ?? 3600) - 60) * 1000);
        }
        const headers = {
            'Authorization': `Bearer ${access_token.tokenValue}`
        };
        const response = await axios.get(`${apiUrl}/campaigns`, {
            headers,
            params: {  page , limit },
        });
        if (response.status !== 200) {
            throw new Error("API request failed with status: " + response.status);
        }

        const data:any=response.data
        if(!data || data.status!=="success"){
            throw new Error("MyLead API Error")
        }

        const offers=data.data.campaigns
        if(offers.length>0){
          //transform data
          const transformedTaskData=await transformResponse(offers,import_id)
          //upsert data
          UpsertData(transformedTaskData)         
        }
        //remove previous goals
        await RemoveTaskAndGoals("mylead", import_id);
        //handle paginated data 
        console.log(data.pagination)
        if(data.pagination.next_page == null){
          hasMoreData=false
        }
        page++        
    }
}

async function getToken(apiUrl:string,username:string,password:string){
  await new RateLimiter().limit()
    const response=await axios.post(`${apiUrl}/auth/login`,{
        username,
        password
    })
    if (!response || response.status !== 200) {
        throw new Error("API request failed with status: " + response.status);
    }
    
    return {
        tokenType:response.data.data.token_type,
        tokenExpire:response.data.data.expires_in,
        tokenValue:response.data.data.access_token,
    }
}

async function transformResponse(
  offers: any[],
  import_id: string
) {
  const tasks=offers.map(async (offer:any)=>({
    network: "mylead",
    offer_id: `mylead_${offer.id}`,
    campaign_id: offer.id,
    name: JSON.stringify({ en: offer.name }),
    slug: 'mylead-'+ sluggify(offer.name),
    description: JSON.stringify(offer.description_lang),
    instructions:JSON.stringify(offer.short_description_lang),
    countries: JSON.stringify(
      cleanCountriesMyLead(offer.countries.map((c: any) => c))
    ),
    network_image: offer.logo,
    payout: getCurrency(offer),
    url:offer.preview_url,
    platforms: '["android","web","ios"]',
    category_id:await determineAndAssignCategoryToTask(offer),
    import_id:import_id,
    status: getCurrency(offer) == -1 ? 'draft' : 'publish',
    payout_type:offer.payments[0].type
  }
 )
)

return Promise.all(tasks);
}

const getCurrency = (offer: any): number => {
  const currstr = offer.payments[0].revenue;
  const currInNm = Number(currstr);
  if(Number.isNaN(currInNm)) return -1
  return currInNm;
}

export function cleanCountriesMyLead(countries: any) {
  if (countries.includes("*")) {
    return null;
  }
  return countries.map((country: any) => country.code.toUpperCase());
}


