import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
user:any;

isLoggedin = false;
isAdmin = false;
isStaff = false;
 constructor(private router:Router){}  
 
 ngOnInit(){
  this.user = JSON.parse(localStorage.getItem('user') || '{}');
  this.isLoggedin = !!localStorage.getItem('access')
  this.isAdmin = this.user.role === 'admin';
  this.isStaff = this.user.role === 'staff';
 }

 logout(){
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');
  this.isLoggedin = false;
  this.router.navigate(['/login']);
 }
}
