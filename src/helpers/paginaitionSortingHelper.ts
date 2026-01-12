type IOptions = {
    page?: number | string,
    limit?: number | string,
    sortOrder?: string,
    sortBy?: string
}
export const paginaitionSortingHelper = (option: IOptions) => {
    console.log(option);
    return option;
}
