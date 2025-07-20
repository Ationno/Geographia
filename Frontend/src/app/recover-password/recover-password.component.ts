import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { CodeVerificationComponent } from '../code-verification/code-verification.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
    selector: 'app-recover-password',
    standalone: true,
    imports: [
        CommonModule,
        ForgotPasswordComponent,
        CodeVerificationComponent,
        ResetPasswordComponent,
    ],
    template: `<ng-container [ngSwitch]="step">
        <app-forgot-password
            *ngSwitchCase="'email'"
            (emailSubmitted)="onEmailSubmitted($event)"
            (tokenReceived)="onTokenReceived($event)"
        ></app-forgot-password>

        <app-code-verification
            *ngSwitchCase="'code'"
            [email]="email"
            [token]="token"
            (codeVerified)="onCodeVerified()"
            (backToEmail)="step = 'email'"
        ></app-code-verification>

        <app-reset-password
            *ngSwitchCase="'reset'"
            [email]="email"
            [token]="token"
            (passwordReset)="onPasswordReset()"
            (backToCode)="step = 'code'"
        ></app-reset-password>
    </ng-container>`,
    styleUrls: [],
})
export class RecoverPasswordComponent {
    step: 'email' | 'code' | 'reset' = 'email';
    email = '';
    token = '';

    onEmailSubmitted(email: string) {
        this.email = email;
        this.step = 'code';
    }

    onCodeVerified() {
        this.step = 'reset';
    }

    onPasswordReset() {
        this.step = 'email';
    }

    onTokenReceived(token: string) {
        this.token = token;
    }
}
