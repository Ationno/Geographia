import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';
import { MapboxService } from '../mapbox.service';
import { catchError, finalize, of } from 'rxjs';
import { ViewChild, ElementRef } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
    selector: 'app-add-location',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, A11yModule],
    templateUrl: './add-location.component.html',
    styleUrls: ['./add-location.component.css'],
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
export class AddLocationComponent {
    @ViewChild('tagInputElement')
    tagInputElement!: ElementRef<HTMLInputElement>;

    @ViewChild('firstFocusElement', { static: true })
    firstFocusElement!: ElementRef<HTMLParagraphElement>;

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    form: FormGroup;
    selectedImages: File[] = [];
    lat!: number;
    lng!: number;
    selectedImagePreviews: string[] = [];
    isAccesibility: boolean = false;

    tags: string[] = [];
    isEditingTags = false;
    tagInputControl = new FormControl('');

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private mapboxService: MapboxService
    ) {
        this.form = new FormGroup({
            name: new FormControl('', [Validators.required]),
            address: new FormControl('', [Validators.required]),
            latitude: new FormControl(null, [Validators.required]),
            longitude: new FormControl(null, [Validators.required]),
            images: new FormControl([], [Validators.required]),
            tags: new FormControl([]),
            details: new FormControl(''),
            type: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        setTimeout(() => {
            this.firstFocusElement.nativeElement.focus();
        }, 0);

        this.route.queryParams.subscribe((params) => {
            this.lat = +params['lat'];
            this.lng = +params['lng'];

            if (this.lat === -1 || this.lng === -1) {
                this.isAccesibility = true;
            }
        });

        this.fetchAddress();

        this.form.patchValue({
            latitude: this.lat,
            longitude: this.lng,
        });
    }

    handleKeyPress(event: KeyboardEvent) {
        const keys = ['Enter'];
        if (keys.includes(event.key)) {
            event.preventDefault();
            this.fileInput.nativeElement.click();
        }
    }

    fetchAddress(): void {
        this.mapboxService
            .reverseGeocode(this.lng, this.lat)
            .pipe(
                catchError((error) => {
                    console.error('Geocoding error:', error);
                    return of(null);
                }),
                finalize(() => {})
            )
            .subscribe((response) => {
                if (response?.features?.length > 0) {
                    const address =
                        response.features[0].properties.full_address;
                    this.form.patchValue({ address });
                }
            });
    }

    closeAddLocation() {
        this.router.navigate(['/map']);
    }

    onFileChange(event: any) {
        const files: FileList = event.target.files;
        if (files.length > 0) {
            this.selectedImages = Array.from(files);
            this.form.patchValue({
                images: this.selectedImages,
            });
            this.form.get('images')?.updateValueAndValidity();

            this.selectedImagePreviews = [];
            for (const file of this.selectedImages) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.selectedImagePreviews.push(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }
    }

    onSubmit() {
        if (this.form.valid) {
            console.log(this.form.value);
        }
    }

    onTagsFocus() {
        this.isEditingTags = true;
        this.tagInputControl.setValue(
            this.tags.map((tag) => `#${tag}`).join(' ')
        );
    }

    onTagsBlur() {
        const raw = this.tagInputControl.value || '';

        if (!raw.includes('#')) {
            this.isEditingTags = false;
            return;
        }

        const parsed = raw
            .split('#')
            .map((t) => t.trim())
            .filter((t) => t !== '');

        this.tags = parsed;
        this.form.get('tags')?.setValue(this.tags);
        this.isEditingTags = false;
    }

    deleteTag(index: number) {
        this.tags.splice(index, 1);
        this.form.get('tags')?.setValue(this.tags);
    }

    enableTagEdit() {
        this.isEditingTags = true;
        setTimeout(() => {
            this.tagInputElement.nativeElement.focus();
        }, 0);
    }
}
