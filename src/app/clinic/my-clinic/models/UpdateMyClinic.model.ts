export interface UpdateMyClinic {
  arName: string;
  enName: string;
  streetArName: string;
  streetEnName: string;
  langitude: string;
  latitude: string;
  cityId: number;
  arDescription?: string | null;
  enDescription?: string | null;
  profileAr?: string | null;
  profileEn?: string | null;
  ownerArName: string;
  ownerEnName: string;
  ownerEmail: string;
  snapshatUser?: string | null;
  instgramUser?: string | null;
  whatsappNumber?: string | null;
}