import { IGetGeneric } from "src/app/common/models/IGenericGet";

export interface IGetEmployee extends IGetGeneric{
    isActive?:boolean|null
}