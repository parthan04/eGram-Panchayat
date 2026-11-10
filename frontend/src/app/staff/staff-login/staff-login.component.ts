import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GramserviceService } from 'src/app/gramservice.service';

@Component({
  selector: 'app-staff-login',
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.css']
})
export class StaffLoginComponent {

  user={username:"",password:"",staff_designation:""}

  constructor(private s:GramserviceService,private router:Router){}

  submit(){
    this.s.staffLogin(this.user).subscribe({
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
      this.user={username:"",password:"",staff_designation:""}
      alert("Login Failed Invalid username or password")
    }
  })
   }
}
