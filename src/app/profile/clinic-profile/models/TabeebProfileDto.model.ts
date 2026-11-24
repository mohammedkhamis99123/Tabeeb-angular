export interface TabeebProfileDto {
  clinicsCount: number;
  customersCount: number;
  doctorsCount: number;
  reservationsCount: number;

  clinics: ClinicDtoWithEvaluation[];
  subscriptionPackages: SubscriptionPackageDto[];
  doctors: ClinicDoctorDto[];
}

export interface ClinicDtoWithEvaluation {
  id?: number;
  arName: string;
  enName: string;
  cityArName: string;
  cityEnName: string;
  countryArName: string;
  countryEnName: string;
  bannerPath: string | null;
  instgramUser: string | null;
  whatsappNumber: string | null;
  snapshatUser: string | null;
  evaluation: number;
  arDescription:string;
  enDesription:string
}

export interface SubscriptionPackageDto {
  enName: string;
  arName: string;
  enDescription: string;
  arDescription: string;
  price: number;
  durationInDays: number;
}

export interface ClinicDoctorDto {
  doctorId: number;
  clinicId: number;
  clinicEnName: string;

  arName: string;
  enName: string;
  clinicArName: string;
  email: string | null;
  joinDate: string;
  imagePath: string | null;
  sessionPrice: number;
  specializationArName: string;
  specializationEnName: string;
  sessionDuration: number;
  worktimeDtos: ClinicDoctorWorktimeDto[];
}

export interface ClinicDoctorWorktimeDto {
  dayOfWeek: number;
  startAt: string;
  endAt: string;
}