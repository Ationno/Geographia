import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideMapboxGL } from 'ngx-mapbox-gl';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import {
    provideClientHydration,
    withEventReplay,
} from '@angular/platform-browser';
import { dot } from 'node:test/reporters';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideMapboxGL({
            accessToken:
                'pk.eyJ1IjoiYXRpb25ubyIsImEiOiJjbWJzOXYzMngwaTlvMmlwbGptcjg5a2pxIn0.dBmqrvZVikhq_pj5475ZIg',
        }),
        provideAnimations(),
    ],
};
