import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/login.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user_name = '';
  password = '';
  project_code = 'CMS';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const credentials = {
      user_name: this.user_name,
      password: this.password,
      project_code: this.project_code
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        // ✅ Store the token in localStorage for session persistence
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        } else {
          console.warn('No token received in response.');
        }

        // ✅ Navigate to home
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Invalid username or password.');
      }
    });
  }
}
