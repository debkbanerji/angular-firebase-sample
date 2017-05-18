import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

import {AngularFireModule} from 'angularfire2';
import {AngularFireAuth} from 'angularfire2/auth';

import {AppComponent} from './app.component';
import {AuthService} from './providers/auth.service';
import {LoginPageComponent} from './login-page/login-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {config} from './config/firebase-config';
import { NavBarComponent } from './nav-bar/nav-bar.component';

const routes: Routes = [ // Array of all routes - modify when adding routes
    {path: '', component: HomePageComponent}, // Default route
    {path: 'login', component: LoginPageComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        HomePageComponent,
        NavBarComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AngularFireModule.initializeApp(config),
        RouterModule.forRoot(routes)
    ],
    providers: [AuthService, AngularFireAuth],
    bootstrap: [AppComponent]
})
export class AppModule {
}
