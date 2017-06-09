import {Component, OnInit, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../providers/auth.service';
import {Router} from '@angular/router';



@Component({
    selector: 'app-friend-requests',
    templateUrl: './friend-requests.component.html',
    styleUrls: ['./friend-requests.component.css']
})
export class FriendRequestsComponent implements OnInit, OnDestroy {
    ngOnDestroy(): void {
    }

    constructor(public authService: AuthService, private db: AngularFireDatabase, private router: Router) {
    }

    private navigateTo(route) {
        this.router.navigate([route]);
    }

    ngOnInit() {
    }

}
