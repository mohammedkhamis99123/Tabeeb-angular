import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IEmployee } from './models/IEmployee.model';
import { IGetEmployee } from './models/IGetEmployee.model';
import { EmployeesService } from './services/employees.service';
import { environment } from 'src/environments/environment.prod';
import { Roles } from 'src/app/common/enums/roles.enum';
import { ClinicDoctorsService } from '../doctors/Services/clinic-doctor.service';
import Swal from 'sweetalert2';
import { CurrentUserService } from 'src/app/common/services/current-user.service';
import { SystemFacadeService } from 'src/app/common/services/system-facade.service';
import { Language, TextLangValidator } from 'src/app/common/validators/textValidator';



@Component({
    selector: 'app-employees',
    templateUrl: './employees.component.html',
    styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {

    @ViewChild('CrudModal') CrudModal: any;

    employees: IEmployee[] = [];
    totalCount = 0;

    loading = false;
    submitting = false;
    isEditMode = false;
    isArabic = false;

    page = 1;
    pageSize = 10;

    searchTerm: string | null = null;
    isActive: boolean | null = null;

    selectedEmployeeId: number | null = null;
    selectedImage: File | null = null;
    imagePreview: string | null = null;

    employeeForm!: FormGroup;

  

    // يتم ملء القائمة من Doctor Dropdown API عند ربطه
    doctors: any[] = [];
  cols: ({ field: string; title: string; isUnique: boolean; hide: boolean; sort?: undefined; } | { field: string; title: string; sort: boolean; isUnique?: undefined; hide?: undefined; })[];
  roles: { id: Roles; name: string; arName: string; }[];
  showdoctor!: boolean;



    constructor(
        private fb: FormBuilder,
        private empService: EmployeesService,
        private translate: TranslateService,
        private doctorserv:ClinicDoctorsService,
        private currentUserService:CurrentUserService,
        protected sfc:SystemFacadeService
    ) {
        this.isArabic = this.translate.currentLang === 'ae';
        this.translate.onLangChange.subscribe(event => {
            this.isArabic = event.lang === 'ae';
        });

this.roles = [
    { id: Roles.Admin, name: 'Admin', arName: 'مدير النظام' },
    { id: Roles.Employee, name: 'Employee', arName: 'موظف' },
    { id: Roles.Accountant, name: 'Accountant', arName: 'محاسب' },
    //{ id: Roles.Doctor, name: 'Doctor', arName: 'طبيب' },
    { id: Roles.DoctorAssistant, name: 'DoctorAssistant', arName: 'مساعد طبيب' },
    //{ id: Roles.Customer, name: 'Customer', arName: 'عميل' }
];
        if(!this.isArabic){
            this.cols = [
                { field: 'id', title: '#', isUnique: true, hide: false },
                { field: 'employeeName', title: 'EmployeeName', sort: true },
                { field: 'identityNumber', title: 'IdentityNumber', sort: true },
                { field: 'email', title: 'Email', sort: true },
                { field: 'phone', title: 'Phone', sort: true },
                { field: 'isActive', title: 'Status', sort: true },
                { field: 'actions', title: 'Actions', sort: false }
            ];
        }else{
              this.cols = [
                { field: 'id', title: '#', isUnique: true, hide: false },
                { field: 'employeeName', title: 'اسم الموظف', sort: true },
                { field: 'identityNumber', title: 'رقم الهوية', sort: true },
                { field: 'email', title: 'البريد الالكترونى', sort: true },
                { field: 'phone', title: 'رقم الجوال', sort: true },
                { field: 'isActive', title: 'الحالة', sort: true },
                { field: 'actions', title: ' الاجراءات', sort: false }
            ];
        }
    }

    ngOnInit(): void {
        this.initForm();
        this.GetEmployees();
        this.getDoctors();
    }
  getDoctors() {
    var clinicId=parseInt(sessionStorage.getItem("SelectedClinic")!);

    this.doctorserv.getClinicDoctors(clinicId).subscribe((result)=>{
      if(result.isSuccess){
        this.doctors=[];
        result.data.forEach((e:any)=>{
          this.doctors.push({id:e.doctorId,name:this.isArabic ?e.arName :e.enName})
        })
      }
    })
  }

    // --------------------------------------------------
    // Form
    // --------------------------------------------------

    initForm(): void {
        this.employeeForm = this.fb.group({
            arName: ['', [Validators.required, Validators.maxLength(150),TextLangValidator(Language.Arabic)]],
            enName: ['', [Validators.required, Validators.maxLength(150),,TextLangValidator(Language.English)]],
            addrees: ['', [Validators.required, Validators.maxLength(250)]],
            identityNumber: ['', Validators.required,Validators.pattern("^[12]\d{9}$")],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(250)]],
            doctorId: [null],
            role: [null, Validators.required],
            isActive: [true],
            image: [null,[Validators.required]],
            phoneNumber:[null,[Validators.required]],
            salary:[null,[Validators.required,Validators.min(1)]],
            workHours:[8,[Validators.required,Validators.min(1),Validators.max(24)]]
        });
    }

 

    // --------------------------------------------------
    // Get Employees / Pagination
    // --------------------------------------------------

    GetEmployees(): void {
        this.loading = true;

        const request: IGetEmployee = {
            Page: this.page,
            PageSize: this.pageSize,
            SearchTerm: this.searchTerm,
            SortBy: null,
            SortOrder: null,
            isActive: this.isActive
        };

        this.empService.getEmployees(request).subscribe({
            next: (response: any) => {
                if (response?.isSuccess) {
                    this.employees = response.data?.items ?? [];
                    this.totalCount = response.data?.totalCount ?? 0;
                } else {
                    this.employees = [];
                    this.totalCount = 0;
                }

                this.loading = false;
            },
            error: error => {
                console.error('Get Employees Error:', error);
                this.employees = [];
                this.totalCount = 0;
                this.loading = false;
            }
        });
    }

    onchange(event: any): void {
        this.page = event.current_page ?? event.page ?? this.page;
        this.pageSize = event.pagesize ?? event.pageSize ?? this.pageSize;

        this.GetEmployees();
    }

    ApplyFilters(): void {
        this.page = 1;
        this.GetEmployees();
    }

    ResetFilters(): void {
        this.searchTerm = null;
        this.isActive = null;
        this.page = 1;
        this.pageSize = 10;

        this.GetEmployees();
    }

    // --------------------------------------------------
    // Create / Edit Modal
    // --------------------------------------------------

    OpenCreateModal(): void {
        this.isEditMode = false;
        this.selectedEmployeeId = null;
        this.selectedImage = null;
        this.imagePreview = null;

        this.employeeForm.reset({
            arName: '',
            enName: '',
            addrees: '',
            identityNumber: '',
            email: '',
            doctorId: null,
            role: null,
            isActive: true,
            image: null
        });

        this.employeeForm.get('image')?.setValidators(Validators.required);
        this.employeeForm.get('image')?.updateValueAndValidity();

        this.CrudModal.open();
    }

    OpenEditModal(employee: IEmployee): void {
        this.isEditMode = true;
        this.selectedEmployeeId = employee.id;
        this.selectedImage = null;
        this.imagePreview = employee.imagePath
            ? environment.ImageServer+"/"+ employee.imagePath
            : null;

        this.employeeForm.reset({
            arName: employee.arName,
            enName: employee.enName,
            addrees: employee.addrees,
            identityNumber: employee.identityNumber,
            email: employee.email,
            doctorId: employee.doctorId ?? null,
            role: null,
            isActive: employee.isActive,
            image: null,
            phoneNumber:employee.phoneNumber,
            salary:employee.salary,
            workHours:employee.workHours


          
        });

        // الصورة اختيارية عند التعديل
        this.employeeForm.get('image')?.clearValidators();
        this.employeeForm.get('image')?.updateValueAndValidity();

        this.empService.getById(employee.id).subscribe({
            next: (response: any) => {
                const data: IEmployee = response?.data ?? response;

                if (data) {
                    this.employeeForm.patchValue({
                        arName: data.arName,
                        enName: data.enName,
                        addrees: data.addrees,
                        identityNumber: data.identityNumber,
                        email: data.email,
                        doctorId: data.doctorId ?? null,
                        isActive: data.isActive,
                        role:data.role,
                        phoneNumber:data.phoneNumber,
                             salary:employee.salary,
                            workHours:employee.workHours
                    });
                   
                      this.CheckRole()
                    
                }
            },
            error: error => console.error('Get Employee Error:', error)
        });

        this.CrudModal.open();
    }

    CloseModal(): void {
        this.CrudModal.close();
        this.employeeForm.reset();
        this.selectedImage = null;
        this.imagePreview = null;
    }

    // --------------------------------------------------
    // Image
    // --------------------------------------------------

    onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
        input.value = '';
        return;
    }

    this.selectedImage = file;
    this.employeeForm.patchValue({ image: file });

    if (this.imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(this.imagePreview);
    }

    this.imagePreview = URL.createObjectURL(file);
}

    removeImage(): void {
        this.selectedImage = null;
        this.imagePreview = null;
        this.employeeForm.patchValue({ image: null });

        const imageControl = this.employeeForm.get('image');

        if (!this.isEditMode) {
            imageControl?.setValidators(Validators.required);
        }

        imageControl?.updateValueAndValidity();
    }

  

    // --------------------------------------------------
    // Submit
    // --------------------------------------------------

    HandleRequest(): void {
        if (this.employeeForm.invalid) {
            this.employeeForm.markAllAsTouched();
            Object.keys(this.employeeForm.controls).forEach(key => {
        const control = this.employeeForm.get(key);

        if (control?.invalid) {
            console.log('Invalid Field:', key);
            console.log('Errors:', control.errors);
            console.log('Value:', control.value);
        }
    });
            return;
        }

        if (!this.isEditMode && !this.selectedImage) {
            this.employeeForm.get('image')?.setErrors({ required: true });
            this.employeeForm.get('image')?.markAsTouched();
            return;
        }

        this.submitting = true;

        const formData = this.buildFormData();

        const request$ = this.isEditMode
            ? this.empService.updateEmployee(formData)
            : this.empService.addEmployee(formData);

        request$.subscribe({
            next: (response: any) => {
                this.submitting = false;

                if (response?.isSuccess === false) {
                    return;
                }
                       const toast = Swal.mixin({
                         toast: true,
                         position: 'top-end',
                         showConfirmButton: false,
                         timer: 3000,
                         showCloseButton: true,
                         customClass: { popup: `color-success` },
                       });
                       toast.fire({
                         title:this.translate.instant("SavedSuccessfully")
                       })
                this.CloseModal();
                this.GetEmployees();
            },
            error: error => {
                console.error('Save Employee Error:', error);
                this.submitting = false;
            }
        });
    }

    private buildFormData(): FormData {
        const value = this.employeeForm.getRawValue();
        const formData = new FormData();

        if (this.isEditMode && this.selectedEmployeeId !== null) {
            formData.append('Id', this.selectedEmployeeId.toString());
        }

        formData.append('ArName', value.arName);
        formData.append('EnName', value.enName);
        formData.append('Addrees', value.addrees);
        formData.append('IdentityNumber', value.identityNumber);
        formData.append('Email', value.email);
        formData.append('IsActive', String(value.isActive));
        formData.append('Role', value.role);
        formData.append('PhoneNumber',value.phoneNumber)
         formData.append('Salary',value.salary)
         formData.append('workHours',value.workHours)
        if (value.doctorId !== null && value.doctorId !== '') {
            formData.append('DoctorId', String(value.doctorId));
        }

        if (this.selectedImage) {
            formData.append('Image', this.selectedImage);
        }

        return formData;
    }

    // --------------------------------------------------
    // Display helpers
    // --------------------------------------------------

    GetEmployeeName(employee: IEmployee): string {
        return this.isArabic ? employee.arName : employee.enName;
    }

    GetRoleName(role: string): string {
        const selectedRole = this.roles.find(x => x.id === role);

        if (!selectedRole) {
            return role || '-';
        }

        return this.isArabic ? selectedRole.arName : selectedRole.name;
    }

    GetStatus(employee: IEmployee): string {
        return employee.isActive
            ? (this.isArabic ? 'نشط' : 'Active')
            : (this.isArabic ? 'غير نشط' : 'Inactive');
    }

    GetStatusClass(employee: IEmployee): string {
        return employee.isActive ? 'status-active' : 'status-inactive';
    }
    getImageUrl(path:string){
      return environment.ImageServer+"/"+path
    }
    onImageDrop(event: DragEvent): void {
    event.preventDefault();

    const files = event.dataTransfer?.files;

    if (!files || files.length === 0) {
        return;
    }

    const file = files[0];

    if (!file.type.startsWith('image/')) {
        return;
    }

    this.selectedImage = file;
    this.employeeForm.patchValue({ image: file });

    if (this.imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(this.imagePreview);
    }

    this.imagePreview = URL.createObjectURL(file);
}

CheckRole(){
if(this.employeeForm.get("role")?.value==Roles.DoctorAssistant){
this.employeeForm.get("doctorId")?.addValidators([Validators.required]);
this.showdoctor=true;
}else{
  this.employeeForm.get("doctorId")?.clearValidators();
  this.showdoctor=false;

}
this.employeeForm.updateValueAndValidity();
}

hasAnyPermissionOf(permissions: number[]): boolean {
    return this.currentUserService.hasAnyPermissionOf(permissions);
  }

}