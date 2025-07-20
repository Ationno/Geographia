import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
    form: FormGroup;
    email = '';

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router
    ) {
        this.form = this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
        });

        this.route.queryParams.subscribe((params) => {
            this.email = params['email'] || '';
        });
    }

    submit() {
        if (
            this.form.valid &&
            this.form.value.newPassword === this.form.value.confirmPassword
        ) {
            const payload = {
                email: this.email,
                newPassword: this.form.value.newPassword,
            };

            this.http.post('/api/auth/reset-password', payload).subscribe({
                next: () => {
                    Swal.fire(
                        'Contraseña restablecida',
                        'Ya podés iniciar sesión con tu nueva contraseña.',
                        'success'
                    );
                    this.router.navigate(['/login']);
                },
                error: () => {
                    Swal.fire('Error', 'Código incorrecto o vencido.', 'error');
                },
            });
        } else {
            Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
        }
    }
}
