export const calculateTotalPages = (totalCount: number) =>
    Math.ceil(totalCount / 10);

export const calculatePagesList = (currentPage: number, totalPages: number) => {
    switch(true) {
        case totalPages < 10 && currentPage <= 5:
            return Array.from({ length: totalPages }, (_, page) => page + 1);
        case totalPages >= 10 && currentPage <= 5:
            return Array.from({ length: 9 }, (_, page) => page + 1);
        case currentPage >= totalPages - 4:
            return Array.from({ length: 9 }, (_, page) => totalPages + page - 8);
        default:
            return Array.from({ length: 9 }, (_, page) => currentPage + page - 4);
    };
};
