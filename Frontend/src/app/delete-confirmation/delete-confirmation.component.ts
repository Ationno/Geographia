import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-delete-confirmation',
    imports: [],
    templateUrl: './delete-confirmation.component.html',
    styleUrl: './delete-confirmation.component.css',
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({
                    opacity: 0,
                }),
                animate('400ms ease-out', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                animate(
                    '400ms ease-in',
                    style({
                        opacity: 0,
                    })
                ),
            ]),
        ]),
    ],
})
export class DeleteConfirmationComponent {
    constructor(private router: Router) {}

    cancel() {
        this.router.navigate(['/map']);
    }
}
