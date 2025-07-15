import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MapComponent as MglMapComponent,
    ControlComponent,
    PopupComponent,
    AttributionControlDirective,
    FullscreenControlDirective,
    GeolocateControlDirective,
    NavigationControlDirective,
    ScaleControlDirective,
    GeoJSONSourceComponent,
    LayerComponent,
} from 'ngx-mapbox-gl';
import { MapMouseEvent } from 'mapbox-gl';
import { MglMapResizeDirective } from '../mgl-map-resize.directive';
import { trigger, style, transition, animate } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';
import { MapTypesListComponent } from '../map-types-list/map-types-list.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ProfileIconComponent } from '../profile-icon/profile-icon.component';
import { RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import {
    bboxPolygon,
    booleanPointInPolygon,
    difference,
    featureCollection,
    point,
} from '@turf/turf';
import { HttpClient } from '@angular/common/http';
import { ButtonListLocationsComponent } from '../button-list-locations/button-list-locations.component';
import { ButtonAddLocationComponent } from '../button-add-location/button-add-location.component';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { LoginButtonComponent } from '../login-button/login-button.component';
import { AddLocationComponent } from '../add-location/add-location.component';

@Component({
    selector: 'app-map',
    imports: [
        MglMapComponent,
        PopupComponent,
        CommonModule,
        MglMapResizeDirective,
        ControlComponent,
        AttributionControlDirective,
        FullscreenControlDirective,
        GeolocateControlDirective,
        NavigationControlDirective,
        MapTypesListComponent,
        SearchBarComponent,
        ProfileIconComponent,
        RouterOutlet,
        GeoJSONSourceComponent,
        LayerComponent,
        ButtonListLocationsComponent,
        ButtonAddLocationComponent,
        LoginButtonComponent,
    ],
    templateUrl: './map.component.html',
    styleUrl: './map.component.css',
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
export class MapComponent {
    popup: { coordinates: [number, number] } | null = null;
    private routerSub!: Subscription;
    maskGeoJSON: any;
    isLoggedIn: boolean = false;
    private authSub!: Subscription;

    @ViewChild('firstFocusElement', { static: true })
    firstFocusElement!: ElementRef<HTMLDivElement>;

    argentinaBounds: [[number, number], [number, number]] = [
        [-73.5, -56.0],
        [-52.5, -20.0],
    ];

    locations = [
        {
            id: 1,
            title: 'Glaciar Perito Moreno',
            coordinates: [-73.05, -50.5] as [number, number],
            image: 'Perito.jpg',
        },
        {
            id: 2,
            title: 'Quebrada de Humahuaca',
            coordinates: [-65.5, -23.2] as [number, number],
            image: 'Salta.jpg',
        },
        {
            id: 3,
            title: 'Esteros del Iberá',
            coordinates: [-57.2, -28.5] as [number, number],
            image: 'Andes.jpg',
        },
    ];

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.authSub = this.authService.isLoggedIn$.subscribe((loggedIn) => {
            this.isLoggedIn = loggedIn;
        });

        this.http.get('argentina-mask.geojson').subscribe((argentina: any) => {
            const world = bboxPolygon([-180, -90, 180, 90]);
            this.maskGeoJSON = difference(
                featureCollection([world, ...argentina.features])
            );
        });

        this.routerSub = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event) => {
                if (this.router.url === '/map') {
                    console.log('Map component initialized');
                    setTimeout(() => {
                        this.firstFocusElement.nativeElement.focus();
                    }, 0);
                }
            });
    }

    ngOnDestroy() {
        this.authSub?.unsubscribe();
        this.routerSub?.unsubscribe();
    }

    onMapClick(event: mapboxgl.MapMouseEvent) {
        this.http.get('argentina-mask.geojson').subscribe((argentina: any) => {
            const clickedPoint = point([event.lngLat.lng, event.lngLat.lat]);

            const withinArgentina = argentina.features.some((feature: any) =>
                booleanPointInPolygon(clickedPoint, feature)
            );

            if (!withinArgentina) {
                return;
            }

            if (this.popup) {
                this.popup = null;
            } else {
                this.popup = {
                    coordinates: [event.lngLat.lng, event.lngLat.lat],
                };
            }
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            const canvas = document.querySelector('.mapboxgl-canvas');
            if (canvas) {
                canvas.setAttribute(
                    'aria-label',
                    'Mapa interactivo de Geographia'
                );
            }

            const fullscreenBtn = document.querySelector(
                '.mapboxgl-ctrl-fullscreen'
            );
            if (fullscreenBtn) {
                fullscreenBtn.setAttribute(
                    'aria-label',
                    'Control de pantalla completa'
                );
                const fullscreenIcon = fullscreenBtn.querySelector(
                    '.mapboxgl-ctrl-icon'
                );
                if (fullscreenIcon) {
                    fullscreenIcon.setAttribute('title', 'Pantalla completa');
                }
            }

            const geolocateBtn = document.querySelector(
                '.mapboxgl-ctrl-geolocate'
            );
            if (geolocateBtn) {
                geolocateBtn.setAttribute('aria-label', 'Ubicar mi posición');
                const geolocateIcon = geolocateBtn.querySelector(
                    '.mapboxgl-ctrl-icon'
                );
                if (geolocateIcon) {
                    geolocateIcon.setAttribute('title', 'Ubicar mi posición');
                }
            }

            const zoomInBtn = document.querySelector('.mapboxgl-ctrl-zoom-in');
            if (zoomInBtn) {
                zoomInBtn.setAttribute('aria-label', 'Acercar zoom');
                const zoomInIcon = zoomInBtn.querySelector(
                    '.mapboxgl-ctrl-icon'
                );
                if (zoomInIcon) {
                    zoomInIcon.setAttribute('title', 'Acercar zoom');
                }
            }

            const zoomOutBtn = document.querySelector(
                '.mapboxgl-ctrl-zoom-out'
            );
            if (zoomOutBtn) {
                zoomOutBtn.setAttribute('aria-label', 'Alejar zoom');
                const zoomOutIcon = zoomOutBtn.querySelector(
                    '.mapboxgl-ctrl-icon'
                );
                if (zoomOutIcon) {
                    zoomOutIcon.setAttribute('title', 'Alejar zoom');
                }
            }

            const compass = document.querySelector('.mapboxgl-ctrl-compass');
            if (compass) {
                compass.setAttribute('aria-label', 'Reorientar mapa');
                const compassIcon = compass.querySelector(
                    '.mapboxgl-ctrl-icon'
                );
                if (compassIcon) {
                    compassIcon.setAttribute('title', 'Reorientar mapa');
                }
            }
        }, 100);
    }

    addLocation() {
        if (this.isLoggedIn) {
            this.router.navigate(
                [
                    '/map',
                    {
                        outlets: {
                            popup: ['addLocation'],
                        },
                    },
                ],
                {
                    queryParams: {
                        lat: this.popup?.coordinates[1],
                        lng: this.popup?.coordinates[0],
                    },
                }
            );
            this.popup = null;
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Inicio de sesión requerido',
                text: 'Para realizar esta acción, por favor, inicie sesión.',
                timerProgressBar: true,
                showCloseButton: true,
                showConfirmButton: false,
                customClass: {
                    popup: 'montserrat-swal',
                    closeButton: 'montserrat-close',
                },
            });
        }
    }

    goToLocation(locationId: number) {
        this.router.navigate(
            [
                '/map',
                {
                    outlets: {
                        popup: ['resumeLocation'],
                    },
                },
            ],
            {
                queryParams: {
                    locationId: locationId,
                },
            }
        );
    }

    onGeolocate(position: GeolocationPosition) {
        console.log('geolocate', position);
    }
}
