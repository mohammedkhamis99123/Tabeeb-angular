import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgDataTableComponent } from '@bhplugin/ng-datatable';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { Language, TextLangValidator } from 'src/app/Common/Validators/TextValidator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { Utilities } from 'src/app/Common/Utilities/Utiliities';
import { CurrentUserService } from 'src/app/Common/Services/current-user.service';
import { SystemFacadeService } from 'src/app/Common/Services/system-facade.service';
import { CityService } from './services/city.service';
import { CountryService } from '../country/services/country.service';
import { IGetCity } from './models/IGetCity.model';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrl: './city.component.css'
})
export class CityComponent {
  private destroyRef = inject(DestroyRef);
  @ViewChild("datatable") datatable!: NgDataTableComponent;
  cols: { field: string; title: string; sort: boolean; }[];
  rows: any[] = [];
  SearchTerm!: string;
  sortColumn: string = "ID";
  ascending: boolean = true;
  pageNumber: number = 1;
  totalCount = 0;
  size = 10;
  column = "";
  state: string = "";
  @ViewChild("CrudModal") CrudModal !: NgxCustomModalComponent;
  cityForm: any;
  @ViewChild('DeleteModal') DeleteModal: any;
  selectedIdToDelete: number | null = null;
  label = new Utilities(this.translate);
  selectedCountryId: number | null = null;
  selectedStatus: boolean | null = null;
  countriesList: any[] = []; // قائمة الدول الخاصة بالـ Dropdown

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private storeData: Store<any>,
    private cityServ: CityService,
    private countryServ: CountryService,
    private currentUserService: CurrentUserService,
    protected sfc: SystemFacadeService
  ) {
    if (this.translate.currentLang == 'ae') {
      this.cols = [
        { field: 'ID', title: 'الرقم', sort: true },
        { field: 'ArName', title: 'الاسم بالعربية', sort: true },
        { field: 'EnName', title: 'الاسم بالإنجليزية', sort: true },
        { field: 'CountryName', title: 'الدولة', sort: false },
        { field: 'IsActive', title: 'الحالة', sort: true },
        { field: 'Actions', title: 'الإجراءات', sort: false }
      ];
    } else {
      this.cols = [
        { field: 'ID', title: 'ID', sort: true },
        { field: 'ArName', title: 'Arabic Name', sort: true },
        { field: 'EnName', title: 'English Name', sort: true },
        { field: 'CountryName', title: 'Country', sort: false },
        { field: 'IsActive', title: 'Status', sort: true },
        { field: 'Actions', title: 'Actions', sort: false }
      ];
    }

    const data: IGetCity = {
      Page: 1,
      PageSize: this.size,
      SearchTerm: null,
      SortBy: null,
      SortOrder: null,
      countryId:null,
      isActive:null
    };

    this.LoadData(data);
    this.LoadCountries(); // جلب قائمة الدول للـ Dropdown

    // بناء الفورم مع الحقول الجديدة (CountryId و IsActive)
    this.cityForm = new FormGroup({
      ArName: new FormControl('', [Validators.required, TextLangValidator(Language.Arabic), Validators.maxLength(200)]),
      EnName: new FormControl('', [Validators.required, TextLangValidator(Language.English), Validators.maxLength(200)]),
      CountryId: new FormControl(null, [Validators.required]),
      IsActive: new FormControl(true) // القيمة الافتراضية مفعل
    });
  }

  // جلب قائمة الدول من السيرفر
  LoadCountries() {
    this.countryServ.Dropdown()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        if (res.isSuccess) {
          res.data.map((e:any)=>{
          this.countriesList.push({id:e.id,name:this.translate.currentLang=='ar' ? e.arName :e.enName});

          })
        }
      });
  }

  ResetValidation() {
    this.cityForm.reset({ IsActive: true }); // إعادة الضبط مع جعل الحالة الافتراضية Active = true
    this.state = "Create";
  }

  onPageChange(pagenum: number): void {
    const data: IGetCity = {
      Page: pagenum,
      PageSize: this.size,
      SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',
      countryId:this.selectedCountryId,
      isActive:this.selectedStatus
    };
    this.pageNumber = pagenum;
    this.LoadData(data);
  }

  onSearch(): void {
    const data: IGetCity = {
      Page: 1,
      PageSize: this.size,
      SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',
       countryId:this.selectedCountryId,
      isActive:this.selectedStatus
    };
    this.datatable.currentPage = 1;
    this.LoadData(data);
  }

  onSort(column: string): void {
    this.column = column;
    this.sortColumn = column;
    const data: IGetCity = {
      Page: 1,
      PageSize: this.size,
      SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',
       countryId:this.selectedCountryId,
      isActive:this.selectedStatus
    };
    this.datatable.currentPage = 1;
    this.LoadData(data);
  }

  getdata(size: string) {
    this.size = parseInt(size);
    const data: IGetCity = {
      Page: this.pageNumber * this.size > this.totalCount ? 1 : this.pageNumber,
      PageSize: parseInt(size),
      countryId:this.selectedCountryId,
      isActive:this.selectedStatus,
      SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',
    };
    this.LoadData(data);
  }

  LoadData(data: IGetCity) {
    this.cityServ.getAll(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result.isSuccess) {
        this.rows = result.data.items;
        this.totalCount = result.data.totalCount;
      }
    });
  }

  Update(id: number) {
    this.cityServ.GetByID(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      const value = result.data as unknown as any;
      sessionStorage.setItem("UpdatedCityID", id.toString());
      this.cityForm.get("ArName")?.setValue(value.arName);
      this.cityForm.get("EnName")?.setValue(value.enName);
      this.cityForm.get("CountryId")?.setValue(value.countryId);
      this.cityForm.get("IsActive")?.setValue(value.isActive);
    });

    this.state = "Update";
    this.CrudModal.open();
  }

  UpdateRecord() {
    const data = {
      id: parseInt(sessionStorage.getItem("UpdatedCityID")!),
      arName: this.cityForm.get("ArName")?.value,
      enName: this.cityForm.get("EnName")?.value,
      countryId: parseInt(this.cityForm.get("CountryId")?.value),
      isActive: this.cityForm.get("IsActive")?.value,
    };

    this.cityServ.Update(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result.isSuccess) {
        const toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          showCloseButton: true,
          customClass: { popup: `color-success` },
        });

        toast.fire({
          title: this.translate.currentLang == "ae" ? "تم التعديل بنجاح" : "Updated Successfully",
        });
        this.CrudModal.close();
        this.cityForm.reset();

        const RefreshData: IGetCity = {
          Page: this.pageNumber,
          PageSize: this.size,
          SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
          SortBy: this.sortColumn,
          SortOrder: this.ascending ? 'asc' : 'desc',
          countryId:this.selectedCountryId,
          isActive:this.selectedStatus
        };
        setTimeout(() => { this.LoadData(RefreshData); }, 500);
      }
    });
  }

  Add() {
    const data = {
      id: null,
      arName: this.cityForm.get("ArName")?.value,
      enName: this.cityForm.get("EnName")?.value,
      countryId: parseInt(this.cityForm.get("CountryId")?.value),
      isActive: this.cityForm.get("IsActive")?.value,
    };

    this.cityServ.Add(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result.isSuccess) {
        const toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          showCloseButton: true,
          customClass: { popup: `color-success` },
        });

        toast.fire({
          title: this.translate.currentLang == "ae" ? "تم الاضافة بنجاح" : "Added Successfully",
        });
        this.CrudModal.close();
        this.cityForm.reset();
        const RefreshData: IGetCity = {
          Page: this.pageNumber,
          PageSize: this.size,
          SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
          SortBy: this.sortColumn,
          SortOrder: this.ascending ? 'asc' : 'desc',
           countryId:this.selectedCountryId,
           isActive:this.selectedStatus
        };
        setTimeout(() => { this.LoadData(RefreshData); }, 500);
      }
    });
  }

  onchange(event: any) {
    if (event.change_type == 'sort') {
      event.sort_direction == 'asc' ? this.ascending = true : this.ascending = false;
      this.onSort(event.sort_column);
    } else if (event.change_type == 'page') {
      this.pageNumber = event.current_page;
      this.onPageChange(this.pageNumber);
    } else if (event.change_type == "pagesize") {
      this.size = event.pagesize;
      this.getdata(this.size.toString());
    }
  }

  hasAnyPermissionOf(permissions: number[]): boolean {
    return this.currentUserService.hasAnyPermissionOf(permissions);
  }

  trackByFn(index: number, item: any) { return item?.id ?? item?.ID ?? index; }

  HandleRequest() {
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
    this.cityServ.Delete(this.selectedIdToDelete!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result.isSuccess) {
        const toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          showCloseButton: true,
          customClass: { popup: `color-success` },
        });

        toast.fire({
          title: this.translate.currentLang == "ae" ? "تم الحذف بنجاح" : "Deleted Successfully",
        });
        this.DeleteModal.close();
      }

      if ((this.totalCount % this.size == 1) && this.totalCount > this.size && this.pageNumber == Math.ceil(this.totalCount / this.size)) {
        this.pageNumber = this.pageNumber - 1;
      }
      
      const data: IGetCity = {
        Page: this.pageNumber,
        PageSize: this.size,
        SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
        SortBy: this.sortColumn,
        SortOrder: this.ascending ? 'asc' : 'desc',
         countryId:this.selectedCountryId,
      isActive:this.selectedStatus
      };
      this.LoadData(data);
      this.datatable.currentPage = this.pageNumber;
    });
  }

  // دالة تُستدعاة فور تغيير أي فلتر (دولة أو حالة)
  onFilterChange(): void {
    this.pageNumber = 1;
    if (this.datatable) {
      this.datatable.currentPage = 1;
    }
    
    // بناء كائن الطلب مع إرسال فلاتر الدولة والحالة
    const data: IGetCity = {
      Page: 1,
      PageSize: this.size,
      SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
      countryId: this.selectedCountryId, // تأكد من مطابقة اسم الخاصية مع الـ Backend DTO لو مدعومة
      isActive: this.selectedStatus,     // تأكد من مطابقة اسم الخاصية مع الـ Backend DTO لو مدعومة
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',
    };

    this.LoadData(data);
  }
  // دالة إعادة ضبط الفلاتر
  resetFilters() {
    this.SearchTerm = '';
    this.selectedCountryId = null;
    this.selectedStatus = null;
    this.pageNumber = 1;
    
    if (this.datatable) {
      this.datatable.currentPage = 1;
    }

    const data: IGetCity = {
      Page: 1,
      PageSize: this.size,
      SearchTerm: null,
      countryId: null,
      isActive: null,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',
    };

    this.LoadData(data);
  }
}