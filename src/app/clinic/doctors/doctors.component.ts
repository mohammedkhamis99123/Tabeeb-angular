import { Component, Input, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IClinicDoctorDto } from './models/IClinicDoctorDto.model';
import { ClinicDoctorsService } from './Services/clinic-doctor.service';
import { environment } from 'src/environments/environment.prod';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { TranslateService } from '@ngx-translate/core';
import { SpecializationService } from 'src/app/super-admin/specialization/Services/specialization.service';
import { DoctorWorkTimeInfo, IDoctorWorkTime } from './models/IDoctorWorkTime.model';
import { IGenericResponse } from 'src/app/Common/Models/IGenericReponse';


@Component({
    selector: 'app-clinic-doctors',
    templateUrl: './doctors.component.html',
    styleUrls: ['./doctors.component.css']
})
export class ClinicDoctorsComponent implements OnInit {




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

    @ViewChild("AddDoctorModal") AddDoctorModal!:NgxCustomModalComponent

    constructor(
        private fb: FormBuilder,
        private clinicDoctorsService: ClinicDoctorsService,
        private translate:TranslateService,
        private SpecializationServ:SpecializationService
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
            arName: ['', [Validators.required, Validators.maxLength(150)]],
            enName: ['', [Validators.required, Validators.maxLength(150)]],
            email: ['', [Validators.required, Validators.email]],
            identityNumber: ['', Validators.required],
            specializationId: [null, Validators.required],
            sessionDuration: [30, [Validators.required, Validators.min(1)]],
            sessionPrice: [0, [Validators.required, Validators.min(0)]],
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

        this.showModal = false;
    }

    onFileSelected(event: Event, type: 'image' | 'stamp'): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert(this.isArabic ? 'من فضلك اختر ملف صورة صحيح' : 'Please select a valid image file');
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

    saveDoctor(): void {
        if (this.doctorForm.invalid) {
            this.doctorForm.markAllAsTouched();
            return;
        }

        if (!this.selectedImage || !this.selectedStamp) {
            alert(
                this.isArabic
                    ? 'من فضلك اختر صورة الطبيب والختم'
                    : 'Please select the doctor image and stamp'
            );
            return;
        }

        const formData = new FormData();

        const formValue = this.doctorForm.getRawValue();

        formData.append('ArName', formValue.arName);
        formData.append('EnName', formValue.enName);
        formData.append('Email', formValue.email);
        formData.append('IdentityNumber', formValue.identityNumber);
        formData.append('SpecializationId', String(formValue.specializationId));
        formData.append('SessionDuration', String(formValue.sessionDuration));
        formData.append('SessionPrice', String(formValue.sessionPrice));
        formData.append('IsActive', String(formValue.isActive));
        formData.append('ClinicId', String(this.clinicId));

        formData.append('Image', this.selectedImage);
        formData.append('Stamp', this.selectedStamp);

        this.isSaving = true;

        this.clinicDoctorsService.addClinicDoctor(formData).subscribe({
            next: () => {
                this.isSaving = false;
                this.showModal = false;
                this.loadDoctors();
            },
            error: (error) => {
                console.error('Error adding doctor:', error);
                this.isSaving = false;

                alert(
                    this.isArabic
                        ? 'حدث خطأ أثناء إضافة الطبيب'
                        : 'An error occurred while adding the doctor'
                );
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
}