import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-add-location',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './add-location.component.html',
    styleUrls: ['./add-location.component.css'],
})
export class AddLocationComponent {
    form: FormGroup;
    selectedImages: File[] = [];
    lat!: number;
    lng!: number;

    constructor(private router: Router, private route: ActivatedRoute) {
        this.form = new FormGroup({
            name: new FormControl('', [Validators.required]),
            address: new FormControl('', [Validators.required]),
            latitude: new FormControl(null, [Validators.required]),
            longitude: new FormControl(null, [Validators.required]),
            images: new FormControl([], [Validators.required]),
            tags: new FormControl([], [Validators.required]),
            details: new FormControl('', [Validators.required]),
            type: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.lat = +params['lat'];
            this.lng = +params['lng'];
            console.log('Lat:', this.lat, 'Lng:', this.lng);
        });
    }

    closeAddLocation() {
        this.router.navigate([{ outlets: { popup: null } }]);
    }

    onFileChange(event: any) {
        const files: FileList = event.target.files;
        if (files.length > 0) {
            this.selectedImages = Array.from(files);
            this.form.patchValue({
                images: this.selectedImages,
            });
            this.form.get('images')?.updateValueAndValidity();
        }
    }

    onSubmit() {
        if (this.form.valid) {
            console.log(this.form.value);
        }
    }

    addTag(tag: string) {
        if (!tag.trim()) return;
        const tags = this.form.get('tags')?.value || [];
        if (!tags.includes(tag)) {
            tags.push(tag);
            this.form.patchValue({ tags: tags });
        }
    }

    deleteTag(index: number) {
        const tags = this.form.get('etiquetas')?.value || [];
        tags.splice(index, 1);
        this.form.patchValue({ tags: tags });
    }
}
