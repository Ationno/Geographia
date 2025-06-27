import { Component } from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({
                    opacity: 0,
                }),
                animate('400ms ease-out', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                animate(
                    '400ms ease-in',
                    style({
                        opacity: 0,
                    })
                ),
            ]),
        ]),
    ],
})
export class ChangePasswordComponent {
    form: FormGroup;
    submitted = false;
    wrongCurrentPassword = false;

    actualPasswordFromBackend = 'miPass123';

    constructor(private router: Router) {
        this.form = new FormGroup(
            {
                currentPassword: new FormControl('', [Validators.required]),
                newPassword: new FormControl('', [
                    Validators.required,
                    Validators.minLength(8),
                    this.passwordComplexityValidator,
                ]),
                confirmPassword: new FormControl('', [Validators.required]),
            },
            { validators: this.matchPasswordsValidator }
        );
    }

    passwordComplexityValidator(
        control: AbstractControl
    ): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;
        const hasNumber = /\d/.test(value);
        return hasNumber ? null : { noNumber: true };
    }

    matchPasswordsValidator(group: AbstractControl): ValidationErrors | null {
        const newPass = group.get('newPassword')?.value;
        const confirm = group.get('confirmPassword')?.value;

        return newPass !== confirm ? { passwordMismatch: true } : null;
    }

    onSubmit() {
        this.submitted = true;
        this.wrongCurrentPassword = false;

        if (this.form.valid) {
            const current = this.form.get('currentPassword')?.value;

            if (current !== this.actualPasswordFromBackend) {
                this.wrongCurrentPassword = true;
                return;
            }

            console.log('Password Change Data:', this.form.value);
        } else {
            this.form.markAllAsTouched();
        }
    }

    cancel() {
        this.router.navigate(['/map']);
    }
}
