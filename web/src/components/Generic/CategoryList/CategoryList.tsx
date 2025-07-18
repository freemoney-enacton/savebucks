import { CategoryType } from '@/Type/categoryType';
import CategoryButton from '@/components/Core/Button/CategoryButton';
import NoDataFound from '@/components/Core/NoDataFound';

const CategoryList = async ({ categoryList }) => {
  return (
    <div>
      {categoryList?.data?.length > 0 ? (
        <>
          {categoryList?.data.map((item: CategoryType, index) => (
            <CategoryButton item={item} key={index} />
          ))}
        </>
      ) : (
        <NoDataFound msg="No Category Found" />
      )}
    </div>
  );
};

export default CategoryList;
