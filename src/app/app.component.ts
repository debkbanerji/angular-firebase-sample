import {Component} from '@angular/core';

import {Router} from '@angular/router';

import {AuthService} from './providers/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    private isLoggedIn: boolean;
    private user_displayName: String;
    private user_Email: String;

    constructor(public authService: AuthService, private router: Router) {
        this.authService.afAuth.auth.onAuthStateChanged((auth) => {
            if (auth == null) {
                // not logged in
                this.isLoggedIn = false;
                this.user_displayName = '';
                this.user_Email = '';
                // redirect to login page
                this.router.navigate(['login']);
            } else {
                // logged in
                this.isLoggedIn = true;
                // navigate to default route
                this.user_displayName = auth.displayName;
                this.user_Email = auth.email;
                this.router.navigate(['']);
            }
        });
    }

    // logout() {
    //   this.isLoggedIn = false;
    //   this.authService.logout();
    //   this.router.navigate(['login']);
    //   // console.log('logging out');
    // }
}
