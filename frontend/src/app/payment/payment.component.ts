import { Component,OnInit } from '@angular/core';
import { GramserviceService } from '../gramservice.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var paypal:any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  taxId = 0;
  tax: any = null;
  amount: number | null = null;

  constructor(
    private s: GramserviceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taxId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.s.getTax(this.taxId).subscribe({
      next: (res: any) => this.tax = res,
      error: () => this.router.navigate(['/taxes'])
    });
  }

  pay() {
    if (!this.amount || this.amount < 1) {
      alert('Enter an amount');
      return;
    }

    this.s.createPaymentOrder(this.taxId, { amount: this.amount}).subscribe({
      next: (o: any) => {

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = o.action;

        Object.entries(o.fields).forEach(([name, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      },
      error: (err) => alert(err.error?.detail || 'Could not start payment')
    });
  }

  back() {
    this.router.navigate(['/taxes']);
  }
}
