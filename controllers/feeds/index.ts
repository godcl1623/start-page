export const getPaginationIndexes = (
    page: string | string[] | undefined,
    perPage: string | string[] | undefined,
    sortOption?: string | string[] | undefined
) => {
    let pageValue =
        page != null && typeof page === "string" ? parseInt(page) : 1;
    let perPageValue =
        perPage != null && typeof perPage === "string" ? parseInt(perPage) : 10;
    let sortIndex =
        sortOption != null && typeof sortOption === "string"
            ? parseInt(sortOption)
            : 0;
    const paginationStartIndex = perPageValue * (pageValue - 1);
    const paginationEndIndex = perPageValue * pageValue;
    return [paginationStartIndex, paginationEndIndex, sortIndex] as const;
};
