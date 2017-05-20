import {Component, OnInit} from '@angular/core';

import {AuthService} from '../providers/auth.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

    private userDisplayName: String;

    constructor(public authService: AuthService) {
        this.authService.afAuth.auth.onAuthStateChanged((auth) => {
            if (auth == null) {
                // not logged in
                this.userDisplayName = '';
            } else {
                // logged in
                this.userDisplayName = auth.displayName;
            }
        });
    }

    ngOnInit() {
    }

}
