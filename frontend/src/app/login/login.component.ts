import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GramserviceService } from '../gramservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
   user={username:"",password:""}

   constructor(private s:GramserviceService,private router:Router){}

   submit(){
    this.s.loginUser(this.user).subscribe({
    next:(response:any)=>{

      localStorage.setItem('access',response.access)
      localStorage.setItem('refresh',response.refresh)
      localStorage.setItem('user',JSON.stringify(response.user))

      this.router.navigate(['/'])
    },
    error:(error)=>{
      console.log("Login Failed");
      console.log(error);
      console.log("Login Failed")
      this.user={username:"",password:""}
      alert("Login Failed Invalid username or password")
    }
  })
   }
}
