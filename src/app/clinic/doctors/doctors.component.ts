import { Component, DestroyRef, inject, INJECTOR, Input, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IClinicDoctorDto } from './models/IClinicDoctorDto.model';
import { ClinicDoctorsService } from './Services/clinic-doctor.service';
import { environment } from 'src/environments/environment.prod';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { TranslateService } from '@ngx-translate/core';
import { SpecializationService } from 'src/app/super-admin/specialization/Services/specialization.service';
import { DoctorWorkTimeInfo, IDoctorWorkTime } from './models/IDoctorWorkTime.model';
import { IGenericResponse } from 'src/app/Common/Models/IGenericReponse';
import Swal from 'sweetalert2';
import { SystemFacadeService } from 'src/app/Common/Services/system-facade.service';
import { CurrentUserService } from 'src/app/Common/Services/current-user.service';
import { Language, TextLangValidator } from 'src/app/Common/Validators/TextValidator';
import { IGetGeneric } from 'src/app/Common/Models/IGenericGet';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ISpecialization } from 'src/app/super-admin/specialization/Models/ISpecialization';


@Component({
    selector: 'app-clinic-doctors',
    templateUrl: './doctors.component.html',
    styleUrls: ['./doctors.component.css']
})
export class ClinicDoctorsComponent implements OnInit {


  destroy=inject(DestroyRef);

   clinicId: number=parseInt(sessionStorage.getItem("SelectedClinic")!);

    doctors: IClinicDoctorDto[] = [];
    filteredDoctors: IClinicDoctorDto[] = [];

    doctorForm!: FormGroup;

    isArabic = false;
    isLoading = false;
    isSaving = false;
    showModal = false;

    searchTerm = '';

    selectedImage: File | null = null;
    selectedStamp: File | null = null;

    imagePreview: string | null = null;
    stampPreview: string | null = null;

    @ViewChild("WorkScheduleModal")
    WorkScheduleModal!: NgxCustomModalComponent;

    selectedDoctor: IClinicDoctorDto | null = null;
    
    workTimes: DoctorWorkTimeInfo[] = [];
    isLoadingWorkTimes = false;
    isSavingWorkTimes = false;
    modalMode: 'Create' | 'Update' = 'Create';

    @ViewChild("AddDoctorModal") AddDoctorModal!:NgxCustomModalComponent
    specializionList: any[]=[];

    constructor(
        private fb: FormBuilder,
        private clinicDoctorsService: ClinicDoctorsService,
        private translate:TranslateService,
        private SpecializationServ:SpecializationService,
        protected sfc:SystemFacadeService,
        private currentUserService:CurrentUserService
    ) {}

    ngOnInit(): void {
        // عدّل مصدر اللغة حسب الـ service المستخدم عندك
        this.isArabic = this.translate.currentLang === 'ae';

        this.initializeForm();

        if (this.clinicId) {
            this.loadDoctors();
            this.loadSpecializations();
        }
    }
  loadSpecializations() {
    var data:IGetGeneric={
        Page:1,
        PageSize:2000,
        SearchTerm:null,
        SortBy:"Id",
        SortOrder:"asc"
    }

    this.SpecializationServ.getAll(data).pipe(
      takeUntilDestroyed(this.destroy)
    ).subscribe(result=>{
      if(result.isSuccess){
        this.specializionList=[]
        result.data.items.forEach((item:ISpecialization)=>{
          this.specializionList.push({id:item.id,name:this.isArabic ?item.arName :item.enName})
        })
      }
    })
  }
    daysOfWeek = [
    { value: 0, name: 'Sunday', arName: 'الأحد' },
    { value: 1, name: 'Monday', arName: 'الإثنين' },
    { value: 2, name: 'Tuesday', arName: 'الثلاثاء' },
    { value: 3, name: 'Wednesday', arName: 'الأربعاء' },
    { value: 4, name: 'Thursday', arName: 'الخميس' },
    { value: 5, name: 'Friday', arName: 'الجمعة' },
    { value: 6, name: 'Saturday', arName: 'السبت' }
];


    private initializeForm(): void {
        this.doctorForm = this.fb.group({
            arName: ['', [Validators.required, Validators.maxLength(150),TextLangValidator(Language.Arabic)]],
            enName: ['', [Validators.required, Validators.maxLength(150),TextLangValidator(Language.English)]],
            email: ['', [Validators.required, Validators.email]],
            identityNumber: ['', Validators.required],
            specializationId: [null, Validators.required],
            sessionDuration: [30, [Validators.required, Validators.min(1)]],
            sessionPrice: [1, [Validators.required, Validators.min(1)]],
            isActive: [true]
        });
    }

    loadDoctors(): void {
        this.isLoading = true;

        this.clinicDoctorsService.getClinicDoctors(this.clinicId).subscribe({
            next: (response: any) => {
                // لو الـ API بيرجع ApiResponse
                this.doctors = response?.data ?? response ?? [];
                this.doctors.map((e:IClinicDoctorDto)=>{
                  e.doctorStamp= e.doctorStamp? environment.ImageServer+"/"+e.doctorStamp :""
                  e.imagePath=e.imagePath ? environment.ImageServer+"/"+e.imagePath :""
                })
                this.applySearch();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading doctors:', error);
                this.isLoading = false;
            }
        });
    }

