import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) {}

    getCurrentUser(): Observable<any> {
        return this.http.get('/api/users/me');
    }

    updateProfile(data: FormData): Observable<any> {
        return this.http.put('/api/users/me', data);
    }

    getPrivacySettings() {
        return this.http.get('/api/users/me/privacy');
    }

    updatePrivacySettings(data: any) {
        return this.http.put('/api/users/me/privacy', data);
    }
}
