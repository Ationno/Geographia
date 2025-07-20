import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
    form: FormGroup;

    @Input() email: string = '';
    @Input() token: string = '';
    @Output() passwordReset = new EventEmitter<void>();
    @Output() backToCode = new EventEmitter<void>();

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        this.form = this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
        });
    }

    submit() {
        if (!this.email) {
            Swal.fire('Error', 'No se encontró un email válido.', 'error');
            return;
        }

        if (this.form.invalid) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa todos los campos correctamente.',
                timer: 4000,
                timerProgressBar: true,
                showCloseButton: true,
                showConfirmButton: false,
                customClass: {
                    popup: 'montserrat-swal',
                    closeButton: 'montserrat-close',
                },
            });
            return;
        }

        const { newPassword, confirmPassword } = this.form.value;

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden.',
                timer: 4000,
                timerProgressBar: true,
                showCloseButton: true,
                showConfirmButton: false,
                customClass: {
                    popup: 'montserrat-swal',
                    closeButton: 'montserrat-close',
                },
            });
            return;
        }

        const payload = {
            email: this.email,
            newPassword,
        };

        this.authService.resetPassword(this.token, newPassword).subscribe({
            next: () => {
                this.passwordReset.emit();
                Swal.fire({
                    icon: 'success',
                    title: 'Contraseña restablecida',
                    text: 'Tu contraseña ha sido restablecida exitosamente.',
                    timer: 4000,
                    timerProgressBar: true,
                    showCloseButton: true,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'montserrat-swal',
                        closeButton: 'montserrat-close',
                    },
                });
                this.router.navigate(['/login']);
            },
            error: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un problema al restablecer la contraseña.',
                    timer: 4000,
                    timerProgressBar: true,
                    showCloseButton: true,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'montserrat-swal',
                        closeButton: 'montserrat-close',
                    },
                });
            },
        });
    }
}
