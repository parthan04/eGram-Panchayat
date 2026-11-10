import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

constructor(private router:Router){}

isAuthPage():boolean{
  return ['/login','/register','/admin_login','/staff_login','/admin_dashboard','/staff_dashboard'].includes(this.router.url);
}
  
}
