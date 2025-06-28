import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    showPassword = false;

    constructor(private router: Router) {}

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    goToRegister() {
        this.router.navigate(['/register']);
    }
}
