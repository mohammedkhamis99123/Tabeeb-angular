export interface IClinic{
    id?: number | null;
    arName: string;
    enName: string;
    streetArName: string;
    streetEnName: string;
    langitude: string;
    latitude: string;
    cityId: number;
    arDescription?: string;
    enDescription?: string;
    profileAr?: string;
    profileEn?: string;
    ownerArName: string;
    ownerEnName: string;
    ownerEmail: string;
    ownerPassword: string;
    isActive: boolean;
}