import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-location',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.css'],
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
export class LocationComponent implements OnInit {
    currentImageIndex = 0;

    commentForm!: FormGroup;

    constructor(private fb: FormBuilder, private router: Router) {}

    images = ['Andes.jpg', 'Perito.jpg', 'Salta.jpg'];

    location = {
        createdAt: '2025-06-28',
        title: 'Reserva Natural Iberá',
        user: {
            name: 'Carlos Gómez',
            profilePic: 'icono.jpg',
            lastLocation: 'Corrientes',
        },
        location: 'Corrientes, Argentina',
        rating: 4,
        description:
            'Una reserva con esteros impresionantes y gran biodiversidad. Ideal para avistaje de fauna y fotografía de naturaleza.',
        tags: ['Naturaleza', 'Humedales', 'Biodiversidad'],
        type: 'Reserva Natural',
    };

    comments = [
        {
            user: {
                name: 'Lucía Pérez',
                profilePic: 'icono.jpg',
                lastLocation: 'Misiones',
            },
            text: 'Hermoso lugar, súper tranquilo y lleno de vida silvestre.',
            date: '2025-06-25',
        },
        {
            user: {
                name: 'Julián Torres',
                profilePic: 'icono.jpg',
                lastLocation: 'Formosa',
            },
            text: 'Vale la pena visitar en primavera.',
            date: '2025-06-24',
        },
    ];

    userLoggedIn = {
        name: 'Usuario Actual',
        profilePic: 'icono.jpg',
        lastLocation: 'Buenos Aires',
    };

    ngOnInit(): void {
        this.commentForm = this.fb.group({
            text: ['', [Validators.required, Validators.maxLength(500)]],
        });
    }

    nextImage() {
        this.currentImageIndex =
            (this.currentImageIndex + 1) % this.images.length;
    }

    prevImage() {
        this.currentImageIndex =
            (this.currentImageIndex - 1 + this.images.length) %
            this.images.length;
    }

    selectImage(index: number) {
        this.currentImageIndex = index;
    }

    onSubmitComment() {
        if (this.commentForm.invalid) return;

        const commentText = this.commentForm.value.text.trim();
        if (!commentText) return;

        const newComment = {
            user: this.userLoggedIn,
            text: commentText,
            date: new Date().toISOString().split('T')[0],
        };

        this.comments.unshift(newComment);
        this.commentForm.reset();

        // Acá irá tu lógica de envío al backend
        console.log('Comentario enviado:', newComment);
    }

    cancel() {
        this.router.navigate(['/map']);
    }
}
