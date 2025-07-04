import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
    selector: 'app-close-sesion',
    imports: [A11yModule],
    templateUrl: './close-sesion.component.html',
    styleUrl: './close-sesion.component.css',
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
export class CloseSesionComponent {
    @ViewChild('firstFocusElement', { static: true })
    firstFocusElement!: ElementRef<HTMLParagraphElement>;

    constructor(private router: Router) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.firstFocusElement.nativeElement.focus();
        }, 0);
    }

    cancel() {
        this.router.navigate(['/map']);
    }
}
