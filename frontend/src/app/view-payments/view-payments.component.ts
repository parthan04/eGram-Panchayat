import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GramserviceService } from '../gramservice.service';

@Component({
  selector: 'app-view-payments',
  templateUrl: './view-payments.component.html',
  styleUrls: ['./view-payments.component.css']
})
export class ViewPaymentsComponent implements OnInit {
  my_payments:any[]=[]
  currentPage = 1
  totalRecord = 0;
  pageSize = 7;
  loading = false;
  searchText = '';
  private searchTimer: any;

  showPopup = false;
  popupType: 'Completed' | 'Failed' = 'Completed';
  popupPayment: any = null;

  constructor(
    private s: GramserviceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const txn = this.route.snapshot.queryParamMap.get('txn');

    this.s.myPayment().subscribe((res: any) => {
      this.my_payments = res.result;

      if (txn) {
        const p = this.my_payments.find(x => x.gateway_order_id === txn);
        if (p && p.status !== 'Pending') {
          this.popupPayment = p;
          this.popupType = p.status === 'Paid' ? 'Completed' : 'Failed';
          this.showPopup = true;
        }
      }
    });

    this.loadMyPayments(1);
  }

  closePopup() {
    this.showPopup = false;
    this.router.navigate(['/my-payments'], { replaceUrl: true });
  }

  tryAgain() {
    this.showPopup = false;
    this.router.navigate(['/payment', this.popupPayment.tax]);
  }

  
  loadMyPayments(page: number): void {
    this.loading = true;

    this.s.myPayments(page, this.searchText.trim()).subscribe({
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

}
