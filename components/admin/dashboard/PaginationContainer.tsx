'use client';

import { PaginationData } from '@/app/types';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const PaginationContainer = ({
  meta,
}: {
  meta: PaginationData | undefined;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  if (!meta) return null;

  const { last_page: pageCount, current_page: page } = meta;
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  const handlePageChange = (pageNumber: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', pageNumber);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  if (pageCount < 2) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className='hover:cursor-pointer'
            onClick={() => {
              let prevPage = page - 1;
              if (prevPage < 1) prevPage = pageCount;
              handlePageChange(prevPage.toString());
            }}
          />
        </PaginationItem>
        {pages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              isActive={pageNumber === page}
              onClick={() => handlePageChange(pageNumber.toString())}
              className={`btn btn-xs sm:btn-md  ${
                pageNumber === page ? 'bg-base-300 border-base-300' : ''
              }`}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              let nextPage = page + 1;
              if (nextPage > pageCount) nextPage = 1;
              handlePageChange(nextPage.toString());
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationContainer;
