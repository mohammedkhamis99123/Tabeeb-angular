export interface ISubscriptionHistory {
    clinicArName: string;
    clinicEnName: string;
    packageArName: string;
    packageEnName: string;
    status: number;
    startAt: string | Date;
    endAt: string | Date;
}