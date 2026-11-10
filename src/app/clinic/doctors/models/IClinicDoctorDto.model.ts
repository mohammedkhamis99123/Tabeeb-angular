import { IClinicDoctorWorktime } from "./IClinicDoctorWorkTime.model";

export interface IClinicDoctorDto {
    doctorId: number;
    clinicId: number;
    arName: string;
    enName: string;
    identityNumber: string;
    isActive: boolean;
    specializationId: number;
    specializationArName:string,
    specializationEnName:string,
    sessionPrice: number;
    sessionDuration: number;
    doctorStamp: string;
    imagePath: string;
    joinDate: string;
    email: string;
    worktimeDtos?: IClinicDoctorWorktime[];
}