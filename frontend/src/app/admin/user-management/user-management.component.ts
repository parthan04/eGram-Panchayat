import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GramserviceService } from 'src/app/gramservice.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {

  citizen:any[]=[]
  staff={username:"",last_name:"",phone:"",email:"",password:"",address:"",district:"",dob:"",id_proof:"",staff_designation:"",role:""}

  currentPage = 1
  totalRecord = 0;
  pageSize = 7;
  loading = false;
  searchText = '';
  private searchTimer: any;

  isEdit = false
  editId:number | null = null;

  constructor(private s: GramserviceService,private r:Router) {}

  ngOnInit() {
    this.loadCitizen(1);
  }

  loadCitizen(page:number){
    this.loading = true;

    this.s.getAllCitizens(page, this.searchText.trim()).subscribe({
      next: (res: any) => {
        this.citizen = res.results || [];
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
  this.searchTimer = setTimeout(() => this.loadCitizen(1), 400);
}

clearSearch() {
  this.searchText = '';
  this.loadCitizen(1);
}

  get totalPages(): number{
    return Math.ceil(this.totalRecord / this.pageSize)
  }

  previousPage():void{
    if(this.currentPage>1){
      this.loadCitizen(this.currentPage - 1)
    }
  }
    
  nextPage():void{
    if(this.currentPage<this.totalPages){
      this.loadCitizen(this.currentPage+1)
    }
  }
  
  delete(id:number){
    this.s.delete_citizen(id).subscribe({
      next: (res: any) => {
        alert('User deleted Successfully');
        this.loadCitizen(1);
      },
      error: (err:any) => {
        alert('Something went wrong');
        console.log('err:',err)
      }
    })
  }

  deleteStaff(id:number){
    this.s.delete_staff(id).subscribe({
      next: (res: any) => {
        alert('Staff deleted Successfully');
        this.loadCitizen(1);
      },
      error: (err:any) => {
        alert('Something went wrong');
        console.log('err:',err)
      }
    })
  }

  edit(data:any){
    this.staff={username:"",last_name:"",phone:"",email:"",password:"",address:"",district:"",dob:"",id_proof:"",staff_designation:"",role:""}
    
    this.r.navigate(['/staff_management'],{
      state:{
        staff:data,
        isEdit:true
      }
    })
  }

  update(){
    if(this.editId !=null){
      this.s.updateStaff(this.editId,this.staff).subscribe(()=>{
        this.loadCitizen(1);
        this.clear();
      })
    }
  }

  clear(){
    this.staff={username:"",last_name:"",phone:"",email:"",password:"",address:"",district:"",dob:"",id_proof:"",staff_designation:"",role:""}
    this.isEdit = false;
    this.editId = null;
  }

}
