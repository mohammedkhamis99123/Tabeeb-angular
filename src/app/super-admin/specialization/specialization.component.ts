import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgDataTableComponent } from '@bhplugin/ng-datatable';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { IGetGeneric } from 'src/app/Common/Models/IGenericGet';
import { IGenericResponse } from 'src/app/Common/Models/IGenericReponse';
import { Language, TextLangValidator } from 'src/app/Common/Validators/TextValidator';
import { SpecializationService } from './Services/specialization.service';
import { ISpecialization } from './Models/ISpecialization';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { Utilities } from 'src/app/Common/Utilities/Utiliities';
import { CurrentUserService } from 'src/app/Common/Services/current-user.service';
import { Permission } from 'src/app/Common/enums/Permission.enum';
import { SystemFacadeService } from 'src/app/Common/Services/system-facade.service';
@Component({
  selector: 'app-specialization',
  templateUrl: './specialization.component.html',
  styleUrl: './specialization.component.css'
})
export class SpecializationComponent {
  private destroyRef = inject(DestroyRef);
  @ViewChild("datatable") datatable!: NgDataTableComponent
  cols: { field: string; title: string; sort: boolean; }[]; //Cols of data grid
  currentIndex: number = 10;
  rows: any[] = [];
  page!: string;
  store: any;
  SearchTerm!: string;
  sortColumn: string = "ID";
  ascending: boolean = true;
  pageNumber: number = 1
  DataGrid!: [{ id: number, arName: string, EnName: string, parentID: number }];
  hasnext: boolean = false;
  hasPrev: boolean = false;
  totalCount = 0;
  size = 10;
  column = "";
  totalpages: number[] = [];
  sortDirection: 'asc' | 'desc' | null = null;
  parent!: string
  selectedItem!: string
  state:string="";
  @ViewChild("CrudModal") CrudModal !: NgxCustomModalComponent
  specializationForm: any;
  @ViewChild('DeleteModal') DeleteModal: any;
  selectedIdToDelete: number | null = null;
  label=new Utilities(this.translate);
  constructor(private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private storeData: Store<any>,
    private specializationServ:SpecializationService,
    private currentUserService:CurrentUserService,
    protected sfc:SystemFacadeService
    ) {

    
    if (this.translate.currentLang == 'ae') {
      this.cols = [
        { field: 'ID', title: 'الرقم ', sort: true },
        { field: 'ArName', title: 'الاسم باللغة العربية', sort: true },
        { field: 'EnName', title: 'الاسم باللغة الانجليزية', sort: true },
        { field: 'Actions', title: 'الاجراءات', sort: false }


      ];
     
    } else {
      this.cols = [
        { field: 'ID', title: 'ID ', sort: true },
        { field: 'ArName', title: 'Arabic Name', sort: true },
        { field: 'EnName', title: 'English Name', sort: true },
        { field: 'Actions', title: 'Actions', sort: false }



      ];

    
    }






    const data: IGetGeneric = {
      Page: 1,
      PageSize: this.size,

      SearchTerm: null,
      SortBy: null,
      SortOrder: null,

    }


    this.LoadData(data);

    ///////////////////////////////////////////////Create Form/////////////////////////
    this.specializationForm = new FormGroup({
      ArName: new FormControl('', [Validators.required,TextLangValidator(Language.Arabic), Validators.maxLength(150)]),
      EnName: new FormControl('', [Validators.required, TextLangValidator(Language.English), Validators.maxLength(150)]),
    
    });

    ///////////////////////////////Update Form///////////////////////////////////
 


  }


  ////////////////////////////////////////Function To reset validation For cretae popup///////////////////////////


  ResetValidation() {
    this.specializationForm.reset();
    this.state="Create"

  }


  ///////////////////////////////function called even page is changed/////////////////////////////////////

  onPageChange(pagenum: number): void {
    const data: IGetGeneric = {
      Page: pagenum,
      PageSize: this.size,
      SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',

    }
    this.pageNumber = pagenum
    this.LoadData(data);
  }
  ////////////////////////////////////Function to filter by SearchTerm input//////////////////////////////////////////

  onSearch(): void {

    const data: IGetGeneric = {
      Page: 1,
      PageSize: this.size,
      SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',

    }


    this.datatable.currentPage = 1
    this.LoadData(data);

  }
  //////////////////////////////////////////////////Function on sort by Column/////////////////////////////////

  onSort(column: string): void {


    this.column = column;

    this.sortColumn = column;
    const data: IGetGeneric = {
      //Page:this.pageNumber,
      Page: 1,
      PageSize: this.size,
      SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',

    }

    this.datatable.currentPage = 1
    this.LoadData(data);
  }

  ////////////////////////////////////Function called on page size change/////////////////////////////////////


