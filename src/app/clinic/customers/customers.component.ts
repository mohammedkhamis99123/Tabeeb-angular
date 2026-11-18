import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICustomer } from './models/ICustomer.model';
import { CustomersService } from './services/customers.service';
import { IGetGeneric } from 'src/app/common/models/IGenericGet';
import { IUpdateCustomer } from './models/IUpdateCustomer.model';
import { Utilities } from 'src/app/common/utilities/utiliities';
import { TranslateService } from '@ngx-translate/core';
import { Language, TextLangValidator } from 'src/app/common/validators/textValidator';
import Swal from 'sweetalert2';
import { SystemFacadeService } from 'src/app/common/services/system-facade.service';
import { CurrentUserService } from 'src/app/common/services/current-user.service';


@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {

    @ViewChild('CrudModal') CrudModal: any;
 
    customers: ICustomer[] = [];
    
    customerForm!: FormGroup;

    loading = false;
    submitting = false;

    isEditMode = false;
    selectedCustomerId: number | null = null;

    isArabic =
        localStorage.getItem('i18nextLng') === 'ar' ||
        document.documentElement.dir === 'rtl';

    // Pagination
    page = 1;
    pageSize = 10;
    totalRows = 0;
    
    // Search
    searchTerm = '';

 
  Utility: Utilities;
  cols: ({ field: string; title: string; isUnique: boolean; hide: boolean; sort?: undefined; } | { field: string; title: string; sort: boolean; isUnique?: undefined; hide?: undefined; })[];

    constructor(
        private fb: FormBuilder,
        private customersService: CustomersService,
        private translate:TranslateService,
        protected sfc:SystemFacadeService,
        private currentUserService:CurrentUserService
    ) {

          this.Utility=new Utilities(this.translate);
          if(translate.currentLang!='ae'){
       this.cols = [
        {
            field: 'id',
            title: '#',
            isUnique: true,
            hide: false
        },
        {
            field: 'customerName',
            title: 'Customer',
            sort: true
        },
        {
            field: 'medicalfile',
            title: 'MedicalFile',
            sort: true
        },
        {
            field: 'identityNumber',
            title: 'IdentityNumber',
            sort: true
        },
        {
            field: 'phoneNumber',
            title: 'PhoneNumber',
            sort: false
        },
        {
            field: 'email',
            title: 'Email',
            sort: true
        },
        {
            field: 'actions',
            title: 'Actions',
            sort: false
        }
    ];
          }else{
                   this.cols = [
        {
            field: 'id',
            title: '#',
            isUnique: true,
            hide: false
        },
        {
            field: 'customerName',
            title: 'العميل',
            sort: true
        },
        {
            field: 'medicalfile',
            title: 'الملف الطبى',
            sort: true
        },
        {
            field: 'identityNumber',
            title: 'رقم الهوية',
            sort: true
        },
        {
            field: 'phoneNumber',
            title: 'رقم الجوال',
            sort: false
        },
        {
            field: 'email',
            title: 'البريد الالكترونى',
            sort: true
        },
        {
            field: 'actions',
            title: 'الاجراءات',
            sort: false
        }
    ];
          }
   

    }

    ngOnInit(): void {
        this.initForm();
        this.GetCustomers();
    }

    // =====================================
    // Form Initialization
    // =====================================

    initForm(): void {

        this.customerForm = this.fb.group({

            arName: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(150) ,
                    TextLangValidator(Language.Arabic)
                ]
            ],

            enName: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(150),
                    TextLangValidator(Language.English)
                ]
            ],

            address: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(300)
                ]
            ],

            email: [
                '',
                [
                    Validators.required,
                    Validators.email
                ]
            ],

            phoneNumber: [
                '',
                [
                    Validators.required
                ]
            ],

            identityNumber: [
                '',
                [
                    Validators.required
                ]
            ],

            medicalFile: [
                null,
                [
                    Validators.required,
                    Validators.min(1)
                ]
            ]

        });
    }

    get f() {
        return this.customerForm.controls;
    }

    // =====================================
    // Get Customers
    // =====================================

    GetCustomers(): void {

        this.loading = true;

        const request: IGetGeneric = {

            Page: this.page,

            PageSize: this.pageSize,

            SearchTerm: this.searchTerm?.trim() || null,

            SortBy: null,

            SortOrder: null

        };

        this.customersService.getCustomers(request).subscribe({

            next: (response: any) => {

                const result = response?.data ?? response;

                this.customers = result?.items ?? [];

                this.totalRows = result?.totalCount ?? 0;

                this.loading = false;

            },

            error: (error) => {

                console.error('Get Customers Error:', error);

                this.customers = [];

                this.totalRows = 0;

                this.loading = false;

            }

        });

    }

    // =====================================
    // Server Pagination & Sorting
    // =====================================

    onchange(event: any): void {

        if (event.current_page !== undefined) {
            this.page = event.current_page;
        }

        if (event.page !== undefined) {
            this.page = event.page;
        }

        if (event.pagesize !== undefined) {
            this.pageSize = event.pagesize;
            this.page = 1;
        }

        if (event.pageSize !== undefined) {
            this.pageSize = event.pageSize;
            this.page = 1;
        }

        this.GetCustomers();

    }

    // =====================================
    // Search
    // =====================================

    onSearch(): void {

        this.page = 1;

        this.GetCustomers();

    }

    resetSearch(): void {

        this.searchTerm = '';

        this.page = 1;

        this.GetCustomers();

    }

    // =====================================
    // Create Customer Modal
    // =====================================

    OpenCreateModal(): void {

        this.isEditMode = false;

        this.selectedCustomerId = null;

        this.customerForm.enable();

        this.customerForm.reset({

            arName: '',
            enName: '',
            address: '',
            email: '',
            phoneNumber: '',
            identityNumber: '',
            medicalFile: null

        });

        this.CrudModal.open();

    }

    // =====================================
    // Edit Customer Modal
    // =====================================

    OpenEditModal(customer: ICustomer): void {

        this.isEditMode = true;

        this.selectedCustomerId = customer.id!;

        this.customerForm.enable();

        this.customerForm.patchValue({

            arName: customer.arName,

            enName: customer.enName,

            address: customer.address,

            email: customer.email,

            phoneNumber: customer.phoneNumber,

            identityNumber: customer.identityNumber,

            medicalFile: customer.medicalfile

        });

        // Disable all fields except Medical File
        this.customerForm.disable();

        this.customerForm.get('medicalFile')?.enable();

        this.CrudModal.open();

    }

    // =====================================
    // Add Customer
    // =====================================

    HandleRequest(): void {

        if (this.customerForm.invalid) {

            this.customerForm.markAllAsTouched();

            this.logFormErrors();

            return;

        }

        this.submitting = true;

        const request: ICustomer = {

            arName: this.f['arName'].value?.trim(),

            enName: this.f['enName'].value?.trim(),

            address: this.f['address'].value?.trim(),

            email: this.f['email'].value?.trim(),

            phoneNumber: this.f['phoneNumber'].value?.trim(),

            identityNumber: this.f['identityNumber'].value?.trim(),

            medicalfile: Number(this.f['medicalFile'].value)

        };

        this.customersService.addCustomer(request).subscribe({

            next: (response: any) => {

                if (response?.isSuccess) {

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

                this.submitting = false;

                this.CrudModal.close();

                this.GetCustomers();

                }

            },

            error: (error) => {

                console.error('Add Customer Error:', error);

                this.submitting = false;

                this.showError(
                    error?.error?.message ||
                    (this.isArabic
                        ? 'حدث خطأ أثناء إضافة العميل'
                        : 'An error occurred while adding customer')
                );

            }

        });

    }

    // =====================================
    // Update Customer Medical File
    // =====================================

    UpdateCustomer(): void {

        const medicalFileControl = this.customerForm.get('medicalFile');

        if (!medicalFileControl || medicalFileControl.invalid) {

            medicalFileControl?.markAsTouched();

            return;

        }

        if (!this.selectedCustomerId) return;

        this.submitting = true;

        const request: IUpdateCustomer = {

            customerId: this.selectedCustomerId,

            medicalFile: Number(medicalFileControl.value)

        };

        this.customersService.updateCustomer(request).subscribe({

            next: (response: any) => {

                if (response?.isSuccess ) {

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

                this.submitting = false;

                this.CrudModal.close();

                this.GetCustomers();
                }
            },

            error: (error) => {

                console.error('Update Customer Error:', error);

                this.submitting = false;

                this.showError(
                    error?.error?.message ||
                    (this.isArabic
                        ? 'حدث خطأ أثناء تعديل الملف الطبي'
                        : 'Error updating medical file')
                );

            }

        });

    }

    // =====================================
    // Submit Form
    // =====================================

    onSubmit(): void {

        if (this.isEditMode) {

            this.UpdateCustomer();

        } else {

            this.HandleRequest();

        }

    }

    // =====================================
    // Close Modal
    // =====================================

    CloseModal(): void {

        this.CrudModal.close();

        this.customerForm.enable();

        this.isEditMode = false;

        this.selectedCustomerId = null;

        this.submitting = false;

    }

    // =====================================
    // Form Errors
    // =====================================

    logFormErrors(): void {

        Object.keys(this.customerForm.controls).forEach(key => {

            const control = this.customerForm.get(key);

            if (control?.invalid) {

                console.log('Invalid Field:', key);

                console.log('Errors:', control.errors);

                console.log('Value:', control.value);

            }

        });

    }

    getErrorMessage(controlName: string): string {

        const control = this.customerForm.get(controlName);

        if (!control || !control.touched || !control.errors) {
            return '';
        }

        if (control.hasError('required')) {

            return this.isArabic
                ? 'هذا الحقل مطلوب'
                : 'This field is required';

        }

        if (control.hasError('email')) {

            return this.isArabic
                ? 'البريد الإلكتروني غير صحيح'
                : 'Invalid email address';

        }

        if (control.hasError('min')) {

            return this.isArabic
                ? 'يجب أن تكون القيمة أكبر من صفر'
                : 'Value must be greater than zero';

        }

        if (control.hasError('maxlength')) {

            return this.isArabic
                ? 'عدد الأحرف أكبر من المسموح'
                : 'Maximum length exceeded';

        }

        if(control.hasError("invalidLanguage")){
            return this.isArabic
            ? 'لغة غير صحيحة'
            : 'Invalid Language';
        }

        return this.isArabic
            ? 'قيمة غير صحيحة'
            : 'Invalid value';

    }

    // =====================================
    // Helpers
    // =====================================

    getCustomerName(customer: ICustomer): string {

        return this.isArabic
            ? customer.arName || customer.enName
            : customer.enName || customer.arName;

    }

    getInitials(customer: ICustomer): string {

        const name = this.getCustomerName(customer);

        return name
            ?.split(' ')
            .filter(x => x)
            .slice(0, 2)
            .map(x => x.charAt(0))
            .join('')
            .toUpperCase() || 'C';

    }

    showError(message: string): void {

       const toast = Swal.mixin({
                 toast: true,
                 position: 'top-end',
                 showConfirmButton: false,
                 timer: 3000,
                 showCloseButton: true,
                 customClass: { popup: `color-danger` },
               });
       
               toast.fire({
                 title: message,
               }); 

    }

    hasAnyPermissionOf(permissions: number[]): boolean {
    return this.currentUserService.hasAnyPermissionOf(permissions);
  }

}