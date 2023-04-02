export const calculateTotalPages = (totalCount: number) => Math.ceil(totalCount / 10);

export const calculatePagesList = (currentPage: number, totalPages: number) => {
    if (totalPages < 10 || currentPage <= 5) return Array.from({ length: 9 }, (_, page) => page + 1);
    else if (currentPage >= totalPages - 4) return Array.from({ length: 9 }, (_, page) => totalPages + page - 8);
    else return Array.from({ length: 9 }, (_, page) => currentPage + page - 4);
};