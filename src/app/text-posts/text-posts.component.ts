import {Component, OnInit, OnDestroy} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database';

import {AuthService} from '../providers/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
    selector: 'app-text-posts',
    templateUrl: './text-posts.component.html',
    styleUrls: ['./text-posts.component.css']
})
export class TextPostsComponent implements OnInit, OnDestroy {
    private numPostsSubscription: Subscription;
    private numPostsObject: FirebaseObjectObservable<any>;
    private numPosts: number;

    private limit: BehaviorSubject<number> = new BehaviorSubject<number>(10); // import 'rxjs/BehaviorSubject';
    private postsArray: FirebaseListObservable<any>;
    private postsArraySubscription: Subscription;
    private lastKey: String;
    private canLoadMoreData: boolean;
    private lastKeySubscription: Subscription;

    private submitText: String;
    private userDisplayName: String;
    private userUID: String;

    formatDate(millis) {
        const date = new Date(millis);
        return date.toLocaleString();
    }


    constructor(public authService: AuthService, private db: AngularFireDatabase) {
    }

    ngOnInit() {
        this.submitText = '';
        const feedLocation = '/text-posts';
        this.numPostsObject = this.db.object(feedLocation + '/num-posts', {preserveSnapshot: true});
        this.numPostsSubscription = this.numPostsObject.subscribe(snapshot => {
            let val = snapshot.val();
            if (!val) {
                val = 0;
            }
            this.numPosts = val;
        });

        // asyncronously find the last item in the list
        this.lastKeySubscription = this.db.list(feedLocation + '/posts', {
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


        this.postsArray = this.db.list(feedLocation + '/posts', {
            query: {
                orderByChild: 'datetime',
                limitToLast: this.limit // Start at 10 newest items
            }
        });


        this.postsArraySubscription = this.postsArray.subscribe((data) => {
            this.updateCanLoadState(data);
        });


        this.authService.afAuth.auth.onAuthStateChanged((auth) => {
            if (auth == null) {
                // not logged in
                this.userDisplayName = '';
                this.userUID = '';
            } else {
                // logged in
                this.userDisplayName = auth.displayName;
                this.userUID = auth.uid;
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

    loadMoreData(): void {
        if (this.canLoadMoreData) {
            this.limit.next(this.limit.getValue() + 10);
        }
    }

    ngOnDestroy() {
        this.numPostsSubscription.unsubscribe();
        this.lastKeySubscription.unsubscribe();
        this.postsArraySubscription.unsubscribe();
    }

    onSubmit(form: NgForm) {
        if (form.valid) {
            this.postsArray.push(
                {
                    'title': form.value.title,
                    'text': form.value.text,
                    'poster-displayname': this.userDisplayName,
                    'poster-uid': this.userUID,
                    'datetime': Date.now()
                });
            form.resetForm();
            this.submitText = 'Successfully made post';
            this.numPostsObject.set(this.numPosts + 1);
        } else {
            this.submitText = 'Please fill out all the required data';
        }
    }

    removePost(key) {
        this.postsArray.remove(key);
        this.numPostsObject.set(this.numPosts - 1);
    }
}
