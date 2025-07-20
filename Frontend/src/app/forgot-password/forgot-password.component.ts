import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private router: Router
    ) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    submit() {
        if (this.form.valid) {
            this.http
                .post('/api/auth/request-password-reset', this.form.value)
                .subscribe({
                    next: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Código enviado',
                            text: 'Revisá tu correo. Cuando lo tengas, hacé clic en "Ingresar código".',
                            showCancelButton: true,
                            confirmButtonText: 'Ingresar código',
                            cancelButtonText: 'Cerrar',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.router.navigate(['/reset-password'], {
                                    queryParams: {
                                        email: this.form.value.email,
                                    },
                                });
                            }
                        });
                    },
                    error: () => {
                        Swal.fire(
                            'Error',
                            'No se pudo enviar el correo. Verificá el email.',
                            'error'
                        );
                    },
                });
        }
    }

    backToLogin() {
        this.router.navigate(['/login']);
    }
}
