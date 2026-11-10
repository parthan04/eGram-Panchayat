import { Component } from '@angular/core';
import { GramserviceService } from 'src/app/gramservice.service';

@Component({
  selector: 'app-news-management',
  templateUrl: './news-management.component.html',
  styleUrls: ['./news-management.component.css']
})
export class NewsManagementComponent {

  constructor(private s:GramserviceService){}

  news = {
    title: '',
    description: '',
    published_on: '',
    expired_on: ''
  }

  today: string = (() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split('T')[0];
  })();


  submit(){
    this.s.createNews(this.news).subscribe({
      next: (res: any) => {
        alert('News submitted Successfully');
        this.news = { title: '', description: '', published_on: '', expired_on: '' };
      },
      error: (err:any) => {
        alert('Something went wrong');
        this.news = { title: '', description: '', published_on: '', expired_on: '' };
      }
    });
  }

}
