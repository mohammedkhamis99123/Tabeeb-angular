export interface ClinicDoctorWorktimeDto {
  dayOfWeek: number | string;
  startAt: string; // e.g. "10:00:00"
  endAt: string;   // e.g. "18:00:00"
}

export interface ClinicDoctorDto {
  id?: number;
  arName: string;
  enName: string;
  imagePath?: string | null;
  specializationArName: string;
  specializationEnName: string;
  identityNumber?: string;
  joinDate?: string | Date;
  sessionDuration: number;
  sessionPrice: number;
  worktimeDtos: ClinicDoctorWorktimeDto[];
}

export interface ClinicProfileDto {
  id: number;
  arName: string;
  enName: string;
  arDescription?: string | null;
  enDescription?: string | null;
  profileAr?: string | null;
  profileEn?: string | null;
  bannerPath?: string | null;
  logoPath?: string | null;
  invoiceLogoPath?: string | null;
  streetArName?: string | null;
  streetEnName?: string | null;
  cityArName?: string | null;
  cityEnName?: string | null;
  countryArName?: string | null;
  countryEnName?: string | null;
  whatsappNumber?: string | null;
  instgramUser?: string | null;
  snapshatUser?: string | null;
  langitude?: number | null;
  latitude?: number | null;
  doctors: ClinicDoctorDto[];
}