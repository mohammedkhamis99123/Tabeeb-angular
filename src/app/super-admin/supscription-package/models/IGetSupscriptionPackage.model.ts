import { IGetGeneric } from "src/app/Common/Models/IGenericGet";

export interface IGetSupscriptionPackage extends IGetGeneric{
    isActive:boolean|null
}