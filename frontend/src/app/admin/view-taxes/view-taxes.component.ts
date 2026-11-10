import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GramserviceService } from 'src/app/gramservice.service';

@Component({
  selector: 'app-view-taxes',
  templateUrl: './view-taxes.component.html',
  styleUrls: ['./view-taxes.component.css']
})
export class ViewTaxesComponent {
  taxes:any=[];
  
    constructor(private s:GramserviceService,private router:Router){}
    
    ngOnInit() {
      this.s.getTaxes().subscribe((res: any) => {
        this.taxes = res;
      });
    }
}
