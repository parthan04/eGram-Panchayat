import { Component} from '@angular/core';
import { GramserviceService } from '../gramservice.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{
   user={username:"",last_name:"",phone:"",email:"",password:"",password2:"",address:"",district:"",dob:"",id_proof:""}
   errors:{[key:string]:string[]}={};
   submitting = false;

   constructor(public s:GramserviceService){}

   submit(){
    this.errors={};
    this.submitting =true;

    this.s.registerUser(this.user).subscribe({
    next: () => {
      this.submitting=false;
      console.log('registration done');
      this.user = {username:"",last_name:"",phone:"",email:"",password:"",password2:"",address:"",district:"",dob:"",id_proof:""};
      alert('REGISTRATION SUCCESSFUL!');
    },
    error: (err) => {
      this.submitting=false;
      this.errors = err.error?.message ?? err.error ?? {};
      alert("Registration failed")
      console.error('Registration failed:', err.error);
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
