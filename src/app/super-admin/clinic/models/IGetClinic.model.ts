import { IGetGeneric } from "src/app/Common/Models/IGenericGet";

export interface IGetClinic extends IGetGeneric{
    isActive:boolean|null,
    cityId:number|null,
    subscriptionPackageId:number|null,
    from:string|null,
    to:string|null
}