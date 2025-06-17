import { Component } from '@angular/core';
import { MapComponent } from './map/map.component';
import { MapTypesListComponent } from './map-types-list/map-types-list.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { ProfileIconComponent } from './profile-icon/profile-icon.component';

@Component({
    selector: 'app-root',
    imports: [
        MapComponent,
        MapTypesListComponent,
        SearchBarComponent,
        ProfileIconComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    title = 'Frontend';
}
