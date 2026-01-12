type IOptions = {
    page?: number | string,
    limit?: number | string,
    sortBy?: string,
    sortOrder?: string,
}
type IOptionsResults = {
    page: number,
    limit: number,
    sortBy: string,
    skip: number,
    sortOrder: string
}
export const paginaitionSortingHelper = (option: IOptions): IOptionsResults => {
    const page: number = Number(option.page) || 1;
    const limit: number = Number(option.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy: string = option.sortBy || "createdAt";
    const sortOrder: string = option.sortOrder || "desc";
    return {
        page,
        limit,
        sortBy,
        sortOrder,
        skip
    }
}
