import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { GramserviceService } from 'src/app/gramservice.service';

@Component({
  selector: 'app-marriage-certificatepdf',
  templateUrl: './marriage-certificatepdf.component.html',
  styleUrls: ['./marriage-certificatepdf.component.css']
})
export class MarriageCertificatepdfComponent implements OnInit{

  id!:number;
  certificate:any={}
  constructor(private s:GramserviceService,private route:ActivatedRoute){}

   ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      this.id = Number(params.get('id'));

      if (!this.id || isNaN(this.id)) {
        console.error('Invalid certificate ID');
        return;
      }

      this.s.marriageCPdf(this.id).subscribe({
        next: (res: any) => {
          this.certificate = res;
        },
        error: (err) => {
          console.log('Certificate loading error:', err);
        }
      });

    });

  }

downloadPDF(): void {

  const element = document.getElementById('marriageCertificate');

  if (!element) {
    alert('Certificate not found');
    return;
  }

  const options = {
    margin: 10,
    filename: 'Marriage_Certificate.pdf',
    image: {
      type: 'jpeg' as const,
      quality: 0.98
    },
    html2canvas: {
      scale: 2
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4',
      orientation: 'portrait' as const
    }
  };

  html2pdf().set(options).from(element).save();
}

}
