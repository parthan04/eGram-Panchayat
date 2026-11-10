import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GramserviceService } from 'src/app/gramservice.service';


@Component({
  selector: 'app-birth-certificate',
  templateUrl: './birth-certificate.component.html',
  styleUrls: ['./birth-certificate.component.css']
})
export class BirthCertificateComponent {

  user:any={};
  file:File | null = null;
  errors:{[key:string]:string[]}={};
  submitting = false;
  application = { fname:"",lname:"",dob:"",b_date:"",b_place:"",b_weight:"",b_time:"",gender:"",father_name:"",mother_name:"",email:"",phone:"" };

  constructor(private s:GramserviceService,private router:Router){}
  
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
    data.append('fname', this.application.fname);
    data.append('lname', this.application.lname);
    data.append('dob', this.application.dob);
    data.append('b_date', this.application.b_date);
    data.append('b_place', this.application.b_place);
    data.append('b_weight', this.application.b_weight);
    data.append('b_time', this.application.b_time);
    data.append('gender', this.application.gender);
    data.append('father_name', this.application.father_name);
    data.append('mother_name', this.application.mother_name);
    data.append('email', this.application.email);
    data.append('phone', this.application.phone);
    if (this.file) data.append('id_proof', this.file);

    this.s.createBirthCertificate(data).subscribe({
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
          this.application = {fname:"",lname:"",dob:"",b_date:"",b_place:"",b_weight:"",b_time:"",gender:"",father_name:"",mother_name:"",email:"",phone:""};
          this.file = null;
        } else {
          alert('Something went wrong');
          this.application = {fname:"",lname:"",dob:"",b_date:"",b_place:"",b_weight:"",b_time:"",gender:"",father_name:"",mother_name:"",email:"",phone:""};
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
