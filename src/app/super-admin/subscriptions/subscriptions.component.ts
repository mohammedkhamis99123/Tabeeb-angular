import { Component, DestroyRef, inject, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgDataTableComponent } from '@bhplugin/ng-datatable';
import { TranslateService } from '@ngx-translate/core';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { Utilities } from 'src/app/common/utilities/utiliities';
import { CurrentUserService } from 'src/app/common/services/current-user.service';
import { SystemFacadeService } from 'src/app/common/services/system-facade.service';
import { SubscriptionService } from './services/subscriptions.service';
import { SubscriptionStatus } from 'src/app/common/enums/SubscriptionStatus.enum';
import { SupscriptionPackageService } from '../supscription-package/services/supscription-package.service';
import { ClinicService } from '../clinic/services/clinic.service';
import { IGetSubscription } from './models/IGetSubscription.model';
import { ISubscriptionHistory } from './models/ISubscriptionHistory.model';



@Component({
  selector: 'app-subscription',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionComponent implements AfterViewInit,OnInit {
  private destroyRef = inject(DestroyRef);
  @ViewChild("datatable") datatable!: NgDataTableComponent;
  @ViewChild("CrudModal") CrudModal!: NgxCustomModalComponent;
  @ViewChild('invoiceModal') invoiceModal!: NgxCustomModalComponent; // الـ Custom Modal بتاعكم

  pdfBlobUrl: string | null = null;
  isLoading: boolean = false;
  cols: { field: string; title: string; sort: boolean; }[];
  rows: any[] = [];
  packagesList: any[] = [];
  clinicsList: any[] = [];
  
  SearchTerm!: string;
  selectedPackageId: number | null = null;
  selectedStatus: SubscriptionStatus | null = null;
  from: string | null = null;
  to: string | null = null;

  sortColumn: string = "ID";
  ascending: boolean = true;
  pageNumber: number = 1;
  totalCount = 0;
  size = 10;
  state: string = "";
  showPdfViewer = false;
  subscriptionForm!: FormGroup;
  label = new Utilities(this.translate);
  SubscriptionStatus = SubscriptionStatus;
  pdfData: Uint8Array | null = null;

    @ViewChild('HistoryModal')
    historyModal!: NgxCustomModalComponent;

    subscriptionHistory: ISubscriptionHistory[] = [];
    historyLoading = false;
    historyError = false;
  constructor(
    public translate: TranslateService,
    private currentUserService: CurrentUserService,
    protected sfc: SystemFacadeService,
    private PackageServ:SupscriptionPackageService,
    private clinicServ:ClinicService,
    private subscriptionServ: SubscriptionService ,
    private cdr:ChangeDetectorRef// حقن السيرفر هنا
  ) {
    if (this.translate.currentLang == 'ae') {
      this.cols = [
        { field: 'ID', title: 'الرقم', sort: true },
        { field: 'ClinicName', title: 'اسم العيادة', sort: true },
        { field: 'PackageName', title: 'باقة الاشتراك', sort: true },
        { field: 'StartDate', title: 'تاريخ البداية', sort: true },
        { field: 'EndDate', title: 'تاريخ النهاية / الالغاء', sort: true },
        { field: 'Status', title: 'حالة الاشتراك', sort: true },
        { field: 'Actions', title: 'الإجراءات', sort: false }
      ];
    } else {
      this.cols = [
        { field: 'ID', title: 'ID', sort: true },
        { field: 'ClinicName', title: 'Clinic Name', sort: true },
        { field: 'PackageName', title: 'Package', sort: true },
        { field: 'StartDate', title: 'Start Date', sort: true },
        { field: 'EndDate', title: 'End Date / Cancel Date', sort: true },
        { field: 'Status', title: 'Status', sort: true },
        { field: 'Actions', title: 'Actions', sort: false }
      ];
    }

    this.initForms();
    this.LoadLookups();
    this.LoadData(this.buildFilterParams(1));
  }
  ngOnInit(): void {
    const originalSetAttribute = Element.prototype.setAttribute;

Element.prototype.setAttribute = function (name: string, value: string) {
    if (
        name.toLowerCase() === 'dir' &&
        (this === document.documentElement || this === document.body) &&
        value === 'ltr'
    ) {
        console.warn('Blocked PDF Viewer from changing page direction');
        return;
    }

    return originalSetAttribute.call(this, name, value);
};
  }
private originalSetAttribute: typeof Element.prototype.setAttribute | undefined;
private isPdfDirectionPatchInstalled = false;

private preventPdfViewerDirectionChange(): void {
    if (this.isPdfDirectionPatchInstalled) return;

    this.originalSetAttribute = Element.prototype.setAttribute;

    const original = this.originalSetAttribute;

    Element.prototype.setAttribute = function (
        name: string,
        value: string
    ): void {
        const isPageElement =
            this === document.documentElement ||
            this === document.body;

        const isDirectionAttribute =
            name.toLowerCase() === 'dir';

        const isPdfViewer =
            new Error().stack?.includes('viewer-5.4.1105') ||
            new Error().stack?.includes('ngx-extended-pdf-viewer');

        if (
            isPageElement &&
            isDirectionAttribute &&
            value.toLowerCase() === 'ltr' &&
            isPdfViewer
        ) {
            console.warn(
                'Blocked PDF Viewer from changing application direction.'
            );
            return;
        }

        original.call(this, name, value);
    };

    this.isPdfDirectionPatchInstalled = true;
}
  ngAfterViewInit(): void {}

  initForms() {
    this.subscriptionForm = new FormGroup({
      ClinicId: new FormControl(null, [Validators.required]),
      PackageId: new FormControl(null, [Validators.required]),
      StartAt: new FormControl(new Date().toISOString().split('T')[0], [Validators.required])
    });
  }

  // جلب قوائم الـ Dropdown (الباقات والعيادات ديناميكياً من الـ API)
  LoadLookups() {
    this.PackageServ.Dropdown().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: any) => {
      if (res.isSuccess) {
        this.packagesList = []
        res.data.forEach((e:any)=>{
          this.packagesList.push({id:e.id,arName:e.arName,enName:e.enName})
        })
      }
    });

this.clinicServ.Dropdown().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result)=>{
  this.clinicsList=[];
  result.data.forEach((e:any)=>{
    this.clinicsList.push({id:e.id,name:this.translate.currentLang=="ae" ?e.arName :e.enName})
  })
})
  }

  buildFilterParams(page: number = this.pageNumber):IGetSubscription {
    return {
      Page: page,
      PageSize: this.size,
      SearchTerm: this.SearchTerm || null,
      packageId: this.selectedPackageId,
      status: this.selectedStatus,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',
    
    };
  }

  // جلب داتا الجدول ديناميكياً من الـ API عبر الـ Service
  LoadData(params: any) {
    console.log(params);
    
    this.subscriptionServ.GetAll(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: any) => {
      if (res.isSuccess) {
        this.rows = res.data.items;
        this.totalCount = res.data.totalCount;
      }
    });
  }

  ResetValidation() {
    this.initForms();
    this.state = "Create";
  }

  // 1. إنشاء اشتراك جديد وإرسال الطلب للـ API
  CreateSubscription() {
    if (this.subscriptionForm.invalid) {
      this.subscriptionForm.markAllAsTouched();
      return;
    }

    const payload = this.subscriptionForm.value;
    
    this.subscriptionServ.Create(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: any) => {
      if (res.isSuccess) {
        this.showToast(this.translate.currentLang == 'ae' ? 'تم إنشاء الاشتراك بنجاح' : 'Subscription Created Successfully');
        this.CrudModal.close();
        this.LoadData(this.buildFilterParams(this.pageNumber));
      }
    });
  }

  // 2. تجديد الاشتراك (يستقبل الباقة والعيادة عبر الـ Service)
  openRenewModal(row: any) {
    Swal.fire({
      title: this.translate.currentLang == 'ae' ? 'تجديد اشتراك العيادة' : 'Renew Clinic Subscription',
      html: `
        <div class="text-right">
          <label class="block mb-1 font-semibold text-sm">${this.translate.currentLang == 'ae' ? 'اختر باقة التجديد' : 'Select Package'}</label>
          <select id="swalPackageId" class="swal2-select w-full form-select !m-0 !w-full">
            <option value="" disabled selected>${this.translate.currentLang == 'ae' ? '-- اختر الباقة --' : '-- Select Package --'}</option>
            ${this.packagesList.map(p => `<option value="${p.id}">${this.translate.currentLang == 'ae' ? p.arName : p.enName}</option>`).join('')}
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: this.translate.currentLang == 'ae' ? 'تجديد' : 'Renew',
      cancelButtonText: this.translate.currentLang == 'ae' ? 'إلغاء' : 'Cancel',
      preConfirm: () => {
        const packageId = (document.getElementById('swalPackageId') as HTMLSelectElement).value;
        if (!packageId) {
          Swal.showValidationMessage(this.translate.currentLang == 'ae' ? 'يرجى اختيار الباقة' : 'Please select a package');
        }
        return packageId;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const renewPayload = {
          clinicId: row.clinicId,
          subscriptionPackageId: parseInt(result.value)
        };
        
        this.subscriptionServ.Renew(renewPayload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: any) => {
          if (res.isSuccess) {
            this.showToast(this.translate.currentLang == 'ae' ? 'تم تجديد الاشتراك بنجاح' : 'Subscription Renewed Successfully');
            this.LoadData(this.buildFilterParams(this.pageNumber));
          }
        });
      }
    });
  }

  // 3. إلغاء الاشتراك وإرسال id العيادة للـ API
  CancelSubscription(clinicId: number) {
    Swal.fire({
      title: this.translate.currentLang == 'ae' ? 'تأكيد إلغاء الاشتراك' : 'Confirm Cancellation',
      text: this.translate.currentLang == 'ae' ? 'هل أنت متأكد من إلغاء اشتراك هذه العيادة؟' : 'Are you sure you want to cancel this clinic subscription?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.currentLang == 'ae' ? 'نعم، إلغاء الاشتراك' : 'Yes, Cancel',
      cancelButtonText: this.translate.currentLang == 'ae' ? 'تراجع' : 'Back',
      confirmButtonColor: '#d33'
    }).then((res) => {
      if (res.isConfirmed) {
        this.subscriptionServ.Cancel(clinicId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: any) => {
          if (res.isSuccess) {
            this.showToast(this.translate.currentLang == 'ae' ? 'تم إلغاء الاشتراك بنجاح' : 'Subscription Cancelled Successfully');
            this.LoadData(this.buildFilterParams(this.pageNumber));
          }
        });
      }
    });
  }

  downloadInvoice(invoiceNumber: string) {
    this.showToast(`جاري تحميل الفاتورة رقم: ${invoiceNumber}`);
  }

  onPageChange(pagenum: number): void {
    this.pageNumber = pagenum;
    this.LoadData(this.buildFilterParams(pagenum));
  }

  onSearch(): void {
    this.pageNumber = 1;
    if (this.datatable) this.datatable.currentPage = 1;
    this.LoadData(this.buildFilterParams(1));
  }

  onFilterChange(): void {
    this.pageNumber = 1;
    if (this.datatable) this.datatable.currentPage = 1;
    this.LoadData(this.buildFilterParams(1));
  }

  resetFilters() {
    this.SearchTerm = '';
    this.selectedPackageId = null;
    this.selectedStatus = null;
    this.from = null;
    this.to = null;
    this.pageNumber = 1;
    if (this.datatable) this.datatable.currentPage = 1;
    this.LoadData(this.buildFilterParams(1));
  }

  onSort(column: string): void {
    this.sortColumn = column;
    this.LoadData(this.buildFilterParams(1));
  }

  getdata(size: string) {
    this.size = parseInt(size);
    this.LoadData(this.buildFilterParams(1));
  }

  showToast(titleText: string) {
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      showCloseButton: true,
      customClass: { popup: `color-success` },
    });
    toast.fire({ title: titleText });
  }

  onchange(event: any) {
    if (event.change_type == 'sort') {
      this.ascending = event.sort_direction == 'asc';
      this.onSort(event.sort_column);
    } else if (event.change_type == 'page') {
      this.onPageChange(event.current_page);
    } else if (event.change_type == "pagesize") {
      this.getdata(event.pagesize.toString());
    }
  }

  hasAnyPermissionOf(permissions: number[]): boolean {
    return this.currentUserService.hasAnyPermissionOf(permissions);
  }

  openInvoiceModal(subId: string) {
    this.isLoading = true;
    this.pdfBlobUrl = null;

    // فتح المودال بتاعكم
    if (this.invoiceModal) {
      this.invoiceModal.open();
    }

    // جلب ملف الـ PDF كـ Blob (byte[]) من الباك إند
    this.subscriptionServ.downloadInvoice(subId).subscribe({

      next: (response: any) => {
      if (!response.isSuccess || !response.data) {
        this.isLoading = false;
        return;
      }

      const binary = atob(response.data);
      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      this.pdfData = bytes;
      this.isLoading = false;
      this.preventPdfViewerDirectionChange();
      this.cdr.detectChanges();

      requestAnimationFrame(() => {
        this.showPdfViewer = true;
        //this.restorePageDirection()
        this.cdr.detectChanges();
        
      });
    },
    
    
      error: (err) => {
        console.error('Error loading invoice:', err);
        this.isLoading = false;
      }
    });
  }
private restorePageDirection(): void {
  const direction = this.translate.currentLang === 'ar' ? 'rtl' : 'ltr';

  document.documentElement.setAttribute('dir', direction);
  document.body.setAttribute('dir', direction);
}
  onModalClose() {
    if (this.pdfBlobUrl) {
      URL.revokeObjectURL(this.pdfBlobUrl);
      this.pdfBlobUrl = null;
    }
  }
    get isArabic(): boolean {
        return this.translate.currentLang === 'ae';
    }

      openHistoryModal(clinicId: number): void {
        this.subscriptionHistory = [];
        this.historyLoading = true;
        this.historyError = false;

        this.historyModal.open();

        this.subscriptionServ.getSubscriptionHistory(clinicId).subscribe({
            next: (response: any) => {
                if (response?.isSuccess) {
                    this.subscriptionHistory = response.data ?? [];
                } else {
                    this.historyError = true;
                }

                this.historyLoading = false;
            },
            error: () => {
                this.historyError = true;
                this.historyLoading = false;
            }
        });
    }

getStatusClass(status: number): string {
    switch (status) {
        case 1: // New
            return 'status-new';

        case 2: // Current
            return 'status-current';

        case 3: // Canceled
            return 'status-cancelled';

        case 4: // Expired
            return 'status-expired';

        default:
            return 'status-default';
    }
}

getStatusLabel(status: number): string {
    const labels: Record<number, string> = {
        1: this.isArabic ? 'جديد' : 'New',
        2: this.isArabic ? 'نشط' : 'Current',
        3: this.isArabic ? 'ملغي' : 'Canceled',
        4: this.isArabic ? 'منتهي' : 'Expired'
    };

    return labels[status] ?? (this.isArabic ? 'غير معروف' : 'Unknown');
}
}