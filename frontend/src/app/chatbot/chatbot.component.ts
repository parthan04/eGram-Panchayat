import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
 private api='http://127.0.0.1:8000/chatbot/'
 isOpen = false;
  question = '';
  isLoading = false;

  messages: ChatMessage[] = [
    {
      role: 'bot',
      text: 'Hello! Welcome to E-Gram Panchayat. How can I help you today?'
    }
  ];

  constructor(private http: HttpClient) {}

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    const question = this.question.trim();

    if (!question || this.isLoading) {
      return;
    }

    this.messages.push({
      role: 'user',
      text: question
    });

    this.question = '';
    this.isLoading = true;

    this.http.post<{ answer: string; error?: string }>(
      this.api,
      { question }
    ).subscribe({
      next: (response) => {
        this.messages.push({
          role: 'bot',
          text: response.answer || response.error || 'Sorry, no answer was returned.'
        });
        this.isLoading = false;
      },
      error: (error) => {
        const message =
          error.error?.error ||
          'Unable to connect to the chatbot. Please check whether the Django server is running.';

        this.messages.push({
          role: 'bot',
          text: message
        });

        this.isLoading = false;
      }
    });
  }
}
