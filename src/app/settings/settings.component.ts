import {Component, OnInit, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database';

import {AuthService} from '../providers/auth.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    private userEmail: String;

    private updateDisplayNameText: string;
    private displayNameObject: FirebaseObjectObservable<any>;

    constructor(public authService: AuthService, private db: AngularFireDatabase) {
    }

    ngOnInit() {
        this.authService.afAuth.auth.onAuthStateChanged((auth) => {
            if (auth != null) {
                this.userEmail = auth.email;
                this.displayNameObject = this.db.object('/user-profiles/' + auth.uid + '/display-name');
            }
        });
    }

    upDateDisplayName(form: NgForm) {
        if (form.valid) {
            this.displayNameObject.set(form.value.newDisplayName);
            form.resetForm();
            this.updateDisplayNameText = 'Successfully updated display name';
        } else {
            this.updateDisplayNameText = 'Please fill out all the required data';
        }
    }

}
