import { IGetGeneric } from "src/app/common/models/IGenericGet";

export interface IGetOffers extends IGetGeneric{
from?:string|null,
to?:string|null,
isActive?:boolean|null
}