import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgDataTableComponent } from '@bhplugin/ng-datatable';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { IGetGeneric } from 'src/app/Common/Models/IGenericGet';
import { Language, TextLangValidator } from 'src/app/Common/Validators/TextValidator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { Utilities } from 'src/app/Common/Utilities/Utiliities';
import { CurrentUserService } from 'src/app/Common/Services/current-user.service';
import { SystemFacadeService } from 'src/app/Common/Services/system-facade.service';
import { CountryService } from './services/country.service';
import { ICountry } from './Models/ICountry.model';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrl: './country.component.css'
})
export class CountryComponent {
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
  countryForm: any;
  @ViewChild('DeleteModal') DeleteModal: any;
  selectedIdToDelete: number | null = null;
  label = new Utilities(this.translate);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private storeData: Store<any>,
    private countryServ: CountryService,
    private currentUserService: CurrentUserService,
    protected sfc: SystemFacadeService
  ) {
    if (this.translate.currentLang == 'ae') {
      this.cols = [
        { field: 'ID', title: 'الرقم', sort: true },
        { field: 'ArName', title: 'الاسم بالعربية', sort: true },
        { field: 'EnName', title: 'الاسم بالإنجليزية', sort: true },
        { field: 'ISOCode', title: 'رمز الدولة', sort: true },
        { field: 'Actions', title: 'الإجراءات', sort: false }
      ];
    } else {
      this.cols = [
        { field: 'ID', title: 'ID', sort: true },
        { field: 'ArName', title: 'Arabic Name', sort: true },
        { field: 'EnName', title: 'English Name', sort: true },
        { field: 'ISOCode', title: 'ISO Code', sort: true },
        { field: 'Actions', title: 'Actions', sort: false }
      ];
    }

    const data: IGetGeneric = {
      Page: 1,
      PageSize: this.size,
      SearchTerm: null,
      SortBy: null,
      SortOrder: null,
    };

    this.LoadData(data);

    // بناء الفورم مع إضافة حقل ISOCode
    this.countryForm = new FormGroup({
      ArName: new FormControl('', [Validators.required, TextLangValidator(Language.Arabic), Validators.maxLength(200)]),
      EnName: new FormControl('', [Validators.required, TextLangValidator(Language.English), Validators.maxLength(200)]),
      ISOCode: new FormControl('', [Validators.required, Validators.maxLength(5)])
    });
  }

  ResetValidation() {
    this.countryForm.reset();
    this.state = "Create";
  }

  onPageChange(pagenum: number): void {
    const data: IGetGeneric = {
      Page: pagenum,
      PageSize: this.size,
      SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',
    };
    this.pageNumber = pagenum;
    this.LoadData(data);
  }

  onSearch(): void {
    const data: IGetGeneric = {
      Page: 1,
      PageSize: this.size,
      SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',
    };
    this.datatable.currentPage = 1;
    this.LoadData(data);
  }

  onSort(column: string): void {
    this.column = column;
    this.sortColumn = column;
    const data: IGetGeneric = {
      Page: 1,
      PageSize: this.size,
      SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',
    };
    this.datatable.currentPage = 1;
    this.LoadData(data);
  }

  getdata(size: string) {
    this.size = parseInt(size);
    const data: IGetGeneric = {
      Page: this.pageNumber * this.size > this.totalCount ? 1 : this.pageNumber,
      PageSize: parseInt(size),
      SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',
    };
    this.LoadData(data);
  }

  LoadData(data: IGetGeneric) {
    this.countryServ.getAll(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result.isSuccess) {
        this.rows = result.data.items;
        this.totalCount = result.data.totalCount;
      }
    });
  }

  Update(id: number) {
    this.countryServ.GetByID(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      const value = result.data as unknown as any;
      sessionStorage.setItem("UpdatedCountryID", id.toString());
      this.countryForm.get("ArName")?.setValue(value.arName);
      this.countryForm.get("EnName")?.setValue(value.enName);
      this.countryForm.get("ISOCode")?.setValue(value.isoCode);
    });

    this.state = "Update";
    this.CrudModal.open();
  }

  UpdateRecord() {
    const data: ICountry = {
      id: parseInt(sessionStorage.getItem("UpdatedCountryID")!),
      arName: this.countryForm.get("ArName")?.value,
      enName: this.countryForm.get("EnName")?.value,
      isoCode: this.countryForm.get("ISOCode")?.value,
    };

    this.countryServ.Update(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
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
        const RefreshData: IGetGeneric = {
          Page: this.pageNumber,
          PageSize: this.size,
          SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
          SortBy: this.sortColumn,
          SortOrder: this.ascending ? 'asc' : 'desc',
        };
        setTimeout(() => { this.LoadData(RefreshData); }, 500);
      }
    });
  }

  Add() {
    const data: ICountry = {
      id: null,
      arName: this.countryForm.get("ArName")?.value,
      enName: this.countryForm.get("EnName")?.value,
      isoCode: this.countryForm.get("ISOCode")?.value,
    };

    this.countryServ.Add(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
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
        const RefreshData: IGetGeneric = {
          Page: this.pageNumber,
          PageSize: this.size,
          SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
          SortBy: this.sortColumn,
          SortOrder: this.ascending ? 'asc' : 'desc',
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
    this.countryServ.Delete(this.selectedIdToDelete!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
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
      
      const data: IGetGeneric = {
        Page: this.pageNumber,
        PageSize: this.size,
        SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
        SortBy: this.sortColumn,
        SortOrder: this.ascending ? 'asc' : 'desc',
      };
      this.LoadData(data);
      this.datatable.currentPage = this.pageNumber;
    });
  }
}