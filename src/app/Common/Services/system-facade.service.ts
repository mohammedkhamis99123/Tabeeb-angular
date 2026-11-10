import { Injectable } from '@angular/core';
import { Permission } from '../enums/Permission.enum';

@Injectable({
  providedIn: 'root'
})
export class SystemFacadeService {

  constructor() { }

  get Permissions():typeof Permission{
    return Permission;
  }
}
