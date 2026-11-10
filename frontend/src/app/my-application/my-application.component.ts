import { Component,OnInit } from '@angular/core';
import { GramserviceService } from '../gramservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-application',
  templateUrl: './my-application.component.html',
  styleUrls: ['./my-application.component.css']
})
export class MyApplicationComponent implements OnInit {

  
  applications:any=[]
  currentPage = 1
  totalRecord = 0;
  pageSize = 7;
  loading = false;
  searchText = '';
  private searchTimer: any;
  private sub?: Subscription;

  constructor(private s:GramserviceService){}
    
  ngOnInit(){
    this.loadMyApplication(1);
  }

  loadMyApplication(page:number){

    if (page < 1 || this.loading){
      return;
    }
    
    this.sub?.unsubscribe();
    this.loading = true;
    
    this.sub = this.s.getMyApplications(page,this.searchText.trim()).subscribe((res:any)=>{
      this.applications=res.results;
      this.currentPage = page
      this.totalRecord = res.count
      this.loading =false;
    })
  }

  onSearch() {
  clearTimeout(this.searchTimer);
  this.searchTimer = setTimeout(() => this.loadMyApplication(1), 400);
}

clearSearch() {
  this.searchText = '';
  this.loadMyApplication(1);
}

  get totalPages(): number{
    return Math.ceil(this.totalRecord / this.pageSize)
  }

  previousPage():void{
    if(this.currentPage>1){
      this.loadMyApplication(this.currentPage - 1)
    }
  }
    
  nextPage():void{
    if(this.currentPage<this.totalPages){
      this.loadMyApplication(this.currentPage+1)
    }
  }

}
