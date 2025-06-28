import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
    showPassword = false;
    showRepeatPassword = false;

    constructor(private router: Router) {}

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    toggleRepeatPassword() {
        this.showRepeatPassword = !this.showRepeatPassword;
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
}
