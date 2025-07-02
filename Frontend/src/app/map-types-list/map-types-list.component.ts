import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-map-types-list',
    imports: [CommonModule],
    templateUrl: './map-types-list.component.html',
    styleUrl: './map-types-list.component.css',
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
export class MapTypesListComponent {
    openMenu = false;
    mapTypes = ['SATÉLITE', 'CLIMÁTICA', 'GEOGRÁFICA', 'RURAL'];
    selectedType: string | null = null;

    toggleMenu() {
        this.openMenu = !this.openMenu;
    }

    selectType(type: string) {
        this.selectedType = type;
    }
}
