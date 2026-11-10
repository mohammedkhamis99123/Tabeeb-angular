import { SubscriptionStatus } from "src/app/Common/enums/SubscriptionStatus.enum";
import { IGetGeneric } from "src/app/Common/Models/IGenericGet";

export interface IGetSubscription extends IGetGeneric{
 clinicId?: number | null;
  packageId?: number | null;
  status?: SubscriptionStatus | null;
}