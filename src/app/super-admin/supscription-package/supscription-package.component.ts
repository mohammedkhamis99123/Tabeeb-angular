import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgDataTableComponent } from '@bhplugin/ng-datatable';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { IGetGeneric } from 'src/app/Common/Models/IGenericGet';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { Utilities } from 'src/app/Common/Utilities/Utiliities';
import { CurrentUserService } from 'src/app/Common/Services/current-user.service';
import { SystemFacadeService } from 'src/app/Common/Services/system-facade.service';
import { SupscriptionPackageService } from './services/supscription-package.service';

@Component({
  selector: 'app-subscription-package',
  templateUrl: './supscription-package.component.html',
  styleUrl: './supscription-package.component.css'
})
export class SubscriptionPackageComponent {
  private destroyRef = inject(DestroyRef);
  @ViewChild("datatable") datatable!: NgDataTableComponent;
  cols: { field: string; title: string; sort: boolean; }[];
  rows: any[] = [];
  SearchTerm!: string;
  selectedStatus: boolean | null = null; // فلتر الحالة
  sortColumn: string = "ID";
  ascending: boolean = true;
  pageNumber: number = 1;
  totalCount = 0;
  size = 10;
  column = "";
  state: string = "";
  @ViewChild("CrudModal") CrudModal !: NgxCustomModalComponent;
  packageForm: any;
  @ViewChild('DeleteModal') DeleteModal: any;
  selectedIdToDelete: number | null = null;
  label = new Utilities(this.translate);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private storeData: Store<any>,
    private packageServ: SupscriptionPackageService,
    private currentUserService: CurrentUserService,
    protected sfc: SystemFacadeService
  ) {
    if (this.translate.currentLang == 'ae') {
      this.cols = [
        { field: 'ID', title: 'الرقم', sort: true },
        { field: 'ArName', title: 'اسم الباقة', sort: true },
        { field: 'EnName', title: 'Package Name', sort: true },
        { field: 'Price', title: 'السعر', sort: true },
        { field: 'DurationInDays', title: 'المدة (بالأيام)', sort: true },
        { field: 'isActive', title: 'الحالة', sort: true },
        { field: 'Actions', title: 'الإجراءات', sort: false }
      ];
    } else {
      this.cols = [
        { field: 'ID', title: 'ID', sort: true },
        { field: 'ArName', title: 'Arabic Name', sort: true },
        { field: 'EnName', title: 'English Name', sort: true },
        { field: 'Price', title: 'Price', sort: true },
        { field: 'DurationInDays', title: 'Duration (Days)', sort: true },
        { field: 'isActive', title: 'Status', sort: true },
        { field: 'Actions', title: 'Actions', sort: false }
      ];
    }

    const data: any = {
      Page: 1,
      PageSize: this.size,
      SearchTerm: null,
      isActive: null,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ?"asc" :"desc",
    };

    this.LoadData(data);

    // بناء الفورم بالخصائص المطلوبة للباقات
    this.packageForm = new FormGroup({
      ArName: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      EnName: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      ArDescription: new FormControl('',[Validators.maxLength(500)]),
      EnDescription: new FormControl('',[Validators.maxLength(500)]),
      Price: new FormControl(1, [
        Validators.required, 
        Validators.min(1),
        Validators.max(1000000),
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]),
      
      // الأيام: مطلوب، رقم صحيح فقط (Integer)، وأكبر من 0
      DurationInDays: new FormControl(30, [
        Validators.required, 
        Validators.min(1),
        Validators.pattern(/^[0-9]+$/) // يمنع الكسور والعلامات العشرية تماماً
      ]),
      isActive: new FormControl(true)
    });
  }

  ResetValidation() {
    this.packageForm.reset({ isActive: true, Price: 0, DurationInDays: 30 });
    this.state = "Create";
  }

  onPageChange(pagenum: number): void {
    this.pageNumber = pagenum;
    this.LoadData({ Page: pagenum, PageSize: this.size, SearchTerm: this.SearchTerm || null, isActive: this.selectedStatus, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' });
  }

  onSearch(): void {
    this.pageNumber = 1;
    if (this.datatable) this.datatable.currentPage = 1;
    this.LoadData({ Page: 1, PageSize: this.size, SearchTerm: this.SearchTerm || null, isActive: this.selectedStatus, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' });
  }

  onFilterChange(): void {
    this.pageNumber = 1;
    if (this.datatable) this.datatable.currentPage = 1;
    this.LoadData({ Page: 1, PageSize: this.size, SearchTerm: this.SearchTerm || null, isActive: this.selectedStatus, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' });
  }

  resetFilters() {
    this.SearchTerm = '';
    this.selectedStatus = null;
    this.pageNumber = 1;
    if (this.datatable) this.datatable.currentPage = 1;
    this.LoadData({ Page: 1, PageSize: this.size, SearchTerm: null, isActive: null, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' });
  }

  onSort(column: string): void {
    this.sortColumn = column;
    this.LoadData({ Page: 1, PageSize: this.size, SearchTerm: this.SearchTerm || null, isActive: this.selectedStatus, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' });
  }

  getdata(size: string) {
    this.size = parseInt(size);
    this.LoadData({ Page: 1, PageSize: this.size, SearchTerm: this.SearchTerm || null, isActive: this.selectedStatus, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' });
  }

  LoadData(data: any) {
    this.packageServ.getAll(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result.isSuccess) {
        this.rows = result.data.items;
        this.totalCount = result.data.totalCount;
      }
    });
  }

  Update(id: number) {
    this.packageServ.GetByID(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      const value = result.data as any;
      sessionStorage.setItem("UpdatedPackageID", id.toString());
      this.packageForm.patchValue({
        ArName: value.arName,
        EnName: value.enName,
        ArDescription: value.arDescription,
        EnDescription: value.enDescription,
        Price: value.price,
        DurationInDays: value.durationInDays,
        isActive: value.isActive
      });
    });

    this.state = "Update";
    this.CrudModal.open();
  }

  UpdateRecord() {
    const data = {
      id: parseInt(sessionStorage.getItem("UpdatedPackageID")!),
      ...this.packageForm.value
    };

    this.packageServ.Update(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result.isSuccess) {
        this.showToast(this.translate.currentLang == "ae" ? "تم التعديل بنجاح" : "Updated Successfully");
        this.CrudModal.close();
        this.LoadData({ Page: this.pageNumber, PageSize: this.size, SearchTerm: this.SearchTerm || null, isActive: this.selectedStatus, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' });
      }
    });
  }

  Add() {
    const data = {
      id: null,
      ...this.packageForm.value
    };

    this.packageServ.Add(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result.isSuccess) {
        this.showToast(this.translate.currentLang == "ae" ? "تم الإضافة بنجاح" : "Added Successfully");
        this.CrudModal.close();
        this.LoadData({ Page: this.pageNumber, PageSize: this.size, SearchTerm: this.SearchTerm || null, isActive: this.selectedStatus, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' });
      }
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
    this.packageServ.Delete(this.selectedIdToDelete!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result.isSuccess) {
        this.showToast(this.translate.currentLang == "ae" ? "تم الحذف بنجاح" : "Deleted Successfully");
        this.DeleteModal.close();
      }

      if ((this.totalCount % this.size == 1) && this.totalCount > this.size && this.pageNumber == Math.ceil(this.totalCount / this.size)) {
        this.pageNumber = this.pageNumber - 1;
      }
      
      this.LoadData({ Page: this.pageNumber, PageSize: this.size, SearchTerm: this.SearchTerm || null, isActive: this.selectedStatus, SortBy: this.sortColumn, SortOrder: this.ascending ? 'asc' : 'desc' });
      if (this.datatable) this.datatable.currentPage = this.pageNumber;
    });
  }
}