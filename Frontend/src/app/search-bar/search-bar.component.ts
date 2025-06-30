import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';
import { Location } from '../models/location.model';

@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.css'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({
                    opacity: 0,
                    transform: 'scaleY(0.85)',
                    transformOrigin: 'top left',
                }),
                animate(
                    '400ms ease-out',
                    style({ opacity: 1, transform: 'scaleY(1)' })
                ),
            ]),
            transition(':leave', [
                animate(
                    '400ms ease-in',
                    style({
                        opacity: 0,
                        transform: 'scaleY(0.85)',
                        transformOrigin: 'top left',
                    })
                ),
            ]),
        ]),
    ],
})
export class SearchBarComponent {
    searchTerm = '';
    showRecents = false;
    private blurTimeout: any;
    recentSearches: Location[] = [
        {
            id: 1,
            name: 'Lago 7 colores',
            src: 'lago.jpg',
            location: 'La Plata, Buenos Aires, Argentina',
            alt: 'Imgaen de Lago 7 colores',
        },
        {
            id: 2,
            name: 'Fosil Argentinosaurus',
            src: 'fosil.jpg',
            location: 'San Juan, San Juan, Argentina',
            alt: 'Imagen de Fosil Argentinosaurus',
        },
        {
            id: 3,
            name: 'Cataratas del Iguazú',
            src: 'cascada.jpg',
            location: 'Puerto Iguazú, Misiones, Argentina',
            alt: 'Imagen de Cataratas del Iguazú',
        },
    ];

    onWrapperFocus() {
        clearTimeout(this.blurTimeout);
        this.showRecents = true;
    }

    onWrapperBlur() {
        this.blurTimeout = setTimeout(() => {
            this.showRecents = false;
        }, 200);
    }

    onFocus() {
        this.showRecents = true;
    }

    onBlur() {
        setTimeout(() => (this.showRecents = false), 200);
    }

    selectRecent(term: Location) {
        this.searchTerm = term.name;
        this.showRecents = false;
    }
}
