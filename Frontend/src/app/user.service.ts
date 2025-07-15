import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    private apiUrl = environment.apiUrl + '/users';
    private token: string | null = null;

    constructor(private http: HttpClient, private authService: AuthService) {}

    getCurrentUser(): Observable<any> {
        this.token = this.authService.getToken();
        return this.http.get(this.apiUrl + '/me', {
            headers: { Authorization: `Bearer ${this.token}` },
        });
    }

    updateProfile(user: FormData): Observable<any> {
        this.token = this.authService.getToken();
        return this.http.put(this.apiUrl + '/me', user, {
            headers: { Authorization: `Bearer ${this.token}` },
        });
    }

    getPrivacySettings() {
        return this.http.get('/api/users/me/privacy');
    }

    updatePrivacySettings(data: any) {
        return this.http.put('/api/users/me/privacy', data);
    }
}
