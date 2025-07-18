import axios from "axios";
import { db } from "../../database/database";
import { config } from "../../config/config";
import app from "../../app";

function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export async function translateTextGoogle(text: string | string[], targetLang: string, sourceLang: string): Promise<string | string[]> {
  try {
    
    const urlConfig = {
      method: 'get',
      url: 'https://translation.googleapis.com/language/translate/v2',
      params: {
        target: targetLang,
        source: sourceLang,
        key: config.env.translate.google
      },
      paramsSerializer: (params: any) => {
        const searchParams = new URLSearchParams();
        
        // Add all parameters except 'q'
        Object.entries(params).forEach(([key, value]) => {
          if (key !== 'q') {
            searchParams.append(key, value as string);
          }
        });
        
        // Add 'q' parameter(s) to send multiple strings max is 128
        if (Array.isArray(text)) {
          text.forEach(item => {
            searchParams.append('q', item);
          });
        } else {
          searchParams.append('q', text);
        }
        
        return searchParams.toString();
      }
    };
    
    const response = await axios(urlConfig);

    if(response.status != 200) {
      throw new Error("Translation failed: " + JSON.stringify(response.data?.error));
    }
    
    // Process the response
    const translations = response.data.data.translations;
    
    if (Array.isArray(text)) {
      return translations.map((t: any) => t.translatedText);
    } else {
      if (!translations[0]?.translatedText) {
        throw new Error("Translated item not found: " + JSON.stringify(response.data));
      }
      return translations[0].translatedText;
    }
  } catch (error: any) {
    console.error("Translation error details:", error.response?.data || error.message);
    throw new Error("Something went wrong while translating: " + error.message);
  }
}

export async function translateOfferwallContent(network: string, sourceLang: string): Promise<void> {
  console.log(`Starting translation job for network: ${network}, source language: ${sourceLang}`);
  const fallback_lang = await app.redis.get("fallback_lang");
  console.log("🚀 ~ translateOfferwallContent ~ fallback_lang:", fallback_lang)
  const targetLang = fallback_lang ? (isValidJSON(fallback_lang) ? JSON.parse(fallback_lang) : "de") : "de";
  console.log("🚀 ~ translateOfferwallContent ~ targetLang:", targetLang)
  
  let networks: string[] = [network];
  
  if (network === 'all') {
    const providers = await db
      .selectFrom("offerwall_networks")
      .select(["code"])
      .execute()
    if(!providers){
      throw new Error("Fetch Failed")
    }
    networks = providers.map(provider => provider.code);
  }
     
  for (const networkCode of networks) {
    await translateTasks(networkCode, targetLang, sourceLang);
    await translateTaskGoals(networkCode,targetLang,sourceLang)
  }
   
  console.log('Translation job completed');
}

async function translateTasks(network: string, targetLang: string, sourceLang: string): Promise<void> {
  console.log(`Translating tasks for network: ${network}, target language: ${targetLang}`);
  
  const offers=await db
    .selectFrom("offerwall_tasks")
    .select(["id","name","description","instructions"])
    .where("network","=",network)
    .where("is_translated","=",0)
    .limit(1000)
    .execute()

  if (offers.length === 0) {
    console.log(`No untranslated tasks found for network: ${network}`);
    return;
  }
  const translationPromises = offers.map(async (offer) => {
    try {
      // Create a simple object with fields that need translation
      // Parse the existing JSON strings
      const fieldsToTranslate = {
        name: offer.name ? JSON.parse(offer.name) : null,
        description: offer.description ? JSON.parse(offer.description) : null,
        instructions: offer.instructions ? JSON.parse(offer.instructions) : null
      };
      
      // Filter out null values
      const fieldsWithContent = Object.fromEntries(
        Object.entries(fieldsToTranslate).filter(([_, value]) => value !== null)
      );
      
      // Skip if no fields to translate
      if (Object.keys(fieldsWithContent).length === 0) {
        return false;
      }
      
      // Translate each field and update directly
      const updateData = { is_translated: 1 };
      
      // Get all texts that need translation
      const fieldEntries = Object.entries(fieldsWithContent);
      const textsToTranslate = fieldEntries.map(([_, content]) => {
        // If the source language entry contains a nested object, extract the text value
        return typeof content[sourceLang] === 'object' 
          ? content[sourceLang][sourceLang] 
          : content[sourceLang];
      });
      // Translate all texts in one batch
      const translatedTexts = await translateTextGoogle(textsToTranslate, targetLang, sourceLang);

      // Map the translated results back to their fields
      fieldEntries.forEach(([field, content], index) => {
        //@ts-ignore
        updateData[field] = JSON.stringify({
          [sourceLang]: typeof content[sourceLang] === 'object' 
            ? content[sourceLang][sourceLang] 
            : content[sourceLang],
          [targetLang]: Array.isArray(translatedTexts) ? translatedTexts[index] : translatedTexts
        });
      });
      
      // Update database
      await db.updateTable("offerwall_tasks")
        .set(updateData)
        .where("id", "=", offer.id)
        .execute();

      return true;
    } catch (error) {
      console.error(`Error processing offer ${offer.id}:`, error);
      return false;
    }
  });
  const results = await Promise.all(translationPromises);
  const successCount = results.filter(result => result).length;
  
  console.log(`Successfully translated ${successCount} out of ${offers.length} offers`);
  }