    applySearch(): void {
        const term = this.searchTerm.trim().toLowerCase();

        if (!term) {
            this.filteredDoctors = [...this.doctors];
            return;
        }

        this.filteredDoctors = this.doctors.filter(doctor =>
            (doctor.arName ?? '').toLowerCase().includes(term) ||
            (doctor.enName ?? '').toLowerCase().includes(term) ||
            (doctor.email ?? '').toLowerCase().includes(term) ||
            (doctor.identityNumber ?? '').toLowerCase().includes(term)
        );
    }

    onSearch(value: string): void {
        this.searchTerm = value;
        this.applySearch();
    }

    openAddModal(): void {
        this.modalMode = 'Create';
        this.selectedDoctor=null
        this.doctorForm.reset({
            arName: '',
            enName: '',
            email: '',
            identityNumber: '',
            specializationId: null,
            sessionDuration: 30,
            sessionPrice: 0,
            isActive: true
        });

        this.selectedImage = null;
        this.selectedStamp = null;
        this.imagePreview = null;
        this.stampPreview = null;

        this.AddDoctorModal.open()
    }

    closeModal(): void {
        if (this.isSaving) return;

        this.AddDoctorModal.close()
    }

    onFileSelected(event: Event, type: 'image' | 'stamp'): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
    const toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          showCloseButton: true,
          customClass: { popup: `color-danger` },
        });

        toast.fire({
          title: this.isArabic ? 'من فضلك اختر ملف صورة صحيح' : 'Please select a valid image file',
        });            
            input.value = '';
            return;
        }

        if (type === 'image') {
            this.selectedImage = file;
            this.imagePreview = URL.createObjectURL(file);
        } else {
            this.selectedStamp = file;
            this.stampPreview = URL.createObjectURL(file);
        }
    }

 saveDoctor() {
    if (this.doctorForm.invalid) {
        this.doctorForm.markAllAsTouched();
        return;
    }

    const formData = new FormData();

    Object.entries(this.doctorForm.getRawValue()).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.append(
                key.charAt(0).toUpperCase() + key.slice(1),
                value.toString()
            );
        }
    });

    formData.append('ClinicId', this.clinicId.toString());

    if (this.modalMode === 'Update' && this.selectedDoctor?.doctorId) {
        formData.append('DoctorId', this.selectedDoctor?.doctorId.toString());
    }

     if(this.modalMode=="Create" &&(!this.selectedImage || !this.selectedStamp)){
      Swal.fire("")
      
     }
    if (this.selectedImage) {
        formData.append('Image', this.selectedImage);
    }

    if (this.selectedStamp) {
        formData.append('Stamp', this.selectedStamp);
    }

    this.isSaving = true;

    const request$ = this.modalMode === 'Create'
        ? this.clinicDoctorsService.addClinicDoctor(formData)
        : this.clinicDoctorsService.UpdatClinicDoctor(formData);

    request$.subscribe({
        next: () => {
            this.isSaving = false;
            this.closeModal();
                 // اعرض رسالة validation باستخدام SweetAlert أو Toastr
            const toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          showCloseButton: true,
          customClass: { popup: `color-danger` },
        });
        toast.fire({
          title:this.translate.instant("SavedSuccessfully")
        })
            this.loadDoctors();
        },
        error: (error) => {
            this.isSaving = false;
            console.error(error);
        }
    });
}

    getDoctorName(doctor: IClinicDoctorDto): string {
        return this.isArabic ? doctor.arName : doctor.enName;
    }

    getStatusLabel(isActive: boolean): string {
        if (isActive) {
            return this.isArabic ? 'نشط' : 'Active';
        }

        return this.isArabic ? 'غير نشط' : 'Inactive';
    }

    getDayName(day: number): string {
        const daysAr = [
            'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء',
            'الخميس', 'الجمعة', 'السبت'
        ];

        const daysEn = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday'
        ];

        return this.isArabic ? daysAr[day] : daysEn[day];
    }

    get imageCount(): number {
        return this.doctors.filter(x => !!x.imagePath).length;
    }

    get activeDoctorsCount(): number {
        return this.doctors.filter(x => x.isActive).length;
    }

     doctorInitial(doctor: IClinicDoctorDto): string {
        return (this.getDoctorName(doctor) || 'D').charAt(0).toUpperCase();
    }

    trackByDoctor(index: number, doctor: IClinicDoctorDto): number {
        return doctor.doctorId;
    }




OpenWorkSchedule(doctor: IClinicDoctorDto) {
    this.selectedDoctor = doctor;
    this.WorkScheduleModal.open();

    this.loadDoctorWorkTimes(doctor.doctorId);
}

