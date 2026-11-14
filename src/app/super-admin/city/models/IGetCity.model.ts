import { IGetGeneric } from "src/app/common/models/IGenericGet";

export interface IGetCity extends IGetGeneric{
    countryId:number|null,
    isActive:boolean|null
}