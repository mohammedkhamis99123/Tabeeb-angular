export interface ISubscriptionPackage {
    id?: number | null;
    arName: string;
    enName: string;
    arDescription: string;
    enDescription: string;
    durationInDays: number;
    isActive: boolean;
    price: number;

}