
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  effect,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import * as L from 'leaflet';

import { MyClinicService } from './services/my-clinic.service';
import { CityService } from 'src/app/super-admin/city/services/city.service';
import { UpdateMyClinic } from './models/UpdateMyClinic.model';

import {
  Language,
  TextLangValidator
} from 'src/app/common/validators/textValidator';
import { environment } from 'src/environments/environment.prod';

type ClinicTab = 'basic' | 'owner' | 'social';

const defaultIcon = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

@Component({
  selector: 'app-clinic-settings',
 
  templateUrl: './my-clinic.component.html',
  styleUrls: ['./my-clinic.component.css']
})
export class myClinicComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private clinicService = inject(MyClinicService);
  private cityService = inject(CityService);
  logoPreview: string | null = null;
bannerPreview: string | null = null;
invoicePreview: string | null = null;
isUploadingImages = signal<boolean>(false);
imagesForm!: FormGroup;
  @ViewChild('mapContainer')
  set mapContainerRef(el: ElementRef<HTMLDivElement> | undefined) {
    this.mapElement = el?.nativeElement;

    if (this.mapElement && this.activeTab === 'basic') {
      setTimeout(() => this.initOrUpdateMap(), 100);
    }
  }

  private mapElement?: HTMLDivElement;
  private map?: L.Map;
  private marker?: L.Marker;

  activeTab = 'basic';

  isLoading = signal(false);
  isSaving = signal(false);
  isLocating = signal(false);

  alertMessage = signal<string | null>(null);
  alertType = signal<'success' | 'error'>('success');

  locationMessage = signal<string | null>(null);

  clinicId = signal<number | null>(null);
  clinicName = signal<string>('');

  cities : any[]=[];

  locationInputText = '';

  clinicForm!: FormGroup;

  constructor() {
    effect(() => {
      const tab = this.activeTab;

      if (tab === 'basic' && !this.isLoading()) {
        setTimeout(() => {
          this.initOrUpdateMap();
          this.map?.invalidateSize();
        }, 100);
      } else {
        this.destroyMap();
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadCities();
    this.loadClinic();
  }

  ngOnDestroy(): void {
    this.destroyMap();
  }

  // ==============================
  // Form
  // ==============================

  private initForm(): void {

    this.clinicForm = this.fb.group({

      arName: ['', [
        Validators.required,
        Validators.maxLength(200),
        TextLangValidator(Language.Arabic)
      ]],

      enName: ['', [
        Validators.required,
        Validators.maxLength(200),
        TextLangValidator(Language.English)
      ]],

      streetArName: ['', [
        Validators.required,
        Validators.maxLength(100),
        TextLangValidator(Language.Arabic)
      ]],

      streetEnName: ['', [
        Validators.required,
        Validators.maxLength(100),
        TextLangValidator(Language.English)
      ]],

      cityId: [null, [
        Validators.required
      ]],

      latitude: ['24.7136', [
        Validators.required,
        Validators.maxLength(150)
      ]],

      langitude: ['46.6753', [
        Validators.required,
        Validators.maxLength(150)
      ]],

      arDescription: ['', [
        Validators.required,
        Validators.maxLength(200),
        TextLangValidator(Language.Arabic)
      ]],

      enDescription: ['', [
        Validators.required,
        Validators.maxLength(200),
        TextLangValidator(Language.English)
      ]],

      profileAr: ['', [
        Validators.required,
        Validators.maxLength(100),
        TextLangValidator(Language.Arabic)
      ]],

      profileEn: ['', [
        Validators.required,
        Validators.maxLength(100),
        TextLangValidator(Language.English)
      ]],

      ownerArName: ['', [
        Validators.required
      ]],

      ownerEnName: ['', [
        Validators.required
      ]],

      ownerEmail: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(200)
      ]],

      snapshatUser: [''],
      instgramUser: [''],
      whatsappNumber: [''],

    });

    this.imagesForm = this.fb.group({
  LogoImage: [null],
  BannerImage: [null],
  InvoiceImage: [null],

  DeleteLogoImage: [false],
  DeleteBannerImage: [false],
  DeleteInvoiceLogoImage: [false]
});
  }

  // ==============================
  // Load Data
  // ==============================

  loadCities(): void {

    this.cityService.Dropdown().subscribe({

      next: (res: any) => {
        this.cities=[]
        res.data.forEach((element:any) => {
          this.cities.push({id:element.id,name:element.arName})
        });;
      },

      error: () => {
        this.showAlert('تعذر تحميل قائمة المدن', 'error');
      }

    });
  }

  loadClinic(): void {

    const selectedClinic = sessionStorage.getItem('SelectedClinic');

    if (!selectedClinic || isNaN(Number(selectedClinic))) {
      this.showAlert('لم يتم تحديد العيادة', 'error');
      return;
    }

    this.isLoading.set(true);

    this.clinicService.getClinicById(Number(selectedClinic)).subscribe({

      next: (res: any) => {

        const clinic = res?.data;

        if (!clinic) {
          this.showAlert('لم يتم العثور على بيانات العيادة', 'error');
          this.isLoading.set(false);
          return;
        }

        this.clinicId.set(clinic.id ?? null);

        this.clinicName.set(
          clinic.arName || clinic.enName || 'My Clinic'
        );

        this.patchClinicForm(clinic);
        const imageServer = environment.ImageServer ;

this.logoPreview = clinic.logoPath
  ? imageServer+"/" + clinic.logoPath
  : null;

this.bannerPreview = clinic.bannerPath
  ? imageServer +"/"+ clinic.bannerPath
  : null;

this.invoicePreview = clinic.invoiceLogoPath
  ? imageServer +"/"+ clinic.invoiceLogoPath
  : null;
        this.isLoading.set(false);

        setTimeout(() => {
          this.initOrUpdateMap();
        }, 100);

      },

      error: () => {

        this.isLoading.set(false);

        this.showAlert(
          'حدث خطأ أثناء تحميل بيانات العيادة',
          'error'
        );

      }

    });
  }

  private patchClinicForm(clinic: any): void {

    this.clinicForm.patchValue({

      arName: clinic.arName ?? '',
      enName: clinic.enName ?? '',

      cityId: clinic.cityId ?? null,

      streetArName: clinic.streetArName ?? '',
      streetEnName: clinic.streetEnName ?? '',

      latitude: clinic.latitude ?? '24.7136',
      langitude: clinic.langitude ?? '46.6753',

      arDescription: clinic.arDescription ?? '',
      enDescription: clinic.enDescription ?? '',

      profileAr: clinic.profileAr ?? '',
      profileEn: clinic.profileEn ?? '',

      ownerArName: clinic.ownerArName ?? '',
      ownerEnName: clinic.ownerEnName ?? '',
      ownerEmail: clinic.ownerEmail ?? '',

      snapshatUser: clinic.snapshatUser ?? '',
      instgramUser: clinic.instgramUser ?? '',
      whatsappNumber: clinic.whatsappNumber ?? ''

    });

  }

  // ==============================
  // Tabs
  // ==============================

  setTab(tab: ClinicTab): void {
    this.activeTab=tab;
    this.alertMessage.set(null);
  }

  hasTabError(tab: ClinicTab): boolean {

    const fieldsByTab: Record<ClinicTab, string[]> = {

      basic: [
        'arName',
        'enName',
        'cityId',
        'streetArName',
        'streetEnName',
        'latitude',
        'langitude',
        'arDescription',
        'enDescription',
        'profileAr',
        'profileEn'
      ],

      owner: [
        'ownerArName',
        'ownerEnName',
        'ownerEmail'
      ],

      social: []

    };

    return fieldsByTab[tab].some(field => {
      const control = this.clinicForm.get(field);

      return !!(
        control &&
        control.invalid &&
        (control.dirty || control.touched)
      );
    });
  }

  // ==============================
  // Validation Helpers
  // ==============================

  isInvalid(field: string): boolean {

    const control = this.clinicForm.get(field);

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  getErrorMessage(field: string): string {

    const control = this.clinicForm.get(field);

    if (!control || !control.errors) return '';

    if (control.hasError('required')) {
      return 'هذا الحقل مطلوب';
    }

    if (control.hasError('email')) {
      return 'يرجى إدخال بريد إلكتروني صحيح';
    }

    if (control.hasError('maxlength')) {
      return `الحد الأقصى ${control.getError('maxlength').requiredLength} حرف`;
    }

    return 'يرجى إدخال قيمة صحيحة';
  }

  // ==============================
  // Map
  // ==============================

  private destroyMap(): void {

    if (this.map) {
      this.map.remove();
      this.map = undefined;
      this.marker = undefined;
    }

  }

  private getValidCoords(): [number, number] | null {

    const lat = Number(this.clinicForm?.get('latitude')?.value);
    const lng = Number(this.clinicForm?.get('langitude')?.value);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return null;
    }

    return [lat, lng];
  }

  initOrUpdateMap(): void {

    if (!this.mapElement) return;

    const coords = this.getValidCoords() ?? [24.7136, 46.6753];

    if (!this.map) {

      this.map = L.map(this.mapElement, {
        center: coords,
        zoom: 15
      });

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap'
        }
      ).addTo(this.map);

      this.marker = L.marker(coords, {
        draggable: true
      }).addTo(this.map);

      this.marker.on('dragend', () => {

        const position = this.marker!.getLatLng();

        this.setCoordsInForm(
          position.lat,
          position.lng,
          'تم تحديث الموقع بنجاح'
        );

      });

      this.map.on('click', (event: L.LeafletMouseEvent) => {

        this.marker?.setLatLng(event.latlng);

        this.setCoordsInForm(
          event.latlng.lat,
          event.latlng.lng,
          'تم تحديد الموقع من الخريطة'
        );

      });

    } else {

      this.marker?.setLatLng(coords);
      this.map.setView(coords, 15);
      this.map.invalidateSize();

    }

  }

  onManualCoordChange(): void {

    const coords = this.getValidCoords();

    if (!coords) return;

    this.marker?.setLatLng(coords);
    this.map?.setView(coords, 15);

  }

  private setCoordsInForm(
    lat: number,
    lng: number,
    message: string
  ): void {

    this.clinicForm.patchValue({

      latitude: lat.toFixed(6),
      langitude: lng.toFixed(6)

    });

    this.clinicForm.get('latitude')?.markAsDirty();
    this.clinicForm.get('langitude')?.markAsDirty();

    this.locationMessage.set(message);

  }

  useCurrentLocation(): void {

    this.locationMessage.set(null);

    if (!navigator.geolocation) {
      this.locationMessage.set(
        'المتصفح لا يدعم تحديد الموقع الجغرافي'
      );
      return;
    }

    this.isLocating.set(true);

    navigator.geolocation.getCurrentPosition(

      position => {

        const { latitude, longitude } = position.coords;

        this.setCoordsInForm(
          latitude,
          longitude,
          'تم تحديد موقعك الحالي بنجاح'
        );

        this.marker?.setLatLng([latitude, longitude]);
        this.map?.setView([latitude, longitude], 16);

        this.isLocating.set(false);

      },

      () => {

        this.isLocating.set(false);

        this.locationMessage.set(
          'تعذر الوصول للموقع، تأكد من منح صلاحية الموقع'
        );

      },

      {
        enableHighAccuracy: true,
        timeout: 10000
      }

    );

  }

  applyCoordinatesInput(): void {

    this.locationMessage.set(null);

    const matches = this.locationInputText
      .trim()
      .match(/-?\d+(?:\.\d+)?/g);

    if (!matches || matches.length < 2) {

      this.locationMessage.set(
        'أدخل الإحداثيات بصيغة صحيحة مثل: 24.7136, 46.6753'
      );

      return;
    }

    const lat = Number(matches[0]);
    const lng = Number(matches[1]);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {

      this.locationMessage.set(
        'الإحداثيات المدخلة خارج النطاق الصحيح'
      );

      return;
    }

    this.setCoordsInForm(
      lat,
      lng,
      'تم تطبيق الإحداثيات بنجاح'
    );

    this.marker?.setLatLng([lat, lng]);
    this.map?.setView([lat, lng], 16);

  }

  // ==============================
  // Save
  // ==============================

  onSaveClinic(): void {

    if (this.clinicForm.invalid) {

      this.clinicForm.markAllAsTouched();

      if (this.hasTabError('basic')) {
        this.activeTab='basic';
      } else if (this.hasTabError('owner')) {
        this.activeTab='owner';
      }

      this.showAlert(
        'يرجى التأكد من تعبئة جميع الحقول المطلوبة بشكل صحيح',
        'error'
      );

      return;
    }

    this.isSaving.set(true);
    this.alertMessage.set(null);

    const val = this.clinicForm.getRawValue();

    const command: UpdateMyClinic = {

      arName: val.arName,
      enName: val.enName,

      cityId: Number(val.cityId),

      streetArName: val.streetArName,
      streetEnName: val.streetEnName,

      latitude: String(val.latitude),
      langitude: String(val.langitude),

      arDescription: val.arDescription || null,
      enDescription: val.enDescription || null,

      profileAr: val.profileAr || null,
      profileEn: val.profileEn || null,

      ownerArName: val.ownerArName,
      ownerEnName: val.ownerEnName,
      ownerEmail: val.ownerEmail,

      snapshatUser: val.snapshatUser || null,
      instgramUser: val.instgramUser || null,
      whatsappNumber: val.whatsappNumber || null

    };

    this.clinicService.updateMyClinic(command).subscribe({

      next: (res: any) => {

        this.isSaving.set(false);

        if (res?.isSuccess === false) {

          this.showAlert(
            res?.message || 'تعذر تحديث بيانات العيادة',
            'error'
          );

          return;
        }

        this.showAlert(
          'تم تحديث بيانات العيادة بنجاح',
          'success'
        );

        this.clinicName.set(
          val.arName || val.enName
        );

      },

      error: (err: any) => {

        this.isSaving.set(false);

        const message =
          err?.error?.message ||
          'حدث خطأ أثناء حفظ بيانات العيادة';

        this.showAlert(message, 'error');

      }

    });

  }

  // ==============================
  // Alerts
  // ==============================

  private showAlert(
    message: string,
    type: 'success' | 'error'
  ): void {

    this.alertMessage.set(message);
    this.alertType.set(type);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

  dismissAlert(): void {
    this.alertMessage.set(null);
  }

  resetForm(): void {

    this.loadClinic();
    this.alertMessage.set(null);

  }
onFileSelected(event: Event, controlName: string): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (!allowedTypes.includes(file.type)) {
    this.showAlert('نوع الصورة غير مدعوم', 'error');
    input.value = '';
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    this.showAlert('حجم الصورة يجب ألا يتجاوز 5 ميجابايت', 'error');
    input.value = '';
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const preview = reader.result as string;

    if (controlName === 'LogoImage') {
      this.logoPreview = preview;
      this.imagesForm.patchValue({ DeleteLogoImage: true });
    }

    if (controlName === 'BannerImage') {
      this.bannerPreview = preview;
      this.imagesForm.patchValue({ DeleteBannerImage: true });
    }

    if (controlName === 'InvoiceImage') {
      this.invoicePreview = preview;
      this.imagesForm.patchValue({ DeleteInvoiceLogoImage: true });
    }
  };

  reader.readAsDataURL(file);
  this.imagesForm.get(controlName)?.setValue(file);
}

