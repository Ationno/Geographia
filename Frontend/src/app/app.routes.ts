import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { AddLocationComponent } from './add-location/add-location.component';

export const routes: Routes = [
    {
        path: '',
        component: MapComponent,
    },
    {
        path: 'addLocation',
        outlet: 'popup',
        component: AddLocationComponent,
    },
];
