import {Component, OnInit, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../providers/auth.service';
import {Router} from '@angular/router';


@Component({
    selector: 'app-friend-requests',
    templateUrl: './friend-requests.component.html',
    styleUrls: ['./friend-requests.component.css']
})
export class FriendRequestsComponent implements OnInit, OnDestroy {

    private limit: BehaviorSubject<number> = new BehaviorSubject<number>(10); // import 'rxjs/BehaviorSubject';
    private requestsArray: FirebaseListObservable<any>;
    private requestsArraySubscription: Subscription;
    private lastKey: String;
    private canLoadMoreData: boolean;
    private lastKeySubscription: Subscription;
    private userUID: string;

    constructor(public authService: AuthService, private db: AngularFireDatabase, private router: Router) {
    }


    ngOnInit() {
        this.authService.afAuth.auth.onAuthStateChanged((auth) => {
            if (auth != null) {
                this.userUID = auth.uid;
                // asyncronously find the last item in the list
                this.lastKeySubscription = this.db.list('/friend-requests/' + auth.uid, {
                    query: {
                        orderByChild: 'time-sent',
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

                this.requestsArray = this.db.list('/friend-requests/' + auth.uid, {
                    query: {
                        orderByChild: 'time-sent',
                        limitToLast: this.limit // Start at 10 newest items
                    }
                });


                this.requestsArraySubscription = this.requestsArray.subscribe((data) => {
                    this.updateCanLoadState(data);
                });

                window.onscroll = () => {
                    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                        // Reached the bottom of the page
                        this.tryToLoadMoreData();
                    }
                };
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

    private acceptRequest(request): void {
        console.log(request);
        // Add Friend
        let currDate: Date;
        currDate = new Date();
        currDate.setTime(currDate.getTime() + currDate.getTimezoneOffset() * 60 * 1000);
        let friendObject: FirebaseObjectObservable<any>;
        friendObject = this.db.object('/friend-lists/' + this.userUID + '/' + request['uid']);
        friendObject.set({
            'chat-key': request['chat-key'],
            'display-name': request['display-name'],
            'email': request['email'],
            'last-interacted': currDate.getTime(),
            'uid': request['uid']
        });
        // Delete Request
        let requestObject: FirebaseObjectObservable<any>;
        requestObject = this.db.object('/friend-requests/' + this.userUID + '/' + request['uid']);
        requestObject.set(null);
    }


    private navigateTo(route) {
        this.router.navigate([route]);
    }

    ngOnDestroy(): void {
        this.requestsArraySubscription.unsubscribe();
        this.lastKeySubscription.unsubscribe();
        window.onscroll = () => {
            // Clearing onscroll implementation (may not be necessary)
        };
    }

}
