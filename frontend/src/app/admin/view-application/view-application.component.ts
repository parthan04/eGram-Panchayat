import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GramserviceService } from 'src/app/gramservice.service';

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.css']
})
export class ViewApplicationComponent {

  user:any;
  applications:any=[]
  staffapplication:any=[]
  currentPage = 1
  totalRecord = 0;
  stafftotalRecord = 0;
  pageSize = 7;
  loading = false;
  searchText = '';
  private searchTimer: any;
  private sub?: Subscription;
  isStaff=false;
  isAdmin=false;

  editOpen = false;
  editType = '';
  editRow: any = null;
  editForm = { status: '', remarks: '' };
  editError = '';
  statuses = ['Pending', 'Approved', 'Rejected', 'In Progress', 'Completed'];

    constructor(private s:GramserviceService,private r:Router){}

  ngOnInit(){
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isStaff = this.user.role ==='staff'
    this.isAdmin = this.user.role ==='admin'
    if(this.isAdmin){
      this.loadAllApplication(1)
    }
    if(this.isStaff){
      this.loadServiceStaffApplication(1)
    }
   }

  //  ADMIN

  loadAllApplication(page:number){

    if (page < 1 || this.loading){
      return;
    }
    
    this.sub?.unsubscribe();
    this.loading = true;
    
    this.sub = this.s.getAllApplications(page,this.searchText.trim()).subscribe((res:any)=>{
      this.applications=res.results;
      this.currentPage = page
      this.totalRecord = res.count
      this.loading =false;
    })
  }

  onSearch() {
  clearTimeout(this.searchTimer);
  this.searchTimer = setTimeout(() => this.loadAllApplication(1), 400);
}

clearSearch() {
  this.searchText = '';
  this.loadAllApplication(1);
}

  get totalPages(): number{
    return Math.ceil(this.totalRecord / this.pageSize)
  }

  previousPage():void{
    if(this.currentPage>1){
      this.loadAllApplication(this.currentPage - 1)
    }
  }
    
  nextPage():void{
    if(this.currentPage<this.totalPages){
      this.loadAllApplication(this.currentPage+1)
    }
  }

  // STAFF

  loadServiceStaffApplication(page:number){

    if (page < 1 || this.loading){
      return;
    }
    
    this.sub?.unsubscribe();
    this.loading = true;
    
    this.sub = this.s.getServiceStaffApplications(page,this.searchText.trim()).subscribe((res:any)=>{
      console.log('res',res.result)
      this.staffapplication=res.results;
      console.log('data',this.staffapplication)
      this.currentPage = page
      this.stafftotalRecord = res.count
      this.loading =false;
    })
  }

  onStaffSearch() {
  clearTimeout(this.searchTimer);
  this.searchTimer = setTimeout(() => this.loadServiceStaffApplication(1), 400);
}

clearStaffSearch() {
  this.searchText = '';
  this.loadServiceStaffApplication(1);
}

  get StafftotalPages(): number{
    return Math.ceil(this.stafftotalRecord / this.pageSize)
  }

  StaffpreviousPage():void{
    if(this.currentPage>1){
      this.loadServiceStaffApplication(this.currentPage - 1)
    }
  }
    
  StaffnextPage():void{
    if(this.currentPage<this.stafftotalRecord){
      this.loadServiceStaffApplication(this.currentPage+1)
    }
  }

  openEdit(row: any) {
    this.editRow = row;
    this.editForm = { status: row.status, remarks: row.remarks || '' };
    this.editError = '';
    this.editOpen = true;
  }

saveEdit() {
  this.s.updateApplicationStatus(this.editRow.id, this.editForm).subscribe({
    next: (res: any) => {
      this.editRow.status = res.status;  
      this.editRow.remarks = res.remarks;
      this.editOpen = false;
      this.r.navigate(['/view_application']).then(()=>{
          window.location.reload();
        })
    },
    error: (err) => this.editError = err.error?.detail || 'Could not update'
  });
}

}
