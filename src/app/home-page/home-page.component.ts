import {Component, OnInit} from '@angular/core';

import {AuthService} from '../providers/auth.service';
import {AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
    private displayNameObject: FirebaseObjectObservable<any>;

    constructor(public authService: AuthService, private db: AngularFireDatabase) {
    }

    ngOnInit() {
        this.authService.afAuth.auth.onAuthStateChanged((auth) => {
            if (auth != null) {
                this.displayNameObject = this.db.object('/user-profiles/' + auth.uid + '/display-name');
            }
        });
    }

}
