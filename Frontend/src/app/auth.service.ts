import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = environment.apiUrl + '/auth';
    private loggedIn!: BehaviorSubject<boolean>;
    isLoggedIn$!: Observable<boolean>;

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {
        this.loggedIn = new BehaviorSubject<boolean>(this.hasToken());
        this.isLoggedIn$ = this.loggedIn.asObservable();
    }

    register(user: FormData): Observable<any> {
        return this.http.post(this.apiUrl + '/register', user);
    }

    login(email: string, password: string): Observable<any> {
        const post = this.http.post(this.apiUrl + '/login', {
            email: email,
            password: password,
        });

        post.subscribe({
            next: (response) => {
                this.loggedIn.next(true);
            },
        });

        return post;
    }

    logout(): void {
        this.cookieService.delete('token', '/');
        sessionStorage.removeItem('token');
        this.loggedIn.next(false);
    }

    hasToken(): boolean {
        return (
            sessionStorage.getItem('token') !== null ||
            this.cookieService.check('token')
        );
    }

    getToken(): string | null {
        return (
            sessionStorage.getItem('token') || this.cookieService.get('token')
        );
    }
}
