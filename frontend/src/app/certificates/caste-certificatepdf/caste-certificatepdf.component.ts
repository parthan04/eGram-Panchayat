import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { GramserviceService } from 'src/app/gramservice.service';

@Component({
  selector: 'app-caste-certificatepdf',
  templateUrl: './caste-certificatepdf.component.html',
  styleUrls: ['./caste-certificatepdf.component.css']
})
export class CasteCertificatepdfComponent implements OnInit {
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

      this.s.casteCPdf(this.id).subscribe({
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

  const element = document.getElementById('casteCertificate');

  if (!element) {
    alert('Certificate not found');
    return;
  }

  const options = {
    margin: 10,
    filename: 'Caste_Certificate.pdf',
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
