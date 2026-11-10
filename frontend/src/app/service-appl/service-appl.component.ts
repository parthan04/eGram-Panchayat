import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import { GramserviceService } from '../gramservice.service';

@Component({
  selector: 'app-service-appl',
  templateUrl: './service-appl.component.html',
  styleUrls: ['./service-appl.component.css']
})
export class ServiceApplComponent {

  id = 0;
  services:any = {};
  user:any={};
  application = { description: '', location: '' ,phone:'',address:''};
  file: File | null = null;


  constructor(private s:GramserviceService,private ar:ActivatedRoute,private router:Router){
      this.id = Number(this.ar.snapshot.paramMap.get('id'))
    }

    ngOnInit(){
      this.user = JSON.parse(localStorage.getItem('user') || '{}');

      this.s.getService(this.id).subscribe({
        next: (res: any) => {
          this.services = res;
        },
        error: (err) => console.log(err)
      })
    }
    
    onFile(event: any) {
    this.file = event.target.files[0];
  }

  submit() {
    const data = new FormData();
    data.append('description', this.application.description);
    data.append('location', this.application.location);
    data.append('citizen', String(this.user.id));
    data.append('service', String(this.id));
    data.append('phone', this.application.phone);
    data.append('address', this.application.address);
    if (this.file) data.append('attachment', this.file);

    this.s.serviceApplication(data, this.id).subscribe({
      next: (res: any) => {
        alert('Application submitted');
        this.router.navigate(['/application']);
      },
      error: (err) => {
        console.log('Error response',err.error);
        if(err.error && err.error.detail){
          alert(err.error.detail)
          this.application = { description: '', location: '' ,phone:'',address:''};
          this.file = null;
        } else {
          alert('Something went wrong');
          this.application = { description: '', location: '' ,phone:'',address:''};
          this.file = null;
        }
      }
    });
  }
  

}
