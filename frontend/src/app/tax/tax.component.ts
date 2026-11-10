import { Component,OnInit } from '@angular/core';
import { GramserviceService } from '../gramservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.css']
})
export class TaxComponent implements OnInit {

  taxes:any=[];

  constructor(private s:GramserviceService,private router:Router){}
  
  ngOnInit() {
    this.s.getTaxes().subscribe((res: any) => {
      this.taxes = res;
    });
  }

  pay(id: number) {
    this.router.navigate(['/payment', id]);
  }

}
