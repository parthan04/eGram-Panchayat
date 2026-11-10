import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GramserviceService } from 'src/app/gramservice.service';

@Component({
  selector: 'app-death-certificate',
  templateUrl: './death-certificate.component.html',
  styleUrls: ['./death-certificate.component.css']
})
export class DeathCertificateComponent {

  constructor(private router: Router ,private s:GramserviceService){}
  
  user:any={};
  file:File | null = null;
  errors:{[key:string]:string[]}={};
  submitting = false;
  application = { d_name:"",d_place:"",d_date:"",d_time:"",cause_d:"",gender:"",phone:"",email:"",remarks:"" };

  
  ngOnInit(){
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
    }
    
    onFile(event: any) {
    this.file = event.target.files[0];
  }

  submit() {

    this.errors = {};
    this.submitting=true;

    const data = new FormData();
    data.append('citizen', String(this.user.id));
    data.append('d_name', this.application.d_name);
    data.append('d_place', this.application.d_place);
    data.append('d_date', this.application.d_date);
    data.append('d_time', this.application.d_time);
    data.append('cause_d', this.application.cause_d);
    data.append('gender', this.application.gender);
    data.append('email', this.application.email);
    data.append('phone', this.application.phone);
    data.append('remarks', this.application.remarks);
    if (this.file) data.append('d_proof', this.file);

    this.s.createDeathCertificate(data).subscribe({
      next: (res: any) => {
        this.submitting=false;
        alert('Application submitted');
        this.router.navigate(['view-certificate']);
      },
      error: (err) => {
        console.log('Error response',err.error);
        this.submitting=false;
        this.errors = err.error?.message ?? err.error ?? {};
        if(err.error && err.error.detail){
          alert(err.error.detail)
          this.application = { d_name:"",d_place:"",d_date:"",d_time:"",cause_d:"",gender:"",phone:"",email:"",remarks:"" };
          this.file = null;
        } else {
          alert('Something went wrong');
          this.application = { d_name:"",d_place:"",d_date:"",d_time:"",cause_d:"",gender:"",phone:"",email:"",remarks:"" };
          this.file = null;
        }
      }
    });
  }   
  
  hasError(field: string): boolean {
    return !!this.errors[field]?.length;
  }

  getError(field: string): string {
    return this.errors[field]?.[0] ?? '';
  }

}
