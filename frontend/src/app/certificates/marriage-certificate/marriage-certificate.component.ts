import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GramserviceService } from 'src/app/gramservice.service';

@Component({
  selector: 'app-marriage-certificate',
  templateUrl: './marriage-certificate.component.html',
  styleUrls: ['./marriage-certificate.component.css']
})
export class MarriageCertificateComponent {

    user:any={};
    file:File | null = null;
    file2:File | null = null;
    errors:{[key:string]:string[]}={};
    submitting = false;
    application = { h_name:"",w_name:"",date_of_marriage:"",email:"",phone:"",address:"",place_of_marriage:"",marriage_reg_no:""};  
  
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
      data.append('h_name', this.application.h_name);
      data.append('w_name', this.application.w_name);
      data.append('date_of_marriage',this.application.date_of_marriage)
      data.append('email',this.application.email)
      data.append('phone',this.application.phone)
      data.append('address',this.application.address)
      data.append('place_of_marriage',this.application.place_of_marriage)
      data.append('marriage_reg_no',this.application.marriage_reg_no)
      if (this.file) data.append('m_husband_id_proof', this.file);
      if (this.file2) data.append('m_wife_id_proof', this.file2);
  
      this.s.createMarriageCertificate(data).subscribe({
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
            this.application = {h_name:"",w_name:"",date_of_marriage:"",email:"",phone:"",address:"",place_of_marriage:"",marriage_reg_no:""};
            this.file = null;
          } else {
            alert(err.error.detail)
            alert('Something went wrong');
            this.application = {h_name:"",w_name:"",date_of_marriage:"",email:"",phone:"",address:"",place_of_marriage:"",marriage_reg_no:""};
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
