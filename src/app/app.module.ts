import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCloXIl-mmXbrze4z_-rsb-JGq_USy_rF8",
  authDomain: "loginapp-81633.firebaseapp.com",
  databaseURL: "https://loginapp-81633.firebaseio.com",
  projectId: "loginapp-81633",
  storageBucket: "",
  messagingSenderId: "902706231109"
};

//Plugins
//facebook
import { Facebook } from '@ionic-native/facebook';
//google
import { GooglePlus } from '@ionic-native/google-plus';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { UsuarioProvider } from '../providers/usuario/usuario';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsuarioProvider,
    Facebook,
    GooglePlus
  ]
})
export class AppModule {}
