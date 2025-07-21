import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service'; // Ruta según tu estructura
import { catchError } from 'rxjs';
import { of } from 'rxjs';
import { A11yModule } from '@angular/cdk/a11y';
@Component({
    selector: 'app-privacy-settings',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, A11yModule],
    templateUrl: './privacy-settings.component.html',
    styleUrl: './privacy-settings.component.css',
})
export class PrivacySettingsComponent implements OnInit {
    privacyForm: FormGroup;
    isLoading = false;
    errorMessage: string | null = null;

    @ViewChild('firstFocusElement', { static: true })
    firstFocusElement!: ElementRef<HTMLHeadingElement>;

    constructor(private userService: UserService, private router: Router) {
        this.privacyForm = new FormGroup({
            show_location: new FormControl(false),
            show_birth_date: new FormControl(false),
            show_name: new FormControl(false),
            show_email: new FormControl(false),
        });
    }

    ngOnInit(): void {
        this.isLoading = true;

        setTimeout(() => {
            this.firstFocusElement.nativeElement.focus();
        }, 0);

        this.userService.getCurrentUser().subscribe({
            next: (data: any) => {
                this.privacyForm.patchValue({
                    show_location: data.show_location,
                    show_birth_date: data.show_birth_date,
                    show_name: data.show_name,
                    show_email: data.show_email,
                });
            },
            error: (err) => {
                console.error(
                    'Error al obtener la configuración de privacidad',
                    err
                );
            },
        });
    }

    onSubmit(): void {
        if (this.privacyForm.valid) {
            this.userService
                .updatePrivacySettings(this.privacyForm.value)
                .subscribe({
                    next: () => {
                        this.router.navigate(['/map']);
                    },
                    error: (err) => {
                        console.error(
                            'Error actualizando configuración de privacidad',
                            err
                        );
                        this.errorMessage = 'Error al guardar los cambios.';
                    },
                });
        }
    }

    cancelEdit(): void {
        this.router.navigate(['/map']);
    }
}
