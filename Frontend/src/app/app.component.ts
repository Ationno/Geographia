import { Component } from '@angular/core';
import { MapTypesListComponent } from './map-types-list/map-types-list.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { ProfileIconComponent } from './profile-icon/profile-icon.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
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
