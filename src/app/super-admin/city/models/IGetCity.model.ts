import { IGetGeneric } from "src/app/Common/Models/IGenericGet";

export interface IGetCity extends IGetGeneric{
    countryId:number|null,
    isActive:boolean|null
}