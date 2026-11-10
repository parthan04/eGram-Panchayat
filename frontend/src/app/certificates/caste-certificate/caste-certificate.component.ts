import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GramserviceService } from 'src/app/gramservice.service';


@Component({
  selector: 'app-caste-certificate',
  templateUrl: './caste-certificate.component.html',
  styleUrls: ['./caste-certificate.component.css']
})
export class CasteCertificateComponent {

  user:any={};
  file:File | null = null;
  file2:File | null = null;
  errors:{[key:string]:string[]}={};
  submitting = false;
  application = { caste:"",phone:"",email:"",gender:"",parent_name:"",dob:"",religion:"",ration_card_no:"",address:""};

  constructor(private s:GramserviceService,private router:Router){}
  
  ngOnInit(){
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
    }
    
  onFile(event: any) {
    this.file = event.target.files[0];
  }
  
  onFile2(event: any) {
    this.file2 = event.target.files[0];
  }

  submit() {

    this.errors = {};
    this.submitting=true;

    const data = new FormData();
    data.append('citizen', String(this.user.id));
    data.append('caste', this.application.caste);
    data.append('phone', this.application.phone);
    data.append('email', this.application.email);
    data.append('gender', this.application.gender);
    data.append('parent_name', this.application.parent_name);
    data.append('dob', this.application.dob);
    data.append('religion', this.application.religion);
    data.append('ration_card_no', this.application.ration_card_no);
    data.append('address', this.application.address);
    if (this.file) data.append('sslc_certificate', this.file);
    if (this.file2) data.append('id_proof', this.file2);

    this.s.createCasteCertificate(data).subscribe({
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
          this.application = {caste:"",phone:"",email:"",gender:"",parent_name:"",dob:"",religion:"",ration_card_no:"",address:""};
          this.file = null;
          this.file2 = null;
        } else {
          alert('Something went wrong');
          this.application = {caste:"",phone:"",email:"",gender:"",parent_name:"",dob:"",religion:"",ration_card_no:"",address:""};
          this.file = null;
          this.file2 = null;
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
