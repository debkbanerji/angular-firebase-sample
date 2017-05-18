import {Component, OnInit, ApplicationRef} from '@angular/core';

import {AuthService} from '../providers/auth.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
    private isLoggedIn: boolean;

    constructor(public authService: AuthService, private apRef: ApplicationRef) {
        this.authService.afAuth.auth.onAuthStateChanged((auth) => {
            this.isLoggedIn = auth != null;
            this.apRef.tick(); // For updating UI
        });
    }

    ngOnInit() {
    }

    logout() {
        this.authService.logout();
    }
}
