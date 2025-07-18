'use client';
import { CategoryType } from '@/Type/categoryType';

export default function CategoryButton({ item }: { item: CategoryType }) {
  const handelClick = () => {
    // const param = new URLSearchParams(searchParam);
    // param.set('category', item.id.toString());
    // router.push(`${pathName}?${param}`);
  };
  return (
    <button className="border-2 p-2" onClick={handelClick}>
      {item.name}
    </button>
  );
}
