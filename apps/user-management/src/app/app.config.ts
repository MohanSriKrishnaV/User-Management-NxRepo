import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { API_URL } from 'users-data-access';
import { environment } from './environments/environments';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import {
  usersFeature,
  UsersEffects,
} from 'users-data-access';
import { authFeature, AuthEffects } from 'data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: API_URL,
      useValue: environment.apiUrl,
    },
    provideStore(),
    provideState(usersFeature),
    provideState(authFeature),
    provideEffects(UsersEffects, AuthEffects),
    
  ]
};
