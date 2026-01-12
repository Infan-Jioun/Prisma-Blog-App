type IOptions {
    page?: number | string,
    limit?: number | string,
    sortOrder?: string,
    sortBy?: string
}
const paginaitionSortingHelper = (option: IOptions) => {
    console.log(option);
}