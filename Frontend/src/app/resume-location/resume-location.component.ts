import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-resume-location',
    imports: [],
    templateUrl: './resume-location.component.html',
    styleUrl: './resume-location.component.css',
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
export class ResumeLocationComponent {
    location = {
        id: 'locationId',
        name: 'Parque Nacional Torres del Paine',
        address:
            'Torres del Paine, Región de Magallanes y de la Antártica Chilena, Chile',
    };

    constructor(private router: Router) {}

    goToLocationDetails(): void {
        this.router.navigate(
            [
                '/map',
                {
                    outlets: {
                        popup: ['location'],
                    },
                },
            ],
            {
                queryParams: {
                    locationId: this.location.id,
                },
            }
        );
    }

    cancel(): void {
        this.router.navigate(['/map']);
    }
}
