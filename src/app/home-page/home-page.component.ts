import {Component, OnInit} from '@angular/core';
import {AuthService} from '../providers/auth.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

    public displayName: string;
    public LOGO_URL: any;

    constructor(public authService: AuthService) {
    }

    ngOnInit() {
        // TODO: Replace
        this.LOGO_URL = '/assets/images/logo.png';
        this.authService.afAuth.auth.onAuthStateChanged((auth) => {
            if (auth != null) {
                this.displayName = auth.displayName;
            }
        });
    }

}
