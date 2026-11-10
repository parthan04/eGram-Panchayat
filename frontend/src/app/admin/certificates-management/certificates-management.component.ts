import { Component,OnDestroy,OnInit } from '@angular/core';
import { GramserviceService } from 'src/app/gramservice.service';


@Component({
  selector: 'app-certificates-management',
  templateUrl: './certificates-management.component.html',
  styleUrls: ['./certificates-management.component.css']
})
export class CertificatesManagementComponent {
  birthC:any=[]
  deathC:any=[]
  marriageC:any=[]
  incomeC:any=[]
  casteC:any=[]

  currentPage = 1
  birthTotalRecord = 0;
  deathTotalRecord = 0;
  marriageTotalRecord = 0;
  incomeTotalRecord = 0;
  casteTotalRecord = 0;
  pageSize = 7;
  loading = false;
  searchText = '';
  private searchTimer: any;

  editOpen = false;
  editType = '';
  editRow: any = null;
  editForm = { status: '', remarks: '' };
  editError = '';
  statuses = ['Pending', 'Accepted', 'Rejected', 'In Progress', 'Completed'];

  constructor(private s:GramserviceService){}

  ngOnInit(): void {
    this.loadAllCertificates(1);
  }

  ngOnDestroy(): void {
    clearTimeout(this.searchTimer);
  }
  
  loadAllCertificates(page:number):void{
    this.loadCertificate('birth', page);
    this.loadCertificate('death', page);
    this.loadCertificate('marriage', page);
    this.loadCertificate('income', page);
    this.loadCertificate('caste', page);
  }

  loadCertificate(type: string, page: number): void {

    const search = this.searchText.trim();

    const requests: any = {
      birth: this.s.getAllBirthCertificates(page, search),
      death: this.s.getAllDeathCertificates(page, search),
      marriage: this.s.getAllMarriageCertificates(page, search),
      income: this.s.getAllIncomeCertificates(page, search),
      caste: this.s.getAllCasteCertificates(page, search)
    };

    requests[type].subscribe({
      next: (res: any) => {
        switch (type) {
          case 'birth':
              this.birthC = res.results;
              this.birthTotalRecord = res.count;
              break;

          case 'death':
              this.deathC = res.results;
              this.deathTotalRecord = res.count;
              break;

          case 'marriage':
              this.marriageC = res.results;
              this.marriageTotalRecord = res.count;
              break;

          case 'income':
              this.incomeC = res.results;
              this.incomeTotalRecord = res.count;
              break;

          case 'caste':
              this.casteC = res.results;
              this.casteTotalRecord = res.count;
              break;
          }

          this.currentPage = page;
      },
      error: (err: any) => {
        console.error(`Failed to load ${type} certificates`, err);
      }
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(() => {
      this.loadAllCertificates(1);
    }, 400);
  }

  clearSearch(): void {
    clearTimeout(this.searchTimer);
    this.searchText = '';
    this.loadAllCertificates(1);
  }

  get birthTotalPages(): number {
  return Math.ceil(this.birthTotalRecord / this.pageSize);
}

get deathTotalPages(): number {
  return Math.ceil(this.deathTotalRecord / this.pageSize);
}

get marriageTotalPages(): number {
  return Math.ceil(this.marriageTotalRecord / this.pageSize);
}

get incomeTotalPages(): number {
  return Math.ceil(this.incomeTotalRecord / this.pageSize);
}

get casteTotalPages(): number {
  return Math.ceil(this.casteTotalRecord / this.pageSize);
}

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadAllCertificates(this.currentPage - 1);
    }
  }

  get totalPages(): number {
  return Math.max(
    this.birthTotalPages,
    this.deathTotalPages,
    this.marriageTotalPages,
    this.incomeTotalPages,
    this.casteTotalPages
  );
}

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadAllCertificates(this.currentPage + 1);
    }
  }

  openEdit(type: string, row: any) {
    this.editType = type;
    this.editRow = row;
    this.editForm = { status: row.status, remarks: row.remarks || '' };
    this.editError = '';
    this.editOpen = true;
  }

saveEdit() {
  this.s.updateCertificate(this.editType, this.editRow.id, this.editForm).subscribe({
    next: (res: any) => {
      this.editRow.status = res.status;  
      this.editRow.remarks = res.remarks;
      this.editOpen = false;
    },
    error: (err) => this.editError = err.error?.detail || 'Could not update'
  });
}

}
