import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 4;

export function usePagination(items) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));

  // Reset to page 1 when items change (filter/search)
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, safePage]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goNext = () => goToPage(safePage + 1);
  const goPrev = () => goToPage(safePage - 1);

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage: safePage,
    totalPages,
    paginatedItems,
    goToPage,
    goNext,
    goPrev,
    resetPage,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
    itemsPerPage: ITEMS_PER_PAGE,
  };
}
