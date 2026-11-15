import { Component, DestroyRef, inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgDataTableComponent } from '@bhplugin/ng-datatable';
import { TranslateService } from '@ngx-translate/core';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { Utilities } from 'src/app/common/utilities/utiliities';
import { CurrentUserService } from 'src/app/common/services/current-user.service';
import { SystemFacadeService } from 'src/app/common/services/system-facade.service';
import * as L from 'leaflet';
import { ClinicService } from './services/clinic.service';
import { CityService } from '../city/services/city.service';
import { SupscriptionPackageService } from '../supscription-package/services/supscription-package.service';
import { environment } from 'src/environments/environment.prod';
import { IGetClinic } from './models/IGetClinic.model';
import { Language, TextLangValidator } from 'src/app/common/validators/textValidator';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.css']
})
export class ClinicComponent implements AfterViewInit {
  private destroyRef = inject(DestroyRef);
  @ViewChild("datatable") datatable!: NgDataTableComponent;
  @ViewChild("CrudModal") CrudModal !: NgxCustomModalComponent;
  @ViewChild('DeleteModal') DeleteModal: any;

  cols: { field: string; title: string; sort: boolean; }[];
  rows: any[] = [];
  citiesList: any[] = [];
  packagesList: any[] = [];
  SearchTerm!: string;
  selectedCityId: number | null = null;
  selectedStatus: boolean | null = null;
  sortColumn: string = "ID";
  ascending: boolean = true;
  pageNumber: number = 1;
  totalCount = 0;
  size = 10;
  state: string = "";
  selectedIdToDelete: number | null = null;
  selectedClinicId: number | null = null;
  selectedPackageId:number|null=null
  clinicForm: any;
  imagesForm!: FormGroup;
  activeMainTab: string = 'details';
  from:string|null=null;
  to:string|null=null

  // المعاينات والـ Popup
  logoPreview: string | null = null;
  bannerPreview: string | null = null;
  invoicePreview: string | null = null;
  showPopup: boolean = false;
  popupImageSrc: string | null = null;

  label = new Utilities(this.translate);

  private map: any;
  private marker: any;

  constructor(
    public translate: TranslateService,
    private currentUserService: CurrentUserService,
    protected sfc: SystemFacadeService,
    private clinicServ: ClinicService,
    private cityServ: CityService,
    private packageServ: SupscriptionPackageService
  ) {
    if (this.translate.currentLang == 'ae') {
      this.cols = [
        { field: 'ID', title: 'الرقم', sort: true },
        { field: 'ArName', title: 'اسم العيادة', sort: true },
        { field: 'Owner', title: 'المالك', sort: true },
        {field:'Package',title:"باقة الاشتراك",sort:false},
        {field:"SubscriptionEndAt",title:"تاريخ نهاية الاشتراك",sort:true},
        {field:'City',title:"المدينة",sort:false},
         {field:'Country',title:"الدولة",sort:false},
        {field:'DoctorsCount',title:"عدد الاطباء",sort:true},
        { field: 'IsActive', title: 'الحالة', sort: true },
        { field: 'Actions', title: 'الإجراءات', sort: false }
      ];
    } else {
      this.cols = [
        { field: 'ID', title: 'ID', sort: true },
        { field: 'ArName', title: 'Clinic Name', sort: true },
        { field: 'Owner', title: 'Owner', sort: true },
        {field:'Package',title:"Package",sort:false},
        {field:"SubscriptionEndAt",title:"Subscription End At",sort:true},
        {field:'City',title:"City",sort:false},
        {field:'Country',title:"Country",sort:false},
        {field:'DoctorsCount',title:"Doctors Count",sort:true},
        { field: 'IsActive', title: 'Status', sort: true },
        { field: 'Actions', title: 'Actions', sort: false }
      ];
    }

    const initialData:IGetClinic = {
      Page: 1,
      PageSize: this.size,
      SearchTerm: null,
      cityId: null,
      isActive: null,
      SortBy: null,
      SortOrder: null,
      subscriptionPackageId:null,
      from:null,
      to:null
    };

    this.LoadData(initialData);
    this.LoadCities();
    this.LoadPackages();
    this.initForms();
  }

