export interface IOffer{
    id?:number|null
    startAt: string;
    endAt: string;
    percentage: number;
    isActive: boolean;
    doctorId: number;
}