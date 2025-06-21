import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MapboxService {
    private readonly accessToken =
        'pk.eyJ1IjoiYXRpb25ubyIsImEiOiJjbWJzOXYzMngwaTlvMmlwbGptcjg5a2pxIn0.dBmqrvZVikhq_pj5475ZIg';
    private readonly baseUrl = 'https://api.mapbox.com/search/geocode/v6';

    constructor(private http: HttpClient) {}

    reverseGeocode(lng: number, lat: number): Observable<any> {
        return this.http.get(
            `${this.baseUrl}/reverse?longitude=${lng}&latitude=${lat}&access_token=${this.accessToken}&limit=1&language=es`
        );
    }
}
