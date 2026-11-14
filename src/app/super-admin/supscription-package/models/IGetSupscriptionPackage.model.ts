import { IGetGeneric } from "src/app/common/models/IGenericGet";

export interface IGetSupscriptionPackage extends IGetGeneric{
    isActive:boolean|null
}