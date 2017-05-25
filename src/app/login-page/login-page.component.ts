import {Component, OnInit, OnDestroy} from '@angular/core';

import {Router} from '@angular/router';

import {AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database';

import {AuthService} from '../providers/auth.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
    private userDataSubscription: Subscription;
    // private userObject: FirebaseObjectObservable<any>;

    constructor(public authService: AuthService, private db: AngularFireDatabase, private router: Router) {
    }

    ngOnInit() {
    }

    loginWithGoogle() {
        this.authService.loginWithGoogle().then((loginData) => {
            this.authService.afAuth.auth.onAuthStateChanged((auth) => {
                if (auth != null) {
                    const address = '/user-profiles/' + auth.uid;
                    const userObject = this.db.object(address);
                    this.userDataSubscription = userObject.subscribe((data) => {
                        if (!data.$exists()) {
                            // New User - add data then redirect
                            this.userDataSubscription.unsubscribe();
                            userObject.set({
                                'uid': auth.uid,
                                'email': auth.email,
                                'display-name': auth.displayName
                            }).then(_ => this.router.navigate(['']));
                        } else {
                            // Old User - redirect without updating data
                            this.router.navigate(['']);
                        }
                    });
                }
            });
        });
    }

    ngOnDestroy() {
        this.userDataSubscription.unsubscribe();
    }
}