async function translateTaskGoals(network: string, targetLang: string, sourceLang: string): Promise<void> {
  console.log(`Translating task goals for network: ${network}, target language: ${targetLang}`);
  
  // Fetch task goals that need translation
  const goals = await db
    .selectFrom("offerwall_task_goals")
    .select(["id", "name", "description"])
    .where("network", "=", network)
    .where("is_translated", "=", 0)
    .limit(1000)
    .execute();
  
  if (goals.length === 0) {
    console.log(`No untranslated task goals found for network: ${network}`);
    return;
  }
  
  console.log(`Found ${goals.length} task goals to translate`);
  
  // Process all goals in parallel
  const translationPromises = goals.map(async (goal) => {
    try {
      // Parse the existing JSON strings
      const fieldsToTranslate = {
        name: goal.name ? JSON.parse(goal.name) : null,
        description: goal.description ? JSON.parse(goal.description) : null
      };
      
      // Filter out null values
      const fieldsWithContent = Object.fromEntries(
        Object.entries(fieldsToTranslate).filter(([_, value]) => value !== null)
      );
      
      // Skip if no fields to translate
      if (Object.keys(fieldsWithContent).length === 0) {
        return false;
      }
      
      // Get all texts that need translation
      const fieldEntries = Object.entries(fieldsWithContent);
      
      // Extract the actual texts to translate (not the objects)
      const textsToTranslate = fieldEntries.map(([_, content]) => {
        // If the source language entry contains a nested object, extract the text value
        return typeof content[sourceLang] === 'object' 
          ? content[sourceLang][sourceLang] 
          : content[sourceLang];
      });
      
      // Translate all texts in one batch
      try {
        const translatedTexts = await translateTextGoogle(
          textsToTranslate,
          targetLang,
          sourceLang
        ) as string[];
        
        // Prepare update data
        const updateData: any = {
          is_translated: 1
        };
        
        // Map the translated results back to their fields
        fieldEntries.forEach(([field, content], index) => {
          // Create a flat structure
          updateData[field] = JSON.stringify({
            [sourceLang]: typeof content[sourceLang] === 'object' 
              ? content[sourceLang][sourceLang] 
              : content[sourceLang],
            [targetLang]: Array.isArray(translatedTexts) ? translatedTexts[index] : translatedTexts
          });
        });
        
        // Update database
        await db.updateTable("offerwall_task_goals")
          .set(updateData)
          .where("id", "=", goal.id)
          .execute();
        
        console.log(`Updated goal ${goal.id} with translations`);
        return true;
      } catch (error) {
        console.error(`Error translating texts for goal ${goal.id}:`, error);
        return false;
      }
    } catch (error) {
      console.error(`Error processing goal ${goal.id}:`, error);
      return false;
    }
  });
  
  // Wait for all translations to complete
  const results = await Promise.all(translationPromises);
  const successCount = results.filter(result => result).length;
  
  console.log(`Successfully translated ${successCount} out of ${goals.length} task goals`);
}

