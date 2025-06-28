import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { AddLocationComponent } from './add-location/add-location.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PrivacySettingsComponent } from './privacy-settings/privacy-settings.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { CloseSesionComponent } from './close-sesion/close-sesion.component';

export const routes: Routes = [
    {
        path: '',
        component: WelcomeComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'map',
        component: MapComponent,
        children: [
            {
                path: 'addLocation',
                outlet: 'popup',
                component: AddLocationComponent,
            },
            {
                path: 'changePassword',
                outlet: 'popup',
                component: ChangePasswordComponent,
            },
            {
                path: 'editProfile',
                outlet: 'popup',
                component: EditProfileComponent,
            },
            {
                path: 'privacySettings',
                outlet: 'popup',
                component: PrivacySettingsComponent,
            },
            {
                path: 'deleteConfirmation',
                outlet: 'popup',
                component: DeleteConfirmationComponent,
            },
            {
                path: 'closeSesion',
                outlet: 'popup',
                component: CloseSesionComponent,
            },
        ],
    },
];