removeImage(controlName: string): void {
  if (controlName === 'LogoImage') {
    this.logoPreview = null;
    this.imagesForm.patchValue({
      LogoImage: null,
      DeleteLogoImage: true
    });
  }

  if (controlName === 'BannerImage') {
    this.bannerPreview = null;
    this.imagesForm.patchValue({
      BannerImage: null,
      DeleteBannerImage: true
    });
  }

  if (controlName === 'InvoiceImage') {
    this.invoicePreview = null;
    this.imagesForm.patchValue({
      InvoiceImage: null,
      DeleteInvoiceLogoImage: true
    });
  }
}

uploadSelectedImages(): void {
  const clinicId = this.clinicId();

  if (!clinicId) {
    this.showAlert('تعذر تحديد العيادة', 'error');
    return;
  }

  const values = this.imagesForm.value;

  const hasChanges =
    !!values.LogoImage ||
    !!values.BannerImage ||
    !!values.InvoiceImage ||
    values.DeleteLogoImage ||
    values.DeleteBannerImage ||
    values.DeleteInvoiceLogoImage;

  if (!hasChanges) {
    this.showAlert('لم تقم بإجراء أي تعديلات على الصور', 'error');
    return;
  }

  const formData = new FormData();

  formData.append('ClinicId', clinicId.toString());

  if (values.LogoImage)
    formData.append('LogoImage', values.LogoImage);

  if (values.BannerImage)
    formData.append('BannerImage', values.BannerImage);

  if (values.InvoiceImage)
    formData.append('InvoiceImage', values.InvoiceImage);

  formData.append('DeleteLogoImage', String(values.DeleteLogoImage));
  formData.append('DeleteBannerImage', String(values.DeleteBannerImage));
  formData.append('DeleteInvoiceLogoImage', String(values.DeleteInvoiceLogoImage));

  this.isUploadingImages.set(true);

  this.clinicService.UpdateImages(formData).subscribe({
    next: (res) => {
      this.isUploadingImages.set(false);

      if (res?.isSuccess === false) {
        this.showAlert(res.message || 'فشل تحديث الصور', 'error');
        return;
      }

      this.showAlert('تم تحديث صور العيادة بنجاح', 'success');

      this.imagesForm.reset({
        LogoImage: null,
        BannerImage: null,
        InvoiceImage: null,
        DeleteLogoImage: false,
        DeleteBannerImage: false,
        DeleteInvoiceLogoImage: false
      });

      this.loadClinic();
    },

    error: (err) => {
      this.isUploadingImages.set(false);
      this.showAlert(
        err?.error?.message || 'حدث خطأ أثناء حفظ الصور',
        'error'
      );
    }
  });
}
}
