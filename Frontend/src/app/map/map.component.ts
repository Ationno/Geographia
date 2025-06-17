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
})
export class MapComponent {
    popup: { coordinates: [number, number] } | null = null;

    onMapClick(event: mapboxgl.MapMouseEvent) {
        if (this.popup) {
            this.popup = null;
        } else {
            this.popup = {
                coordinates: [event.lngLat.lng, event.lngLat.lat],
            };
        }
    }

    crearPublicacion() {
        console.log(
            'Abrir formulario de publicación en',
            this.popup?.coordinates
        );
        this.popup = null;
    }

    onGeolocate(position: GeolocationPosition) {
        console.log('geolocate', position);
    }
}
