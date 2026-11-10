import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GramserviceService } from 'src/app/gramservice.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  
  user={username:"",password:""}
  error = ''

  constructor(private s:GramserviceService,private router:Router){}

  login() {
      this.error = '';
      this.s.adminLogin(this.user).subscribe({
        next: (res: any) => {
          localStorage.setItem('access', res.access);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/']);
        },
        error: (err) => {
          const d = err.error?.detail;
          this.error = Array.isArray(d) ? d[0] : (d || 'Login failed');
        }
      });
    }
}
