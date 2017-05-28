import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {AuthService} from '../providers/auth.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-add-friends',
    templateUrl: './add-friends.component.html',
    styleUrls: ['./add-friends.component.css']
})
export class AddFriendsComponent implements OnInit, OnDestroy {
    private searchText: string;
    private searchResults: FirebaseListObservable<any[]>;
    private searchSubscription: Subscription;
    private userUID: string;

    constructor(public authService: AuthService, private db: AngularFireDatabase) {
    }

    ngOnInit() {
        this.authService.afAuth.auth.onAuthStateChanged((auth) => {
            if (auth == null) {
                // not logged in
                this.userUID = '';
            } else {
                // logged in
                this.userUID = auth.uid;
            }
        });
    }

    private onSearch(form: NgForm) {
        this.searchText = null;
        if (form.valid) {
            this.searchResults = this.db.list('user-profiles', {
                query: {
                    orderByChild: 'email',
                    equalTo: form.value.email,
                }
            });

            this.searchSubscription = this.searchResults.subscribe((data) => {
                if (data.length <= 0) {
                    this.searchText = 'No results found';
                }
            });
        } else {
            this.searchText = 'Please input a valid email address';
        }
    }

    private sendFriendRequest(friendUID) {
        console.log(friendUID);
        if (this.userUID === friendUID) {
            this.searchText = 'You can\'t send a friend request to yourself';
        } else {
            // TODO: Send Friend Request
        }
    }

    ngOnDestroy(): void {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
    }
}