  getdata(size: string) {
    this.size = parseInt(size);
    const data: IGetGeneric = {
      Page: this.pageNumber * this.size > this.totalCount ? 1 : this.pageNumber,
      PageSize: parseInt(size),
      SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
      SortBy: this.sortColumn,
      SortOrder: this.ascending ? 'asc' : 'desc',

    }


    this.LoadData(data);
  }

  //////////////////////////////////////////////Function that get data for grid and help in paging////////////////////////

  LoadData(data: IGetGeneric) {

    this.specializationServ.getAll(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {

      if (result.isSuccess) {

          this.rows = result.data.items;
          this.hasPrev = result.data.hasPreviousPage,
          this.hasnext = result.data.hasNextPage
          this.totalCount = result.data.totalCount

      }
   
    }

    )
  }
 
 

  ////////////////////////////////////////////////////////To show data in update Record popup//////////////////////////////

  Update(id: number) {

  

    this.specializationServ.GetByID(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      const value = result.data as unknown as any
      sessionStorage.setItem("UpdatedID", id.toString())
      this.specializationForm.get("ArName")?.setValue(value.arName);
      this.specializationForm.get("EnName")?.setValue(value.enName);

    })

    this.state="Update";
    this.CrudModal.open()



  }
  ////////////////////////////////////////////////////////To  update Record //////////////////////////////

  UpdateRecord() {



    const data: ISpecialization = {
      id: parseInt(sessionStorage.getItem("UpdatedID")!),
      arName: this.specializationForm.get("ArName")?.value,
      enName: this.specializationForm.get("EnName")?.value,
    }


  
   

    this.specializationServ.Update(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {

      if (result.isSuccess) {
        const toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          showCloseButton: true,
          customClass: {
            popup: `color-success`
          },

        });

        toast.fire({
          title: this.translate.currentLang == "ae" ? "تم التعديل بنجاح" : "Updated Successfully",
        });
        this.CrudModal.close()
        const RefreshData: IGetGeneric = {
          Page: this.pageNumber,
          PageSize: this.size,
          SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
          SortBy: this.sortColumn,
          SortOrder: this.ascending ? 'asc' : 'desc',

        }
        setTimeout(() => {
          this.LoadData(RefreshData)
        }, 500)
      }

    })




  }



  ///////////////////////////////////To add Record///////////////////////////////////////


  Add() {
    const data: ISpecialization = {

      id: null,
      arName: this.specializationForm.get("ArName")?.value,
      enName: this.specializationForm.get("EnName")?.value,
    }



    this.specializationServ.Add(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (result) => {
        if (result.isSuccess) {


          const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
            customClass: {
              popup: `color-success`
            },

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

          }
          setTimeout(() => {
            this.LoadData(RefreshData)
          }, 500)
        }

      })






  }


  /////////////////////////////////////////////////////this function is called on each event on data grid/////////////////////////


  onchange(event: any) {


    if (event.change_type == 'sort') {


      event.sort_direction == 'asc' ? this.ascending = true : this.ascending = false;
      this.onSort(event.sort_column);
    }
    else if (event.change_type == 'page') {
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

HandleRequest(){
  if(this.state=="Update"){
    this.UpdateRecord();
  }else{
    this.Add()
  }
}


// لما المستخدم يضغط على زرار الحذف من الجدول
Delete(id: number) {
    this.selectedIdToDelete = id;
    this.DeleteModal.open();
}

// لما يؤكد الحذف جوه المودال
 DeleteRecord() {
    this.specializationServ.Delete(this.selectedIdToDelete!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {

      if (result.isSuccess) {
        const toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          showCloseButton: true,
          customClass: {
            popup: `color-success`
          },

        });

        toast.fire({
          title: this.translate.currentLang == "ae" ? "تم الحذف بنجاح" : "Deleted Successfully",

        });
        this.CrudModal.close()
      }
      if ((this.totalCount % this.size == 1) && this.totalCount > this.size && this.pageNumber == Math.ceil(this.totalCount / this.size)) {
        const data: IGetGeneric = {
          Page: this.pageNumber - 1,
          PageSize: this.size,
          SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
          SortBy: this.sortColumn,
          SortOrder: this.ascending ? 'asc' : 'desc',

        }
        this.pageNumber = this.pageNumber - 1


        this.LoadData(data);
      } else if ((this.totalCount % this.size > 1) && this.pageNumber == Math.ceil(this.totalCount / this.size)) {
        const data: IGetGeneric = {
          Page: this.pageNumber,
          PageSize: this.size,
          SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
          SortBy: this.sortColumn,
          SortOrder: this.ascending ? 'asc' : 'desc',

        }

        this.LoadData(data);
      } else {
        const data: IGetGeneric = {
          Page: this.pageNumber,
          PageSize: this.size,
          SearchTerm: this.SearchTerm == "" ? null : this.SearchTerm,
          SortBy: this.sortColumn,
          SortOrder: this.ascending ? 'asc' : 'desc',

        }

        this.LoadData(data);



      }
      this.datatable.currentPage = this.pageNumber

    })

  }
}






