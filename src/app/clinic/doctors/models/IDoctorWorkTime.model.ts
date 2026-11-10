export interface IDoctorWorkTime {
    dayOfWeek: number;
    startAt: string;
    endAt: string;
    isActive: boolean;
    doctorID: number;
    clinicId: number;
}

export interface DoctorWorkTimeInfo {
    dayOfWeek: number;
    startAt: string;
    endAt: string;
    isActive: boolean;
}