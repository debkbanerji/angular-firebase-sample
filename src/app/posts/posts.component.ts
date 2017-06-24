import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database';
import *as firebase from 'firebase';

import {AuthService} from '../providers/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Ng2FileInputComponent} from "ng2-file-input";

@Component({
    selector: 'app-text-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {
    @ViewChild(Ng2FileInputComponent) fileInputComponent: Ng2FileInputComponent;

    private PAGE_SIZE = 10;
    private limit: BehaviorSubject<number> = new BehaviorSubject<number>(this.PAGE_SIZE); // import 'rxjs/BehaviorSubject';
    private feedLocation: string;
    public postsArray: FirebaseListObservable<any>;
    private postsArraySubscription: Subscription;
    private lastKey: String;
    private lastKeySubscription: Subscription;
    public numPostsObject: FirebaseObjectObservable<any>;
    public canLoadMoreData: boolean;
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

        // Set up file input component
        this.fileInputComponent.showPreviews = false; // Set to true to show previews of uploaded images
        this.fileInputComponent.extensions = ['jpg','jpeg', 'png', 'svg', 'img'];
        this.fileInputComponent.multiple = true;
        this.fileInputComponent.dropText = 'Drop Image to Upload';
        this.fileInputComponent.invalidFileText = 'Please upload an image file';

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
            const oldestItemIndex = 0;
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
            currDate.setTime(currDate.getTime() + currDate.getTimezoneOffset() * 60 * 1000); // For internationalization purposes
            let timestamp = currDate.getTime();

            let post = {
                'title': form.value.title,
                'text': form.value.text,
                'poster-display-name': this.userDisplayName,
                'poster-uid': this.userUID,
                'datetime': timestamp
            };

            let component = this; // For accessing within promise
            if (this.fileInputComponent.currentFiles.length > 0) {
                let image = this.fileInputComponent.currentFiles[0]; // Input is limited to one file - can be changed in view
                let imageRef = firebase.storage().ref().child('/users/' + this.userUID + '/' + timestamp);
                // Unique path as one user cannot upload multiple files at the exact same time

                imageRef.put(image).then(function (snapshot) {
                    // Remove image from form
                    component.removeImage(image);
                    // Add image URL, then push post
                    post['image-url'] = snapshot.downloadURL;
                    component.postsArray.push(post);
                    component.onPostSuccess(form);
                }).catch(function(error) {
                    console.log(error)
                });
            } else {
                // Push without uploading image
                component.postsArray.push(post);
                component.onPostSuccess(form);
            }


        } else {
            this.submitText = 'Please fill out all the required data';
        }
    }

    private onPostSuccess(form: NgForm) {
        this.numPostsObject.$ref.transaction(data => {
            return data + 1;
        });
        form.resetForm();
        this.submitText = 'Successfully made post';
    }

    private removeImage(file) {
        this.fileInputComponent.removeFile(file);
    }

    public removePost(post) {
        this.postsArray.remove(post.$key);
        if (post['image-url']) {
            // There is an associated image that needs to be deleted
            let storage = firebase.storage();
            let imageReference = storage.refFromURL(post['image-url']);
            imageReference.delete().then(function() {
                // File deleted successfully
            }).catch(function(error) {
                console.log(error)
            });
        }
        this.numPostsObject.$ref.transaction(data => {
            return data - 1;
        });
    }

    ngOnDestroy() {
        this.lastKeySubscription.unsubscribe();
        this.postsArraySubscription.unsubscribe();
        // window.onscroll = () => {
        //     // Clearing onscroll implementation (may not be necessary)
        // };
    }
}
