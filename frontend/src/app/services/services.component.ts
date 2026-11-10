import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GramserviceService } from '../gramservice.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
services:any=[];

constructor(private s:GramserviceService,private router:Router){}

ngOnInit(){
this.LoadAuthServices();
}

LoadAuthServices(){
  this.s.readAuthServices().subscribe((res:any)=>{
    this.services=res.data;
  })
}

serviceAppl(id:number){
  this.router.navigate(['/service-appl', id])
}



}