  ngAfterViewInit(): void {}

  initForms() {
    this.clinicForm = new FormGroup({
      ArName: new FormControl('', [Validators.required, Validators.maxLength(200),TextLangValidator(Language.Arabic)]),
      EnName: new FormControl('', [Validators.required, Validators.maxLength(200),TextLangValidator(Language.English)]),
      StreetArName: new FormControl('', [Validators.required, Validators.maxLength(100),TextLangValidator(Language.Arabic)]),
      StreetEnName: new FormControl('', [Validators.required, Validators.maxLength(100),TextLangValidator(Language.English)]),
      Langitude: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      Latitude: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      CityId: new FormControl(null, [Validators.required]),
      SubscriptionPackageId: new FormControl(null, [Validators.required]),
      SubscriptionStartAt: new FormControl(new Date().toISOString().split('T')[0], [Validators.required]),
      ArDescription: new FormControl('', [Validators.required, Validators.maxLength(200),TextLangValidator(Language.Arabic)]),
      EnDescription: new FormControl('', [Validators.required, Validators.maxLength(200),TextLangValidator(Language.English)]),
      ProfileAr: new FormControl('', [Validators.required, Validators.maxLength(100),TextLangValidator(Language.Arabic)]),
      ProfileEn: new FormControl('', [Validators.required, Validators.maxLength(100),TextLangValidator(Language.English)]),
      OwnerArName: new FormControl('', [Validators.required]),
      OwnerEnName: new FormControl('', [Validators.required]),
      OwnerEmail: new FormControl('', [Validators.required, Validators.email]),
      OwnerPassword: new FormControl('', [Validators.required]),
      IsActive: new FormControl(true),
      SnapshatUser :new FormControl(''),
      InstgramUser :new FormControl(''),
      WhatsappNumber :new FormControl(''),
  
    });

    this.imagesForm = new FormGroup({
      LogoImage: new FormControl(null),
      BannerImage: new FormControl(null),
      InvoiceImage: new FormControl(null),
      DeleteLogoImage: new FormControl(false),
      DeleteBannerImage: new FormControl(false),
      DeleteInvoiceLogoImage: new FormControl(false)
    });
  }

  LoadCities() {
    this.cityServ.Dropdown().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result.isSuccess) {
        this.citiesList = [];
        result.data.forEach((e: any) => {
          this.citiesList.push({ id: e.id, arName: e.arName, enName: e.enName });
        });
      }
    });
  }

  LoadPackages() {
    this.packageServ.Dropdown().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result.isSuccess) {
        this.packagesList = [];
        result.data.forEach((e: any) => {
          this.packagesList.push({ id: e.id, arName: e.arName, enName: e.enName });
        });
      }
    });
  }

  initMap(lat: number = 24.7136, lng: number = 46.6753) {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    const currentLat = lat ? parseFloat(lat.toString()) : 24.7136;
    const currentLng = lng ? parseFloat(lng.toString()) : 46.6753;

    const mapContainer = document.getElementById('clinicMap');
    if (!mapContainer) return;

    this.map = L.map('clinicMap').setView([currentLat, currentLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; Tabeeb Platform'
    }).addTo(this.map);

    this.marker = L.marker([currentLat, currentLng], { draggable: true }).addTo(this.map);

    this.marker.on('dragend', (event: any) => {
      const position = event.target.getLatLng();
      this.clinicForm.patchValue({
        Latitude: position.lat.toFixed(6),
        Langitude: position.lng.toFixed(6)
      });
    });

    this.map.on('click', (event: any) => {
      const latLng = event.latlng;
      this.marker.setLatLng(latLng);
      this.clinicForm.patchValue({
        Latitude: latLng.lat.toFixed(6),
        Langitude: latLng.lng.toFixed(6)
      });
    });

    if (!this.clinicForm.get('Latitude')?.value) {
      this.clinicForm.patchValue({
        Latitude: currentLat.toFixed(6),
        Langitude: currentLng.toFixed(6)
      });
    }

    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize(true);
      }
    }, 200);
  }

  openMapWithDelay(lat?: number, lng?: number) {
    setTimeout(() => {
      this.initMap(lat, lng);
    }, 300);
  }

