import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';
import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';

interface Location {
    id: number;
    image: string;
    title: string;
    description: string;
}

@Component({
    selector: 'app-list-locations',
    standalone: true,
    imports: [A11yModule, CommonModule],
    templateUrl: './list-locations.component.html',
    styleUrl: './list-locations.component.css',
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
export class ListLocationsComponent implements OnInit {
    @ViewChild('firstFocusElement', { static: true })
    firstFocusElement!: ElementRef<HTMLHeadingElement>;

    locations: Location[] = [];
    paginatedLocations: Location[] = [];
    currentPage: number = 1;
    pageSize: number = 5;
    totalPages: number = 1;

    constructor(private router: Router) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.firstFocusElement.nativeElement.focus();
        }, 0);

        this.fetchLocations();
    }

    fetchLocations(): void {
        const mockLocations: Location[] = Array.from(
            { length: 37 },
            (_, i) => ({
                id: i + 1,
                image: 'https://via.placeholder.com/100x60?text=Loc+' + (i + 1),
                title: 'Locación ' + (i + 1),
                description: 'Descripción de la locación número ' + (i + 1),
            })
        );

        this.locations = mockLocations;
        this.totalPages = Math.ceil(this.locations.length / this.pageSize);
        this.updatePaginatedLocations();
    }

    updatePaginatedLocations(): void {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedLocations = this.locations.slice(start, end);
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePaginatedLocations();
        }
    }

    cancel(): void {
        this.router.navigate(['/map']);
    }

    goToLocation(locationId: number): void {
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
                    locationId: locationId,
                },
            }
        );
    }
}
