import { IGenericResponse } from "src/app/common/models/IGenericReponse";

export interface ILoginResult {
    isSuccess:boolean,
      message:string,
      error:any,
      data:AuthData
}

export interface AuthData {
  token: string;
  tokenEndAt: string;
  refreshtokenToken: string;
  redirectToChooseClinic: boolean;
  redirectToChooseRole: boolean;
  refreshTokenEndAt: string;
  permissions: number[];
  roles: string[];
  clinicID: string | null;
  doctorID: string | null;
  employeeID: string | null;
  clinics:any[]
}


