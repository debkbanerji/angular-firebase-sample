import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database';

import {AuthService} from '../providers/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import *as firebase from 'firebase';

@Component({
    selector: 'app-text-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {
    private PAGE_SIZE = 10;
    private limit: BehaviorSubject<number> = new BehaviorSubject<number>(this.PAGE_SIZE); // import 'rxjs/BehaviorSubject';
    private feedLocation: string;
    public postsArray: FirebaseListObservable<any>;
    private postsArraySubscription: Subscription;
    private lastKey: String;
    private numPostsObject: FirebaseObjectObservable<any>;
    public canLoadMoreData: boolean;
    private lastKeySubscription: Subscription;

    public submitText: String;
    private userDisplayName: String;
    private userUID: String;

    formatDate(millis) {
        const date = new Date(millis);
        date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        return date.toLocaleString();
    }

    constructor(public authService: AuthService, private db: AngularFireDatabase) {
    }

    ngOnInit() {
        this.submitText = '';
        this.feedLocation = '/posts';
        this.numPostsObject = this.db.object(this.feedLocation + '/num-posts');

        // asyncronously find the last item in the list
        this.lastKeySubscription = this.db.list(this.feedLocation + '/posts', {
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


        this.postsArray = this.db.list(this.feedLocation + '/posts', {
            query: {
                orderByChild: 'datetime',
                limitToLast: this.limit // Start at this.PAGE_SIZE newest items
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

        // // automatically try to load more data when scrolling down
        // window.onscroll = () => {
        //     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        //         // Reached the bottom of the page
        //         this.tryToLoadMoreData();
        //     }
        // };

        // // Use this code to debug time zone differences
        // console.log((new Date()).getTimezoneOffset());
        // Date.prototype.getTimezoneOffset = function () {
        //     return -330;
        // };
    }

    private updateCanLoadState(data) {
        if (data.length > 0) {
            // If the first key in the list equals the last key in the database
            const oldestItemIndex = 0; // remember that the array is displayed in reverse
            this.canLoadMoreData = data[oldestItemIndex].$key !== this.lastKey;
        }
    }


    public tryToLoadMoreData(): void {
        if (this.canLoadMoreData) {
            this.limit.next(this.limit.getValue() + this.PAGE_SIZE);
        }
    }

    public onSubmit(form: NgForm) {
        if (form.valid) {
            let currDate: Date;
            currDate = new Date();
            currDate.setTime(currDate.getTime() + currDate.getTimezoneOffset() * 60 * 1000);
            this.postsArray.push(
                {
                    'title': form.value.title,
                    'text': form.value.text,
                    'poster-display-name': this.userDisplayName,
                    'poster-uid': this.userUID,
                    'datetime': currDate.getTime() // For internationalization purposes
                });

            console.log(form.value);
            let image = form.value.image;
            console.log(image);
            console.log(firebase);
            let imageRef = firebase.storage().ref().child('/' + this.userUID + '/' + currDate.getTime());
            // Unique path as one user cannot upload multiple files at the exact same time
            imageRef.put(image).then(function(snapshot) {
                console.log('Uploaded a blob or file!');
            });

            form.resetForm();
            this.submitText = 'Successfully made post';
            this.numPostsObject.$ref.transaction(data => {
                return data + 1;
            });
        } else {
            this.submitText = 'Please fill out all the required data';
        }
    }

    private removePost(key) {
        this.postsArray.remove(key);
        this.numPostsObject.$ref.transaction(data => {
            return data - 1;
        });
    }

    ngOnDestroy() {
        // this.userDataSubscription.unsubscribe();
        // this.numPostsSubscription.unsubscribe();
        this.lastKeySubscription.unsubscribe();
        this.postsArraySubscription.unsubscribe();
        // window.onscroll = () => {
        //     // Clearing onscroll implementation (may not be necessary)
        // };
    }
}
