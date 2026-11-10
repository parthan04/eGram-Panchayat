import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GramserviceService } from 'src/app/gramservice.service';

@Component({
  selector: 'app-payment-management',
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.css']
})
export class PaymentManagementComponent implements OnInit {
  
  tax={tax_name:"",description:""}

  my_payments:any[]=[]
  currentPage = 1
  totalRecord = 0;
  pageSize = 7;
  loading = false;
  searchText = '';
  private searchTimer: any;

  editOpen = false;
  editRow: any = null;
  editForm = { status: '', remarks: '' };
  editError = '';
  statuses = ['Pending','Rejected','Completed','Approved'];

  constructor(private s: GramserviceService,private r:Router) {}

  ngOnInit() {
    this.loadMyPayments(1);
  }

  loadMyPayments(page: number): void {
    this.loading = true;

    this.s.getAllPayments(page, this.searchText.trim()).subscribe({
      next: (res: any) => {

        this.my_payments = res.results || [];
        this.totalRecord = res.count || 0;
        this.currentPage = page;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
      }
    });
  }


  onSearch() {
  clearTimeout(this.searchTimer);
  this.searchTimer = setTimeout(() => this.loadMyPayments(1), 400);
}

clearSearch() {
  this.searchText = '';
  this.loadMyPayments(1);
}

  get totalPages(): number{
    return Math.ceil(this.totalRecord / this.pageSize)
  }

  previousPage():void{
    if(this.currentPage>1){
      this.loadMyPayments(this.currentPage - 1)
    }
  }
    
  nextPage():void{
    if(this.currentPage<this.totalPages){
      this.loadMyPayments(this.currentPage+1)
    }
  }

  openEdit(row: any) {
    this.editRow = row;
    this.editForm = { status: row.status, remarks: row.remarks || '' };
    this.editError = '';
    this.editOpen = true;
  }

saveEdit() {
  this.s.updatePaymentStatus(this.editRow.id, this.editForm).subscribe({
    next: (res: any) => {
      this.editRow.status = res.status;  
      this.editRow.remarks = res.remarks;
      this.editOpen = false;
    },
    error: (err) => this.editError = err.error?.detail || 'Could not update'
  });
}

submit(){    
    this.s.create_tax(this.tax).subscribe({
      next: (res: any) => {
        alert('Tax created Successfully');
        this.tax = { tax_name: '', description: ''};
        this.r.navigate(['/view_tax']).then(()=>{
          window.location.reload();
        })
      },
      error: (err:any) => {
        alert('Something went wrong');
        this.tax = { tax_name: '', description: ''};
      }
    });
  }

}
