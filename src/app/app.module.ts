import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

import {NgArrayPipesModule} from 'ngx-pipes';
import {Ng2FileInputModule} from 'ng2-file-input';

import {AngularFireModule} from 'angularfire2';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';

import {AppComponent} from './app.component';
import {AuthService} from './providers/auth.service';
import {LoginPageComponent} from './login-page/login-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {config} from './config/firebase-config';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {PostsComponent} from './posts/posts.component';
import {ProfileComponent} from './profile/profile.component';
import {FriendsComponent} from './friends/friends.component';
import {AddFriendsComponent} from './add-friends/add-friends.component';
import {FriendRequestsComponent} from './friend-requests/friend-requests.component';
import {ChatComponent} from './chat/chat.component';

const routes: Routes = [ // Array of all routes - modify when adding routes //TODO: Replace
    {path: '', component: HomePageComponent}, // Default route
    {path: 'login', component: LoginPageComponent},
    {path: 'posts', component: PostsComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'friends', component: FriendsComponent},
    {path: 'add-friends', component: AddFriendsComponent},
    {path: 'friend-requests', component: FriendRequestsComponent},
    {path: 'chat/:chat-key', component: ChatComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        HomePageComponent,
        NavBarComponent,
        PostsComponent,
        ProfileComponent,
        FriendsComponent,
        AddFriendsComponent,
        FriendRequestsComponent,
        ChatComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgArrayPipesModule,
        AngularFireModule.initializeApp(config),
        Ng2FileInputModule.forRoot(),
        RouterModule.forRoot(routes)
    ],
    providers: [AuthService, AngularFireAuth, AngularFireDatabase],
    bootstrap: [AppComponent]
})
export class AppModule {
}
