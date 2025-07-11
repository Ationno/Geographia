import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MapboxService {
    private readonly accessToken = environment.mapbox.accessToken;
    private readonly baseUrl = environment.mapbox.baseUrl;

    constructor(private http: HttpClient) {}

    reverseGeocode(lng: number, lat: number): Observable<any> {
        return this.http.get(
            `${this.baseUrl}/reverse?longitude=${lng}&latitude=${lat}&access_token=${this.accessToken}&limit=1&language=es`
        );
    }
}
