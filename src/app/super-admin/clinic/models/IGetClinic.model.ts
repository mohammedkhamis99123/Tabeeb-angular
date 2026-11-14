import { IGetGeneric } from "src/app/common/models/IGenericGet";

export interface IGetClinic extends IGetGeneric{
    isActive:boolean|null,
    cityId:number|null,
    subscriptionPackageId:number|null,
    from:string|null,
    to:string|null
}