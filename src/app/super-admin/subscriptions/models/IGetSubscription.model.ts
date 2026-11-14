import { SubscriptionStatus } from "src/app/common/enums/SubscriptionStatus.enum";
import { IGetGeneric } from "src/app/common/models/IGenericGet";

export interface IGetSubscription extends IGetGeneric{
 clinicId?: number | null;
  packageId?: number | null;
  status?: SubscriptionStatus | null;
}