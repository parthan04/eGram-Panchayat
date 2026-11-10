import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GramserviceService } from 'src/app/gramservice.service';

@Component({
  selector: 'app-services-management',
  templateUrl: './services-management.component.html',
  styleUrls: ['./services-management.component.css']
})
export class ServicesManagementComponent {
  
  services:any=[];
  service={title:"",description:""}

  isEdit = false
  editId:number | null = null;

  constructor(private s:GramserviceService,private r:Router){}

  ngOnInit(){
  this.LoadAuthServices();
  } 

  LoadAuthServices(){
    this.s.readAuthServices().subscribe((res:any)=>{
      this.services=res.data;
    })
  } 

  Submit(){    
    this.s.create_service(this.service).subscribe({
      next: (res: any) => {
        alert('Service created Successfully');
        this.service = { title: '', description: ''};
        this.r.navigate(['/service_management']).then(()=>{
          window.location.reload();
        })
      },
      error: (err:any) => {
        alert('Something went wrong');
        this.service = { title: '', description: ''};
      }
    });
  }

  delete(id:number){
    this.s.delete_services(id).subscribe({
      next: (res: any) => {
        alert('Service deleted Successfully');
        this.LoadAuthServices();
      },
      error: (err:any) => {
        alert('Something went wrong');
      }
    })
  }

  edit(data:any){
    this.service={title:data.title,description:data.description}

    this.editId = data.id;
    this.isEdit = true
  }

  update() {
  if (this.editId != null) {
    this.s.update_service(this.editId, this.service).subscribe({
      next: () => {
        alert('Service updated Successfully');
        this.LoadAuthServices();
        this.clear();
      },
      error: (err) => {
        console.log(err.error);
        alert('Could not update');
      }
    });
  }
}

  clear(){
    this.service={title:"",description:""}
    this.isEdit = false;
    this.editId = null;
  }

}
