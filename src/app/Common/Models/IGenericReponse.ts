export interface  IGenericResponse<T>{
    isSuccess:boolean,
    message:string,
    error:any,
    data:IReponseData<T>
}

export interface IReponseData<T>{
    items:T,
    totalCount:number,
    hasPreviousPage:boolean,
    hasNextPage:boolean
    totalPages:Number
}