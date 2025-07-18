'use client';
import { useTranslation } from '@/i18n/client';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Accordion, AccordionItem, Spinner } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  parent_id: number | null;
  header_image: string;
  is_featured: number;
  store_count: number;
}

const CategoriesSidebar = ({ categories }: { categories: Category[] }) => {
  const searchParams = useSearchParams();
  const catParams = searchParams.get('cat');
  const router = useRouter();
  const { t } = useTranslation();
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // Get parent categories (those with null parent_id)
  const parentCategories = categories.filter((cat) => cat.parent_id === null);

  // Get child categories for a given parent ID
  const getChildCategories = (parentId: number) => {
    return categories.filter((cat) => cat.parent_id === parentId);
  };

  // Check if a category has children
  const hasChildren = (categoryId: number) => {
    return categories.some((cat) => cat.parent_id === categoryId);
  };

  // Handle category selection
  const handleCategoryClick = (slug: string, categoryId: number) => {
    let newSearchParams = new URL(window.location.href).searchParams;
    if (slug) {
      newSearchParams.set('cat', slug);
    } else {
      newSearchParams.delete('cat');
    }
    router.replace(`/all-stores?${newSearchParams.toString()}`);
  };

  // Update selected accordion keys when catParams changes
  useEffect(() => {
    if (catParams) {
      const currentCategory = categories.find((cat) => cat.slug === catParams);
      if (currentCategory) {
        if (currentCategory.parent_id) {
          // If it's a child category, open its parent's accordion
          setSelectedKeys(new Set([currentCategory.parent_id.toString()]));
        } else {
          // If it's a parent category, open its own accordion if it has children
          if (hasChildren(currentCategory.id)) {
            setSelectedKeys(new Set([currentCategory.id.toString()]));
          }
        }
      }
    }
  }, [catParams, categories]);

  const handleSelectionChange = (keys) => {
    setSelectedKeys(new Set(keys));
  };

  const Icon = () => <ChevronDownIcon className="flex-shrink-0 size-4 stroke-2 text-white transition-ease" />;

  useEffect(() => {
    setInitialLoading(false);
  }, []);

  return (
    <div
      className="sticky w-full p-4 lg:p-6 bg-black-250 rounded-lg space-y-6 lg:space-y-6"
      style={{ top: 'calc(var(--header-height) + 16px' }}
    >
      {initialLoading ? (
        <div className="flex justify-center items-center h-[340px]">
          <Spinner color="primary" size="lg" />
        </div>
      ) : (
        <>
          <h2 className="text-primary font-semibold text-lg mb-4">{t('shop_categories')}</h2>
          <Accordion
            selectedKeys={selectedKeys}
            onSelectionChange={(e) => handleSelectionChange(e)}
            variant="splitted"
            className="bg-transparent p-0"
          >
            {parentCategories.map((category) => {
              const childCategories = getChildCategories(category.id);
              const hasChildCategories = hasChildren(category.id);

              return (
                <AccordionItem
                  key={category.id}
                  aria-label={category.name}
                  title={
                    <button
                      className="flex items-center gap-4 py-1 text-sm font-semibold group"
                      onClick={() => handleCategoryClick(category.slug, category.id)}
                    >
                      <span
                        className={`${category.slug === catParams ? 'text-primary' : 'text-white'} text-left transition-ease`}
                      >
                        {category.name}
                      </span>
                    </button>
                  }
                  indicator={hasChildCategories ? <Icon /> : null}
                  classNames={{
                    base: 'group-[.is-splitted]:!bg-transparent group-[.is-splitted]:!shadow-none group-[.is-splitted]:!p-0 !shadow-none !bg-transparent !p-0',
                    content: 'p-0 py-2',
                    heading: 'p-0',
                    titleWrapper: 'p-0',
                    title: 'p-0 text-base',
                    trigger: 'p-0 focus:outline-none',
                  }}
                >
                  {hasChildCategories && (
                    <div className="flex flex-col -my-1">
                      {childCategories.map((child) => (
                        <button key={child.id} className="text-left" onClick={() => handleCategoryClick(child.slug, child.id)}>
                          <div
                            className={`cursor-pointer flex items-center gap-4 py-1 text-xs transition-ease ${
                              child.slug === catParams ? 'text-primary' : 'text-white'
                            }`}
                          >
                            <span>{child.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </AccordionItem>
              );
            })}
          </Accordion>
        </>
      )}
    </div>
  );
};

export default CategoriesSidebar;
