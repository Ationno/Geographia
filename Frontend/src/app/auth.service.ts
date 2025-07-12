import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = environment.apiUrl + '/auth';

    constructor(private http: HttpClient) {}

    register(
        firstName: string,
        lastName: string,
        email: string,
        birthDate: Date,
        password: string
    ): Observable<any> {
        return this.http.post(this.apiUrl + '/register', {
            first_name: firstName,
            last_name: lastName,
            email: email,
            birth_date: birthDate,
            password: password,
        });
    }
}
