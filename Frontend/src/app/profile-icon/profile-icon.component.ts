import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
@Component({
    selector: 'app-profile-icon',
    imports: [CommonModule],
    templateUrl: './profile-icon.component.html',
    styleUrl: './profile-icon.component.css',
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({
                    opacity: 0,
                    transform: 'scaleY(0.85)',
                    transformOrigin: 'top left',
                }),
                animate(
                    '400ms ease-out',
                    style({ opacity: 1, transform: 'scaleY(1)' })
                ),
            ]),
            transition(':leave', [
                animate(
                    '400ms ease-in',
                    style({
                        opacity: 0,
                        transform: 'scaleY(0.85)',
                        transformOrigin: 'top left',
                    })
                ),
            ]),
        ]),
    ],
})
export class ProfileIconComponent {
    visibleMenu = false;

    constructor(private elementRef: ElementRef) {}

    toggleMenu() {
        this.visibleMenu = !this.visibleMenu;
    }

    @HostListener('document:click', ['$event.target'])
    onClickOutside(target: HTMLElement) {
        const clickedInside = this.elementRef.nativeElement.contains(target);
        if (!clickedInside) {
            this.visibleMenu = false;
        }
    }

    editInfo() {
        console.log('Editar Información');
    }

    changePassword() {
        console.log('Cambiar Contraseña');
    }

    privacity() {
        console.log('Privacidad');
    }

    closeSesion() {
        console.log('Cerrar Sesión');
    }

    deleteProfile() {
        console.log('Eliminar Perfil');
    }
}
