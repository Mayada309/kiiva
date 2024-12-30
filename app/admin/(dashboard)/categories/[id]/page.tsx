'use client';

import { Category } from '@/app/types';
import SideHeading from '@/components/admin/dashboard/SideHeading';
import { adminFetch } from '@/utils/axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function SingleCategory() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category>();

  const getCategory = async () => {
    try {
      const res = await adminFetch(`categories/${id}`);
      if (res.status === 200) setCategory(res.data.data);
      else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div>
      <SideHeading title={category?.name || 'Category'} /> sub categories:
      {category?.children?.map((subCategory) => {
        return <div key={subCategory.id}>{subCategory.name}</div>;
      })}
    </div>
  );
}

export default SingleCategory;
