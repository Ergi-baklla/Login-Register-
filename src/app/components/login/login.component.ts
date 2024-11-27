import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  login = {
    email: '',
    password: '',
  };

  isAdmin = false; // Tracks the state of the admin checkbox

  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement; // Cast target to HTMLInputElement
    this.isAdmin = input.checked;
  }

  onLogin() {
    const { email, password } = this.login;
    console.log('Admin:', this.isAdmin); // Logs whether the user is an admin

    this.authService.getUserDetails(email, password).subscribe({
      next: (response) => {
        if (response.length >= 1) {
          sessionStorage.setItem('email', email);
          sessionStorage.setItem('isAdmin', this.isAdmin.toString()); // Store admin status if needed
          this.router.navigate(['home']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid credentials',
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong',
        });
      },
    });
  }
}
