import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from './map/map.component';
import { MapTypesListComponent } from './map-types-list/map-types-list.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MapComponent, MapTypesListComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    title = 'Frontend';
}
