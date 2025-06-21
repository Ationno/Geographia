import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MapComponent as MglMapComponent,
    ControlComponent,
    PopupComponent,
    AttributionControlDirective,
    FullscreenControlDirective,
    GeolocateControlDirective,
    NavigationControlDirective,
    ScaleControlDirective,
} from 'ngx-mapbox-gl';
import { MapMouseEvent } from 'mapbox-gl';
import { MglMapResizeDirective } from '../mgl-map-resize.directive';
import { trigger, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
    selector: 'app-map',
    imports: [
        MglMapComponent,
        PopupComponent,
        CommonModule,
        MglMapResizeDirective,
        ControlComponent,
        AttributionControlDirective,
        FullscreenControlDirective,
        GeolocateControlDirective,
        NavigationControlDirective,
        ScaleControlDirective,
    ],
    templateUrl: './map.component.html',
    styleUrl: './map.component.css',
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
export class MapComponent {
    popup: { coordinates: [number, number] } | null = null;

    constructor(private router: Router) {}

    onMapClick(event: mapboxgl.MapMouseEvent) {
        if (this.popup) {
            this.popup = null;
        } else {
            this.popup = {
                coordinates: [event.lngLat.lng, event.lngLat.lat],
            };
        }
    }

    addLocation() {
        this.router.navigate([{ outlets: { popup: ['addLocation'] } }], {
            queryParams: {
                lat: this.popup?.coordinates[1],
                lng: this.popup?.coordinates[0],
            },
        });
        this.popup = null;
    }

    onGeolocate(position: GeolocationPosition) {
        console.log('geolocate', position);
    }
}