loadDoctorWorkTimes(doctorId: number) {
    this.isLoadingWorkTimes = true;

    this.clinicDoctorsService
        .GetDoctorWorkTime(doctorId, this.clinicId)
        .subscribe({
            next: (response: any) => {

                // نضمن وجود الأيام السبعة حتى لو الـ API رجّع الأيام المسجلة فقط
                this.workTimes = this.daysOfWeek.map(day => {
                    const existing = response.data.find(
                        (x :any)=> x.dayOfWeek === day.value
                    );
                    return {
                        dayOfWeek: day.value,
                        startAt: existing?.startAt?.substring(0, 5),
                        endAt: existing?.endAt?.substring(0, 5),
                        isActive: existing?.isActive ?? false
                    };
                });

                this.isLoadingWorkTimes = false;
            },
            error: (error) => {
                this.isLoadingWorkTimes = false;
                console.error(error);
            }
        });
}


SaveWorkSchedule() {
    if (!this.selectedDoctor) return;

    // التحقق من صحة أوقات العمل للأيام المفعلة
    const invalidDay = this.workTimes.find(x =>
        x.isActive &&
        (!x.startAt || !x.endAt || x.startAt >= x.endAt)
    );

    if (invalidDay) {

      
        // اعرض رسالة validation باستخدام SweetAlert أو Toastr
            const toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          showCloseButton: true,
          customClass: { popup: `color-danger` },
        });
        
        if(invalidDay.startAt >= invalidDay.endAt){
        toast.fire({
          title: this.isArabic ? 'من فضلك ادخل بيانات المواعيد بشكل صحيح ويجب ان يكون وقت النهاية بعد وقت البدايه' : 'Please Enter Valid Work Times (Start time must be less than End Time) ',
        }); 
        }else if(!invalidDay.startAt){
          var day=this.daysOfWeek.filter(a=>a.value==invalidDay.dayOfWeek)[0]
             toast.fire({
              title:this.isArabic ?`وقت البدايه مطلوب ليوم ${day.arName}` :`Start Time is Required For Day ${day.name} ` 
        }); 
        }else{
                    var day=this.daysOfWeek.filter(a=>a.value==invalidDay.dayOfWeek)[0]
             toast.fire({
              title:this.isArabic ?`وقت النهاية مطلوب ليوم ${day.arName}` :`End Time is Required For Day ${day.name} ` 
        }); 
        }
        
        return;
    }

    const request = {
        doctorID: this.selectedDoctor.doctorId,
        clinicId: this.clinicId,
        workTimes: this.workTimes
    };

    this.isSavingWorkTimes = true;

    this.clinicDoctorsService.UpdateDoctorWorkTime(request)
        .subscribe({
            next: () => {
                this.isSavingWorkTimes = false;
                this.WorkScheduleModal.close();
            },
            error: (error) => {
                this.isSavingWorkTimes = false;
                console.error(error);
            }
        });
}

Update(doctor: IClinicDoctorDto) {
    this.modalMode = 'Update';
    this.selectedDoctor = doctor;

    this.isLoading = true;

    this.clinicDoctorsService.GetById(this.selectedDoctor.doctorId, this.clinicId)
        .subscribe({
            next: (result:any) => {
                this.doctorForm.patchValue({
                    arName: result.data.arName,
                    enName: result.data.enName,
                    identityNumber: result.data.identityNumber,
                    specializationId: result.data.specializationId,
                    sessionDuration: result.data.sessionDuration,
                    sessionPrice: result.data.sessionPrice,
                    isActive: result.data.isActive,
                    email: result.data.email
                });

                this.imagePreview = result.data.imagePath
                    ? environment.ImageServer +"/"+ result.data.imagePath
                    : null;

                this.stampPreview = result.data.doctorStamp
                    ? environment.ImageServer +"/"+ result.data.doctorStamp
                    : null;

                this.selectedImage = null;
                this.selectedStamp = null;

                this.isLoading = false;
                this.AddDoctorModal.open();
            },
            error: (error) => {
                this.isLoading = false;
                console.error(error);
            }
        });
}

HandleRequest() {
    if (this.doctorForm.invalid) {
        this.doctorForm.markAllAsTouched();
        return;
    }

    const formData = new FormData();

    Object.keys(this.doctorForm.value).forEach(key => {
        const value = this.doctorForm.value[key];

        if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
        }
    });

    if (this.selectedImage) {
        formData.append('Image', this.selectedImage);
    }

    if (this.selectedStamp) {
        formData.append('Stamp', this.selectedStamp);
    }

    formData.append('ClinicId', this.clinicId.toString());

    if (this.modalMode === 'Update' && this.selectedDoctor?.doctorId) {
        formData.append('DoctorId', this.selectedDoctor?.doctorId.toString());
    }

    this.isSaving = true;

    const request$ = this.modalMode === 'Create'
        ? this.clinicDoctorsService.addClinicDoctor(formData)
        : this.clinicDoctorsService.UpdatClinicDoctor(formData);

    request$.subscribe({
        next: () => {
            this.isSaving = false;
            this.AddDoctorModal.close();
            this.loadDoctors();
        },
        error: (error:any) => {
            this.isSaving = false;
            console.error(error);
        }
    });
}

hasAnyPermissionOf(permissions: number[]): boolean {
    return this.currentUserService.hasAnyPermissionOf(permissions);
  }
}