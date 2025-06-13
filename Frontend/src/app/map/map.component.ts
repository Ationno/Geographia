import { Component } from '@angular/core';
import { MapComponent as MglMapComponent } from 'ngx-mapbox-gl';

@Component({
  selector: 'app-map',
  imports: [MglMapComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {

}
