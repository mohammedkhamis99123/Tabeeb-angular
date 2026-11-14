import { SubscriptionStatus } from "src/app/common/enums/SubscriptionStatus.enum";

export interface ISubscription{
clinicId: number;
  packageID: number;
  clinicArName: string;
  clinicEnName: string;
  packageArName: string;
  packageEnName: string;
  status: SubscriptionStatus;
  startAt: string | null; // في TypeScript عادةً يتم استقبال تاريخ الـ DateOnly كـ string (مثل '2026-01-01') من الـ API
  endAt: string | null;
}