import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    private apiUrl = environment.apiUrl + '/locations';
    private token: string | null = null;

    constructor(private http: HttpClient, private authService: AuthService) {}

    addLocation(data: FormData): Observable<any> {
        this.token = this.authService.getToken();
        return this.http.post(this.apiUrl + '/create', data, {
            headers: { Authorization: `Bearer ${this.token}` },
        });
    }

    getAllLocations(): Observable<any> {
        this.token = this.authService.getToken();
        return this.http.get(this.apiUrl + '/all', {
            headers: { Authorization: `Bearer ${this.token}` },
        });
    }

    getLocationById(id: number): Observable<any> {
        this.token = this.authService.getToken();
        return this.http.get(`${this.apiUrl}/location/${id}`, {
            headers: { Authorization: `Bearer ${this.token}` },
        });
    }
}