ResetValidation() {
    this.initForms();
    this.state = "Create";
    this.activeMainTab = 'details';
    this.logoPreview = this.bannerPreview = this.invoicePreview = null;
    this.selectedClinicId = null;
    
    // محاولة جلب الموقع الحالي للمستخدم عند فتح إنشاء عيادة جديدة
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // تحديث الفورم بالإحداثيات الحالية
          this.clinicForm.patchValue({
            Latitude: lat.toFixed(6),
            Langitude: lng.toFixed(6)
          });

          // فتح الخريطة على الإحداثيات الحالية
          this.openMapWithDelay(lat, lng);
        },
        (error) => {
          // في حال رفض المستخدم الصلاحية أو حدث خطأ، نفتتح على الإحداثيات الافتراضية (الرياض مثلاً أو مركز معين)
          console.warn('Geolocation not allowed or failed, using default location.', error);
          this.openMapWithDelay(24.7136, 46.6753);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      // لو المتصفح لا يدعم الـ Geolocation
      this.openMapWithDelay(24.7136, 46.6753);
    }
  }

  // إدارة اختيار الملفات ورفع السحب والإفلات
  onFileSelected(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) this.processFile(file, controlName);
  }

  onFileDropped(event: DragEvent, controlName: string) {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0], controlName);
    }
  }

  private processFile(file: File, controlName: string) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (controlName === 'LogoImage') {
        this.logoPreview = e.target.result;
        this.imagesForm.patchValue({ DeleteLogoImage: false });
      } else if (controlName === 'BannerImage') {
        this.bannerPreview = e.target.result;
        this.imagesForm.patchValue({ DeleteBannerImage: false });
      } else if (controlName === 'InvoiceImage') {
        this.invoicePreview = e.target.result;
        this.imagesForm.patchValue({ DeleteInvoiceLogoImage: false });
      }
    };
    reader.readAsDataURL(file);
    this.imagesForm.get(controlName)?.setValue(file);
  }

  removeImage(controlName: string) {
    if (controlName === 'LogoImage') {
      this.logoPreview = null;
      this.imagesForm.patchValue({ LogoImage: null, DeleteLogoImage: true });
    } else if (controlName === 'BannerImage') {
      this.bannerPreview = null;
      this.imagesForm.patchValue({ BannerImage: null, DeleteBannerImage: true });
    } else if (controlName === 'InvoiceImage') {
      this.invoicePreview = null;
      this.imagesForm.patchValue({ InvoiceImage: null, DeleteInvoiceLogoImage: true });
    }
  }

  openImagePopup(src: string) {
    this.popupImageSrc = src;
    this.showPopup = true;
  }

  onPageChange(pagenum: number): void {
    this.pageNumber = pagenum;
    var data:IGetClinic={ Page: pagenum, PageSize: this.size, SearchTerm: this.SearchTerm || null, cityId: this.selectedCityId, isActive: this.selectedStatus, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' ,subscriptionPackageId:this.selectedPackageId,from:this.from,to:this.to}
    this.LoadData(data);
  }

  onSearch(): void {
    this.pageNumber = 1;
    if (this.datatable) this.datatable.currentPage = 1;
    var data:IGetClinic={ Page: 1, PageSize: this.size, SearchTerm: this.SearchTerm || null, cityId: this.selectedCityId, isActive: this.selectedStatus, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' ,subscriptionPackageId:this.selectedPackageId,from:this.from,to:this.to}
    this.LoadData(data);
  }

  onFilterChange(): void {
    this.pageNumber = 1;
    if (this.datatable) this.datatable.currentPage = 1;
    var data:IGetClinic={ Page: 1, PageSize: this.size, SearchTerm: this.SearchTerm || null, cityId: this.selectedCityId, isActive: this.selectedStatus, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' ,subscriptionPackageId:this.selectedPackageId,from:this.from,to:this.to};
  
    this.LoadData(data)
  }
  resetFilters() {
    this.SearchTerm = '';
    this.selectedCityId = null;
    this.selectedStatus = null;
    this.selectedPackageId=null
    this.pageNumber = 1;
    if (this.datatable) this.datatable.currentPage = 1;
    var data:IGetClinic={ Page: 1, PageSize: this.size, SearchTerm: null, cityId: null, isActive: null, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc',subscriptionPackageId:this.selectedPackageId,from:this.from,to:this.to }
    this.LoadData(data);
  }

  onSort(column: string): void {
    this.sortColumn = column;
        var data:IGetClinic={ Page: 1, PageSize: this.size, SearchTerm: null, cityId: null, isActive: null, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc',subscriptionPackageId:this.selectedPackageId,from:this.from,to:this.to }

    this.LoadData(data)
  }
  getdata(size: string) {
    this.size = parseInt(size);
    var data:IGetClinic={ Page: 1, PageSize: this.size, SearchTerm: null, cityId: null, isActive: null, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc',subscriptionPackageId:this.selectedPackageId,from:this.from,to:this.to }

    this.LoadData(data);
  }

  LoadData(data: IGetClinic) {
    this.clinicServ.getAll(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result.isSuccess) {
        this.rows = result.data.items;
        this.totalCount = result.data.totalCount;
      }
    });
  }

  Update(id: number) {
    this.state = "Update";
    this.selectedClinicId = id;
    sessionStorage.setItem("UpdatedClinicID", id.toString());
    
    this.clinicServ.GetByID(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result: any) => {
      const val = result.data as any;
      this.clinicForm.patchValue({
        ArName: val.arName,
        EnName: val.enName,
        StreetArName: val.streetArName,
        StreetEnName: val.streetEnName,
        Langitude: val.langitude,
        Latitude: val.latitude,
        CityId: val.cityId,
        SubscriptionPackageId: val.subscriptionPackageId,
        SubscriptionStartAt: val.subscriptionStartAt,
        ArDescription: val.arDescription,
        EnDescription: val.enDescription,
        ProfileAr: val.profileAr,
        ProfileEn: val.profileEn,
        OwnerArName: val.ownerArName,
        OwnerEnName: val.ownerEnName,
        OwnerEmail: val.ownerEmail,
        IsActive: val.isActive,
        SnapshatUser :val.snapshatUser,
        InstgramUser :val.instgramUser,
        WhatsappNumber:val.whatsappNumber
      })

      this.logoPreview =val.logoPath? environment.ImageServer+"/Images/"+ val.logoPath : null;
      this.bannerPreview = val.bannerPath?environment.ImageServer+"/Images/"+val.bannerPath : null;
      this.invoicePreview =val.invoiceLogoPath? environment.ImageServer+"/Images/"+val.invoiceLogoPath : null;

      this.openMapWithDelay(val.latitude, val.langitude);
    });
    
    this.CrudModal.open();
  }

  UpdateRecord() {
    const data = {
      id: parseInt(sessionStorage.getItem("UpdatedClinicID")!),
      ...this.clinicForm.value
    };
    this.clinicServ.Update(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result: any) => {
      if (result.isSuccess) {
        this.selectedClinicId = data.id;
        this.showToast(this.translate.currentLang == "ae" ? "تم التعديل بنجاح، يمكنك تحديث الصور" : "Updated Successfully, you can manage images");
        this.activeMainTab = 'images';
        var dataToLoad:IGetClinic={ Page: this.pageNumber, PageSize: this.size, SearchTerm: this.SearchTerm || null, cityId: this.selectedCityId, isActive: this.selectedStatus, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' ,subscriptionPackageId:this.selectedPackageId,from:this.from,to:this.to}
        this.LoadData(dataToLoad);      }
    });
  }

  Add() {
    const data = {
      ...this.clinicForm.value
    };
    this.clinicServ.Add(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result: any) => {
      if (result.isSuccess) {
        this.selectedClinicId = result.data;
        this.showToast(this.translate.currentLang == "ae" ? "تم الحفظ بنجاح، يمكنك رفع الصور الآن" : "Added Successfully, you can upload images now");
        this.activeMainTab = 'images';
        var data:IGetClinic={ Page: this.pageNumber, PageSize: this.size, SearchTerm: this.SearchTerm || null, cityId: this.selectedCityId, isActive: this.selectedStatus, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' ,subscriptionPackageId:this.selectedPackageId,from:this.from,to:this.to}
        this.LoadData(data);
      }
    });
  }

  SaveClinicImages() {
    if (!this.selectedClinicId) {
      Swal.fire('Error', this.translate.currentLang == 'ae' ? 'يرجى حفظ بيانات العيادة أولاً' : 'Please save clinic details first!', 'error');
      this.activeMainTab = 'details';
      return;
    }

    const formData = new FormData();
    formData.append('ClinicId', this.selectedClinicId.toString());
    
    if (this.imagesForm.get('LogoImage')?.value) {
      formData.append('LogoImage', this.imagesForm.get('LogoImage')?.value);
    }
    if (this.imagesForm.get('BannerImage')?.value) {
      formData.append('BannerImage', this.imagesForm.get('BannerImage')?.value);
    }
    if (this.imagesForm.get('InvoiceImage')?.value) {
      formData.append('InvoiceImage', this.imagesForm.get('InvoiceImage')?.value);
    }
    
    formData.append('DeleteLogoImage', this.imagesForm.get('DeleteLogoImage')?.value);
    formData.append('DeleteBannerImage', this.imagesForm.get('DeleteBannerImage')?.value);
    formData.append('DeleteInvoiceLogoImage', this.imagesForm.get('DeleteInvoiceLogoImage')?.value);

    this.clinicServ.UpdateImages(formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result: any) => {
      if (result.isSuccess) {
        this.showToast(this.translate.currentLang == "ae" ? "تم حفظ الصور بنجاح" : "Images Saved Successfully");
        this.CrudModal.close();
      }
    });
  }

  HandleRequest() {
    if (this.clinicForm.invalid) {
      this.clinicForm.markAllAsTouched();
      this.activeMainTab = 'details';
      return;
    }

    if (this.state == "Update") {
      this.UpdateRecord();
    } else {
      this.Add();
    }
  }

  Delete(id: number) {
    this.selectedIdToDelete = id;
    this.DeleteModal.open();
  }

  DeleteRecord() {
    this.clinicServ.Delete(this.selectedIdToDelete!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result: any) => {
      if (result.isSuccess) {
        this.showToast(this.translate.currentLang == "ae" ? "تم الحذف بنجاح" : "Deleted Successfully");
        this.DeleteModal.close();
      }

      if ((this.totalCount % this.size == 1) && this.totalCount > this.size && this.pageNumber == Math.ceil(this.totalCount / this.size)) {
        this.pageNumber = this.pageNumber - 1;
      }
        var data:IGetClinic={ Page: this.pageNumber, PageSize: this.size, SearchTerm: this.SearchTerm || null, cityId: this.selectedCityId, isActive: this.selectedStatus, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' ,subscriptionPackageId:this.selectedPackageId,from:this.from,to:this.to}
        this.LoadData(data);
      if (this.datatable) this.datatable.currentPage = this.pageNumber;
    });
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
}