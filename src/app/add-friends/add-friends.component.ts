import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
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
    private friendObject: FirebaseObjectObservable<any>;
    private checkFriendSubscription: Subscription;
    private friendProfileObject: FirebaseObjectObservable<any>;
    private friendProfileSubscription: Subscription;

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
            this.friendObject = this.db.object('friend-lists/' + this.userUID + '/' + friendUID);
            this.checkFriendSubscription = this.friendObject.subscribe((data) => {
                if (data.$value !== null) {
                    this.searchText = 'Friend request already sent';
                    console.log(data);
                } else {
                    // TODO: Send Friend Request
                    this.searchText = 'Friend request sent';
                    const chatKey = this.makeChat(friendUID, this.userUID);

                    this.checkFriendSubscription.unsubscribe();
                    this.friendProfileObject = this.db.object('user-profiles/' + friendUID);
                    this.friendProfileSubscription = this.friendProfileObject.subscribe((friendData) => {
                        friendData['chat-key'] = chatKey;
                        let friendRequestObject;
                        this.friendObject.set(friendData);
                        friendData['accepted'] = false;
                        friendRequestObject = this.db.object('friend-requests/' + this.userUID + '/' + friendUID);
                        friendRequestObject.set(friendData);

                        this.friendProfileSubscription.unsubscribe();
                        this.checkFriendSubscription.unsubscribe();
                    });
                }
            });
        }
    }


    private makeChat(uid1, uid2) {
        if (uid1 > uid2) {
            let temp;
            temp = uid1;
            uid1 = uid2;
            uid2 = temp;
        }
        let chatKey;
        chatKey = this.db.list('/chats').push({
            uid1: uid1,
            uid2: uid2
        }).key;
        // console.log(chatKey);
        return chatKey;
    }

    ngOnDestroy(): void {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
        if (this.checkFriendSubscription) {
            this.checkFriendSubscription.unsubscribe();
        }
        if (this.friendProfileSubscription) {
            this.friendProfileSubscription.unsubscribe();
        }
    }
}
