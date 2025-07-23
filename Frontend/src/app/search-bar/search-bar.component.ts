import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';
import { Location } from '../models/location.model';
import { LocationType } from '../models/location.model';

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
            images: ['lago.jpg'],
            address: 'La Plata, Buenos Aires, Argentina',
            latitude: -34.9214,
            longitude: -57.9544,
            type: LocationType.Geográfica,
            createdAt: new Date(),
            rating: 4.5,
            UserId: 1,
        },
        {
            id: 2,
            name: 'Fosil Argentinosaurus',
            images: ['fosil.jpg'],
            address: 'San Juan, San Juan, Argentina',
            latitude: -31.5375,
            longitude: -68.5369,
            type: LocationType.Histórica,
            createdAt: new Date(),
            rating: 4.8,
            UserId: 2,
        },
        {
            id: 3,
            name: 'Cataratas del Iguazú',
            images: ['cascada.jpg'],
            address: 'Puerto Iguazú, Misiones, Argentina',
            latitude: -25.6953,
            longitude: -54.4367,
            type: LocationType.Geográfica,
            createdAt: new Date(),
            rating: 4.5,
            UserId: 3,
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
