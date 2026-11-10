import { Component, OnInit } from '@angular/core';
import { GramserviceService } from '../gramservice.service';

@Component({
  selector: 'app-contentpage',
  templateUrl: './contentpage.component.html',
  styleUrls: ['./contentpage.component.css']
})
export class ContentpageComponent implements OnInit {

 services:any=[];
 user:any;
 news:any=[];

 isLoggedin = false;
 isAdmin = false;

 constructor(public gservice:GramserviceService){}

 ngOnInit(){
  this.user = JSON.parse(localStorage.getItem('user') || '{}');
  this.isLoggedin = !!localStorage.getItem('access');
  this.isAdmin = this.user.role === 'admin';
  
  // if(this.isAdmin){
    
  // }
  this.loadGuestService();
  this.loadNews();
 }

//  Load Guest Services
loadGuestService(){
  this.gservice.readGuestServices().subscribe((res:any) =>
    this.services = res.data
  );
}

// Load News
loadNews(){
    this.gservice.readNews().subscribe({
    next: (res: any) => {
      this.news = res;
    },
    error: (err) => console.error(err)
  });
}

}
