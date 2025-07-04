import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ReactiveFormsModule,
    FormGroup,
    FormControl,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';
import { UserService } from '../user.service';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
    selector: 'app-edit-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, A11yModule],
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('400ms ease-out', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                animate('400ms ease-in', style({ opacity: 0 })),
            ]),
        ]),
    ],
})
export class EditProfileComponent implements OnInit {
    form: FormGroup;
    selectedImagePreview: string | null = null;
    selectedImageFile: File | null = null;

    @ViewChild('firstFocusElement', { static: true })
    firstFocusElement!: ElementRef<HTMLParagraphElement>;

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    constructor(private router: Router, private userService: UserService) {
        this.form = new FormGroup({
            first_name: new FormControl('', [Validators.required]),
            last_name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            birth_date: new FormControl('', [Validators.required]),
            profile_image: new FormControl(null),
        });
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.firstFocusElement.nativeElement.focus();
        }, 0);

        this.userService.getCurrentUser().subscribe({
            next: (data: any) => {
                this.form.patchValue({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    birth_date: data.birth_date.slice(0, 10),
                });

                if (data.profile_image_url) {
                    this.selectedImagePreview = data.profile_image_url;
                }
            },
            error: (err) => {
                console.error('Error al obtener el usuario', err);
            },
        });
    }

    onFileChange(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedImageFile = file;
            this.form.patchValue({ profile_image: file });

            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.selectedImagePreview = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    handleKeyPress(event: KeyboardEvent) {
        const keys = ['Enter'];
        if (keys.includes(event.key)) {
            event.preventDefault();
            this.fileInput.nativeElement.click();
        }
    }

    onSubmit() {
        if (this.form.valid) {
            const formData = new FormData();
            formData.append('first_name', this.form.get('first_name')?.value);
            formData.append('last_name', this.form.get('last_name')?.value);
            formData.append('email', this.form.get('email')?.value);
            formData.append('birth_date', this.form.get('birth_date')?.value);
            formData.append('role', this.form.get('role')?.value);

            if (this.selectedImageFile) {
                formData.append('profile_image', this.selectedImageFile);
            }

            this.userService.updateProfile(formData).subscribe({
                next: () => this.router.navigate(['/']),
                error: (err) =>
                    console.error('Error al actualizar perfil', err),
            });
        }
    }

    cancelEdit() {
        this.router.navigate(['/map']);
    }
}
