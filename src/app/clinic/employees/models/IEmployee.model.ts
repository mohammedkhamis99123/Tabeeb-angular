export interface IEmployee {
  id: number;
  arName: string;
  enName: string;
  addrees: string;
  isActive: boolean;
  doctorId?: number | null;
  doctorName?: string;
  imagePath?: string;
  identityNumber: string;
  email: string;
  role: string;
  phoneNumber:string;

}