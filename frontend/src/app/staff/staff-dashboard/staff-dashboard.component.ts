import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GramserviceService } from 'src/app/gramservice.service';

@Component({
  selector: 'app-staff-dashboard',
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.css']
})
export class StaffDashboardComponent {

  constructor(private s:GramserviceService,private router:Router){}

  logout() {
    localStorage.clear();
    this.router.navigate(['/staff_login']);
  }

}
