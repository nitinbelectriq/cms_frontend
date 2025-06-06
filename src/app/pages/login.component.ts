import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/login.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // <-- import Router

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

  constructor(private authService: AuthService, private router: Router) {} // <-- inject Router

  onSubmit() {
    const credentials = {
      user_name: this.user_name,
      password: this.password,
      project_code: this.project_code
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/home']); // <-- navigate on success
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Invalid user_name or password.');
      }
    });
  }
}
