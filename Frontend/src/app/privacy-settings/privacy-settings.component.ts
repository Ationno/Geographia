import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service'; // Ruta según tu estructura
import { catchError } from 'rxjs';
import { of } from 'rxjs';

@Component({
    selector: 'app-privacy-settings',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './privacy-settings.component.html',
    styleUrl: './privacy-settings.component.css',
})
export class PrivacySettingsComponent implements OnInit {
    form: FormGroup;
    isLoading = false;
    errorMessage: string | null = null;

    @ViewChild('firstFocusElement', { static: true })
    firstFocusElement!: ElementRef<HTMLHeadingElement>;

    constructor(private userService: UserService, private router: Router) {
        this.form = new FormGroup({
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

        this.userService
            .getPrivacySettings()
            .pipe(
                catchError((err) => {
                    console.error(
                        'Error cargando configuración de privacidad',
                        err
                    );
                    this.errorMessage = 'No se pudo cargar la configuración.';
                    return of(null);
                })
            )
            .subscribe((settings) => {
                if (settings) {
                    this.form.patchValue(settings);
                }
                this.isLoading = false;
            });
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.userService.updatePrivacySettings(this.form.value).subscribe({
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
