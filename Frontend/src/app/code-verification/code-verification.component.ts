import {
    Component,
    QueryList,
    ViewChildren,
    ElementRef,
    AfterViewInit,
    Input,
    EventEmitter,
    Output,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-code-verification',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './code-verification.component.html',
    styleUrls: ['./code-verification.component.css'],
})
export class CodeVerificationComponent implements AfterViewInit {
    @Input() email: string = '';
    @Input() token: string = '';
    @Output() codeVerified = new EventEmitter<void>();
    @Output() backToEmail = new EventEmitter<void>();
    @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef>;
    codeControls: FormControl[] = [];
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {
        this.codeControls = Array.from(
            { length: 4 },
            () =>
                new FormControl('', [
                    Validators.required,
                    Validators.pattern(/^[0-9]$/),
                ])
        );
        this.form = new FormGroup({
            code: new FormControl('', Validators.required),
        });

        this.route.queryParams.subscribe((params) => {
            this.email = params['email'] || '';
        });
    }

    ngAfterViewInit(): void {
        const firstInput = document.querySelector(
            '.code-box'
        ) as HTMLInputElement;
        if (firstInput) firstInput.focus();
    }

    onInput(event: Event, index: number) {
        const input = event.target as HTMLInputElement;
        const nextInput = input.nextElementSibling as HTMLInputElement;
        const value = input.value;

        if (value && /^[0-9]$/.test(value) && nextInput) {
            nextInput.focus();
        }

        this.updateFormCode();
    }

    onKeyDown(event: KeyboardEvent, index: number) {
        const input = event.target as HTMLInputElement;
        if (event.key === 'Backspace' && !input.value && index > 0) {
            const prevInput = input.previousElementSibling as HTMLInputElement;
            if (prevInput) prevInput.focus();
        }
    }

    updateFormCode() {
        const code = this.codeControls.map((c) => c.value).join('');
        this.form.get('code')?.setValue(code);
        this.form.get('code')?.markAsDirty();
        this.form.get('code')?.updateValueAndValidity();
    }

    submit() {
        const code = this.form.get('code')?.value;
        if (!this.email || !code || code.length !== 4) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo verificar el código. Asegúrate de que todos los campos sean válidos.',
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

        this.authService.verifyCode(this.token, code).subscribe({
            next: () => {
                this.codeVerified.emit();
            },
            error: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Código inválido o expirado.',
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
