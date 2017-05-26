import {Component, OnInit, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../providers/auth.service';

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit, OnDestroy {

    private limit: BehaviorSubject<number> = new BehaviorSubject<number>(10); // import 'rxjs/BehaviorSubject';
    private friendListArray: FirebaseListObservable<any>;
    private friendListArraySubscription: Subscription;

    private lastKeySubscription: Subscription;
    private lastKey: string;
    private canLoadMoreData: boolean;


    constructor(public authService: AuthService, private db: AngularFireDatabase) {
    }

    ngOnInit() {
        this.authService.afAuth.auth.onAuthStateChanged((auth) => {
            if (auth != null) {
                // this.friendListArray = this.db.list('/friend-lists/' + auth.uid);


                // asyncronously find the last item in the list
                this.lastKeySubscription = this.db.list('/friend-lists/' + auth.uid, {
                    query: {
                        orderByChild: 'datetime',
                        limitToFirst: 1
                    }
                }).subscribe((data) => {
                    // Found the last key
                    if (data.length > 0) {
                        this.lastKey = data[0].$key;
                    } else {
                        this.lastKey = '';
                    }
                });

                this.friendListArray = this.db.list('/friend-lists/' + auth.uid, {
                    query: {
                        orderByChild: 'last-interacted',
                        limitToLast: this.limit // Start at 10 newest items
                    }
                });


                this.friendListArraySubscription = this.friendListArray.subscribe((data) => {
                    this.updateCanLoadState(data);
                });
            }
        });
    }

    private updateCanLoadState(data) {
        if (data.length > 0) {
            // If the first key in the list equals the last key in the database
            const oldestItemIndex = 0; // remember that the array is displayed in reverse
            this.canLoadMoreData = data[oldestItemIndex].$key !== this.lastKey;
        }
    }

    private tryToLoadMoreData(): void {
        if (this.canLoadMoreData) {
            this.limit.next(this.limit.getValue() + 10);
        }
    }

    ngOnDestroy(): void {
        this.friendListArraySubscription.unsubscribe();
        this.lastKeySubscription.unsubscribe();
    }
}
