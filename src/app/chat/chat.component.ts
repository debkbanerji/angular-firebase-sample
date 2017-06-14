import {Component, OnInit, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../providers/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
    private userUID: string;
    private friendUID: string;
    private chatKey: string;
    private paramSubscription: Subscription;

    private deleteOldMessages = true; // Set to true if you do not want to save space by not maintaining message history
    private PAGE_SIZE = 20;
    private limit: BehaviorSubject<number> = new BehaviorSubject<number>(this.PAGE_SIZE); // import 'rxjs/BehaviorSubject';
    private messageListArray: FirebaseListObservable<any>;
    private messageListArraySubscription: Subscription;

    private lastKeySubscription: Subscription;
    private lastKey: string;
    private canLoadMoreData: boolean;
    private userDisplayName: string;

    constructor(public authService: AuthService, private db: AngularFireDatabase, private router: Router, private route: ActivatedRoute) {
    }

    formatDate(millis) {
        const date = new Date(millis);
        date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        return date.toLocaleString();
    }

    ngOnInit() {
        this.authService.afAuth.auth.onAuthStateChanged((auth) => {
            if (auth != null) {
                this.userUID = auth.uid;
                this.userDisplayName = auth.displayName;
            }
        });


        this.paramSubscription = this.route.params.subscribe(params => {
            this.chatKey = params['chat-key'];
            console.log(this.chatKey);

            // asyncronously find the last item in the list
            this.lastKeySubscription = this.db.list('chats/' + this.chatKey + '/messages', {
                query: {
                    orderByChild: 'post-time',
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

            this.messageListArray = this.db.list('chats/' + this.chatKey + '/messages', {
                query: {
                    orderByChild: 'post-time',
                    limitToLast: this.limit // Start at this.PAGE_SIZE newest items
                }
            });

            this.messageListArraySubscription = this.messageListArray.subscribe((data) => {
                this.updateCanLoadState(data);
            });

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
            this.limit.next(this.limit.getValue() + this.PAGE_SIZE);
        }
    }

    private sendMessage(form: NgForm): void {
        if (form.valid) {
            let currDate: Date;
            currDate = new Date();
            currDate.setTime(currDate.getTime() + currDate.getTimezoneOffset() * 60 * 1000);
            this.messageListArray.push(
                {
                    'text': form.value.text,
                    'poster-display-name': this.userDisplayName,
                    // 'poster-uid': this.userUID,
                    'post-time': currDate.getTime() // For internationalization purposes
                });
            form.resetForm();

            if (this.deleteOldMessages && Object.keys(this.messageListArray).length >= this.PAGE_SIZE) {
                this.db.object('chats/' + this.chatKey + '/messages' + this.lastKey).set(null);
            }
        }
    }

    ngOnDestroy() {
        this.paramSubscription.unsubscribe();
        this.lastKeySubscription.unsubscribe();
        this.messageListArraySubscription.unsubscribe();
    }
}
