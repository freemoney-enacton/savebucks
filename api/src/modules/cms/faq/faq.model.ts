import app from "../../../app";
import transformResponse from "../../../utils/transformResponse";
import { db } from "./../../../database/database";
const columns = {
  translatable: ["question", "answer"],
  money: [],
  date: [],
};

export const getFaq = async (
  lang: string,
  category: string | null,
  default_lang: string
) => {
  const result = await db
    .selectFrom("faqs")
    .select(["id", "question", "answer", "category_code"])
    .where("status", "=", "publish")
    .$if(category != null, (qb) => qb.where("category_code", "=", category))
    .orderBy("sort_order asc")
    .execute();

  const transformedData = await transformResponse(
    result,
    columns,
    default_lang,
    lang,
    null
  );
  return transformedData;
};


interface FAQ {
  question: string;
  answer: string;
  faq_sort_order: number;
}

interface FAQCategory {
  category_name: string;
  sort_order: number;
  category_code: string;
  faqs: FAQ[];
}

interface RawFAQ {
  id: number;
  question: string;
  answer: string;
  category_code: string;
  faq_sort_order: number;
  faq_category_name: string;
  faq_category_order: number;
}

export const getAllFaq = async (
  lang: string,
  default_lang: string
) => {
  const result = await db
    .selectFrom("faqs")
    .innerJoin("faq_categories","faqs.category_code","faq_categories.category_code")
    .select([
      "faqs.id",
      "faqs.question",
      "faqs.answer",
      "faqs.category_code",
      "faqs.sort_order as faq_sort_order",
      "faq_categories.name as faq_category_name",
      "faq_categories.sort_order as faq_category_order",
    ])
    .where("status", "=", "publish")
    .execute(); 

  const transformedData = await transformResponse(
    result,
    {
      translatable: ["question", "answer", "faq_category_name"],
      money: [],
      date: [],
    },
    default_lang,
    lang,
    null
  );

    // @ts-ignore
    const groupedData: FAQCategory[] = transformedData.reduce<FAQCategory[]>((acc, item: RawFAQ) => {
      // Find if the category already exists in the accumulator
      // @ts-ignore
      let category = acc.find(cat => cat.category_code === item.category_code);
    
      // If not, create a new category
      if (!category) {
        category = {
          category_name: item.faq_category_name,
          sort_order: item.faq_category_order,
          category_code: item.category_code,
          faqs: []
        };
        acc.push(category);
      }
    
      // Add the current FAQ to the category's faqs array
      category.faqs.push({
        question: item.question,
        answer: item.answer,
        faq_sort_order: item.faq_sort_order,
      });
    
      return acc;
    }, []);
    
    // Sort each category's FAQs by faq_sort_order
    groupedData.forEach(category => {
      category.faqs.sort((a, b) => a.faq_sort_order - b.faq_sort_order);
      // Optionally, remove faq_sort_order from the final output
    });
    
    // Sort the categories by faq_category_order
    groupedData.sort((a, b) => a.sort_order - b.sort_order);   

  return groupedData;
};
