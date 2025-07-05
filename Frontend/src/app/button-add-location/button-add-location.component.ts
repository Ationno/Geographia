import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-button-add-location',
    imports: [],
    templateUrl: './button-add-location.component.html',
    styleUrl: './button-add-location.component.css',
})
export class ButtonAddLocationComponent {
    constructor(private router: Router) {}

    openAddLocations() {
        this.router.navigate(
            [
                '/map',
                {
                    outlets: {
                        popup: ['addLocation'],
                    },
                },
            ],
            {
                queryParams: {
                    lat: -1,
                    lng: -1,
                },
            }
        );
    }
}
