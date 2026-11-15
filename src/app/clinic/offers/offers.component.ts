
import {Component,OnInit,ViewChild,ChangeDetectorRef} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOffer } from './models/IOffer.model';
import { OffersService } from './services/offer.service';
import { IGetGeneric } from 'src/app/common/models/IGenericGet';
import { IGetOffers } from './models/IGetOffers.model';
import { ClinicDoctorsService } from '../doctors/Services/clinic-doctor.service';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { SystemFacadeService } from 'src/app/common/services/system-facade.service';
import { CurrentUserService } from 'src/app/common/services/current-user.service';



@Component({
    selector: 'app-offers',
    templateUrl: './offers.component.html',
    styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

    @ViewChild('CrudModal') CrudModal: any;

    offers:IOffer[] = [];
    doctors: any[] = [];

    offerForm!: FormGroup;

    loading = false;
    submitting = false;

    isEditMode = false;
    selectedOfferId: number | null = null;

    SearchTerm = '';

    page = 1;
    pageSize = 10;
    totalCount = 0;
    sortColumn: string = "ID";
    ascending: boolean = true;

    to: string | null=null;
    from: string | null=null;
    isActive: boolean|null=null;

    isArabic = true;
    clinicId = parseInt(sessionStorage.getItem("SelectedClinic")!);

    @ViewChild("DeleteModal") DeleteModal !:NgxCustomModalComponent
    cols: { field: string; title: string; slot: string; }[];

 
  

    constructor(
        private fb: FormBuilder,
        private OfferServ: OffersService,
        private cdr: ChangeDetectorRef,
        private doctorServ:ClinicDoctorsService,
        protected translate:TranslateService,
        protected sfc:SystemFacadeService,
        private currentUserService:CurrentUserService
    ) {

         if(this.translate.currentLang!='ae'){
       this.cols = [
        { field: 'doctorName', title: 'Doctor', slot: 'doctorName' },
        { field: 'percentage', title: 'Discount', slot: 'percentage' },
        { field: 'startAt', title: 'Start Date', slot: 'startAt' },
        { field: 'endAt', title: 'End Date', slot: 'endAt' },
        { field: 'status', title: 'Status', slot: 'status' },
        { field: 'actions', title: 'Actions', slot: 'actions' }
    ];
         }else{
                this.cols = [
        { field: 'doctorName', title: 'الطبيب', slot: 'doctorName' },
        { field: 'percentage', title: 'الخصم', slot: 'percentage' },
        { field: 'startAt', title: 'تاريخ البداية', slot: 'startAt' },
        { field: 'endAt', title: 'تاريخ النهاية', slot: 'endAt' },
        { field: 'status', title: 'الحالة', slot: 'status' },
        { field: 'actions', title: 'الاجراءات', slot: 'actions' }
    ];
         }
 
    }

    ngOnInit(): void {
        this.InitializeForm();
        this.GetSelectedClinicId();
        this.LoadDoctors();
        this.LoadOffers();
    }

    // --------------------------------------------------
    // Initialization
    // --------------------------------------------------

    InitializeForm(): void {
        this.offerForm = this.fb.group({
            startAt: ['', Validators.required],
            endAt: ['', Validators.required],
            percentage: [
                0.1,
                [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(1)
                ]
            ],
            doctorId: ['', Validators.required],
            isActive: [true]
        });
    }

    GetSelectedClinicId(): void {
        const selectedClinic = sessionStorage.getItem('SelectedClinic');

        if (!selectedClinic) return;

        try {
            const clinic = JSON.parse(selectedClinic);

            this.clinicId = Number(
                clinic?.clinicId 
            );
        } catch {
            this.clinicId = Number(selectedClinic);
        }
    }

    // --------------------------------------------------
    // Load Offers
    // --------------------------------------------------

    LoadOffers(): void {
       var data:IGetOffers={
        Page:this.page,
        PageSize:this.pageSize,
        SearchTerm:this.SearchTerm,
        SortBy:this.sortColumn,
        SortOrder:this.ascending ?'asc' :"desc",
        isActive:this.isActive,
        from:this.from,
        to:this.to

       }
        this.loading = true;

        this.OfferServ.getOffers(data).subscribe({
            next: (response) => {
                const result = response.data;

                this.offers =result.items
                   

                this.totalCount =result.totalCount;
                  

                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Load offers error:', error);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // --------------------------------------------------
    // Load Doctors
    // --------------------------------------------------

    LoadDoctors(): void {
      var clinicId=parseInt(sessionStorage.getItem("SelectedClinic")!);
        this.doctorServ.getClinicDoctors(clinicId).subscribe({
            next: (response) => {
                const result = response?.data;

              

                this.doctors = result.map((doctor: any) => ({
                    id: Number(
                        doctor.doctorId
                    ),
                    name: this.isArabic ? doctor.arName :doctor.enName,
                }));

                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Load doctors error:', error);
            }
        });
    }

    // --------------------------------------------------
    // Modal
    // --------------------------------------------------

    OpenCreateModal(): void {
        this.isEditMode = false;
        this.selectedOfferId = null;

        this.ResetForm();
        this.CrudModal.open();
    }

    OpenEditModal(offer: IOffer): void {
        this.isEditMode = true;
        this.selectedOfferId = offer.id!;

        this.offerForm.patchValue({
            startAt: this.ToDateTimeLocal(offer.startAt),
            endAt: this.ToDateTimeLocal(offer.endAt),
            percentage: offer.percentage,
            doctorId: offer.doctorId,
            isActive: offer.isActive
        });

        this.offerForm.markAsPristine();
        this.offerForm.markAsUntouched();

        this.CrudModal.open();
    }

    CloseModal(): void {
        this.CrudModal.close();
    }

    ResetForm(): void {
        this.offerForm.reset({
            startAt: '',
            endAt: '',
            percentage: 0.1,
            doctorId: '',
            isActive: true
        });

        this.offerForm.markAsPristine();
        this.offerForm.markAsUntouched();
    }

    ToDateTimeLocal(value: string): string {
        if (!value) return '';

        const date = new Date(value);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // --------------------------------------------------
    // Create / Update
    // --------------------------------------------------

    HandleRequest(): void {
        if (this.offerForm.invalid) {
            this.offerForm.markAllAsTouched();
            return;
        }

        const formValue = this.offerForm.value;

        const startAt = new Date(formValue.startAt);
        const endAt = new Date(formValue.endAt);

        if (endAt <= startAt) {
            this.offerForm.get('endAt')?.setErrors({
                invalidDateRange: true
            });
            return;
        }

        const commonData: IOffer = {
            startAt: startAt.toISOString(),
            endAt: endAt.toISOString(),
            percentage: Number(formValue.percentage),
            doctorId: Number(formValue.doctorId),
            isActive: Boolean(formValue.isActive)
        };

        this.submitting = true;

        if (this.isEditMode && this.selectedOfferId !== null) {
            const request: IOffer = {
                id: this.selectedOfferId,
                ...commonData
            };

            this.OfferServ.updateOffer(request).subscribe({
                next: (response) => this.HandleSaveResponse(response),
                error: (error) => {
                    console.error('Update offer error:', error);
                    this.submitting = false;
                }
            });

            return;
        }

        this.OfferServ.addOffer(commonData).subscribe({
            next: (response) => this.HandleSaveResponse(response),
            error: (error) => {
                console.error('Add offer error:', error);
                this.submitting = false;
            }
        });
    }

    HandleSaveResponse(response: any): void {
        this.submitting = false;

        if (response?.isSuccess === false || response?.IsSuccess === false) {
            return;
        }

        this.CloseModal();

        this.isEditMode = false;
        this.selectedOfferId = null;

           const toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                  showCloseButton: true,
                  customClass: { popup: `color-success` },
                });
        
                toast.fire({
                  title: this.translate.instant("SavedSuccessfully"),
                });

        this.ResetForm();
        this.LoadOffers();
    }

    // --------------------------------------------------
    // Delete
    // --------------------------------------------------

  openDelete(id:number){
    sessionStorage.setItem("DeletedOffer",id.toString())
    this.DeleteModal.open();
  }

    DeleteRecord(): void {

        this.OfferServ.deleteOffer(parseInt(sessionStorage.getItem("DeletedOffer")!)).subscribe({
            next: (response) => {
                if (response?.isSuccess === false || response?.IsSuccess === false) {
                    return;
                }

                if (this.offers.length === 1 && this.page > 1) {
                    this.page--;
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
                  title: this.translate.instant("DeletedSuccessfully"),
                });
                this.DeleteModal.close()
                this.LoadOffers();
            },
            error: (error) => {
                console.error('Delete offer error:', error);
            }
        });
    }

    // --------------------------------------------------
    // Pagination & Search
    // --------------------------------------------------

    onchange(event: any): void {
        this.page = event.current_page ?? event.page ?? this.page;
        this.pageSize = event.pagesize ?? event.pageSize ?? this.pageSize;

        this.LoadOffers();
    }

    onSearch(): void {
        this.page = 1;
        this.LoadOffers();
    }

    

    GetPercentage(value: number): string {
        return `${(Number(value) * 100).toFixed(0)}%`;
    }

    GetOfferStatus(offer: IOffer): string {
        if (!offer.isActive) {
            return this.isArabic ? 'غير مفعل' : 'Inactive';
        }

        const now = new Date();
        const start = new Date(offer.startAt);
        const end = new Date(offer.endAt);

        if (now < start) {
            return this.isArabic ? 'لم يبدأ' : 'Upcoming';
        }

        if (now > end) {
            return this.isArabic ? 'منتهي' : 'Expired';
        }

        return this.isArabic ? 'نشط' : 'Active';
    }

    GetOfferStatusClass(offer: IOffer): string {
        if (!offer.isActive) return 'status-inactive';

        const now = new Date();
        const start = new Date(offer.startAt);
        const end = new Date(offer.endAt);

        if (now < start) return 'status-upcoming';
        if (now > end) return 'status-expired';

        return 'status-active';
    }

    IsInvalid(controlName: string): boolean {
        const control = this.offerForm.get(controlName);

        return !!control &&
            control.invalid &&
            (control.dirty || control.touched);
    }

    ApplyFilters(): void {
    this.page = 1;
    this.LoadOffers();
}

ResetFilters(): void {
    this.from = null;
    this.to = null;
    this.isActive = null;
    this.page = 1;

    this.LoadOffers();
}
hasAnyPermissionOf(permissions: number[]): boolean {
    return this.currentUserService.hasAnyPermissionOf(permissions);
  }
}
