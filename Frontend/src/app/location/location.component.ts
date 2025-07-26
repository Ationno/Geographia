import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';
import { A11yModule } from '@angular/cdk/a11y';
import { LocationService } from '../location.service';
import { Location } from '../models/location.model';
import { User } from '../models/user.model';
import { UserService } from '../user.service';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { ResetService } from '../reset.service';

@Component({
    selector: 'app-location',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, A11yModule],
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.css'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('400ms ease-out', style({ opacity: 1 })),
            ]),
            transition(':leave', [
                animate('400ms ease-in', style({ opacity: 0 })),
            ]),
        ]),
    ],
})
export class LocationComponent implements OnInit {
    currentImageIndex = 0;

    commentForm!: FormGroup;

    @ViewChild('firstFocusElement', { static: true })
    firstFocusElement!: ElementRef<HTMLParagraphElement>;

    location: Location | null = null;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private locationService: LocationService,
        private userService: UserService,
        private resetService: ResetService
    ) {}

    comments: { user: User | null; text: string; date: string }[] = [];
    userLoggedIn: User | null = null;
    userCreator: User | null = null;
    protected apiUrl = environment.apiUrl.slice(0, -4);

    ngOnInit(): void {
        this.commentForm = this.fb.group({
            text: ['', [Validators.required, Validators.maxLength(500)]],
        });

        setTimeout(() => {
            this.firstFocusElement.nativeElement.focus();
        }, 0);

        this.route.queryParams.subscribe((params) => {
            const locationId = +params['locationId'];
            this.locationService.getLocationById(locationId).subscribe({
                next: (location) => {
                    location.createdAt = new Date(location.createdAt);
                    this.location = location;
                    this.userService
                        .getUserById(location.UserId)
                        .subscribe((user) => {
                            this.userCreator = user;
                        });
                },
                error: () => {
                    const recentSearchesStr =
                        localStorage.getItem('recentSearches');
                    if (recentSearchesStr) {
                        const recentSearches = JSON.parse(recentSearchesStr);
                        const updatedSearches = recentSearches.filter(
                            (item: any) => item.id !== locationId
                        );
                        localStorage.setItem(
                            'recentSearches',
                            JSON.stringify(updatedSearches)
                        );
                    }
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al acceder a la locación',
                        text: 'Ocurrió un error al momento de acceder a la locación. Puede que la locación haya sido eliminada o no exista.',
                        timer: 4000,
                        timerProgressBar: true,
                        showCloseButton: true,
                        showConfirmButton: false,
                        customClass: {
                            popup: 'montserrat-swal',
                            closeButton: 'montserrat-close',
                        },
                    });
                    this.router.navigate(['/map']);
                    this.resetService.resetComponentTrigger();
                },
            });
        });

        this.userService.getCurrentUser().subscribe({
            next: (user) => {
                this.userLoggedIn = user;
            },
            error: () => {
                this.userLoggedIn = null;
            },
        });
    }

    nextImage() {
        const imagesLength = this.location?.images?.length ?? 0;
        if (imagesLength > 0) {
            this.currentImageIndex =
                (this.currentImageIndex + 1) % imagesLength;
        }
    }

    prevImage() {
        const imagesLength = this.location?.images?.length ?? 0;
        if (imagesLength > 0) {
            this.currentImageIndex =
                (this.currentImageIndex - 1 + imagesLength) % imagesLength;
        }
    }

    selectImage(index: number) {
        this.currentImageIndex = index;
    }

    onSubmitComment() {
        if (this.commentForm.invalid) return;

        const commentText = this.commentForm.value.text.trim();
        if (!commentText) return;

        const newComment = {
            user: this.userLoggedIn,
            text: commentText,
            date: new Date().toISOString().split('T')[0],
        };

        this.comments.unshift(newComment);
        this.commentForm.reset();
    }

    cancel() {
        this.router.navigate(['/map']);
    }

    deleteLocation() {
        this.router.navigate(
            [
                '/map',
                {
                    outlets: {
                        popup: ['location'],
                        modal: ['deleteLocationConfirmation'],
                    },
                },
            ],
            {
                queryParams: {
                    locationId: this.location?.id,
                },
            }
        );
    }
}
