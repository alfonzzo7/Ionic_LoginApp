import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { LoadingController, AlertController } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { UsuarioProvider } from '../../providers/usuario/usuario';

import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loader:any;

  constructor(private navCtrl: NavController,
              private afAuth: AngularFireAuth,
              private afDB: AngularFirestore,
              private _up: UsuarioProvider,
              private platform: Platform,
              private fb: Facebook,
              private googlePlus: GooglePlus,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,) {}

  cargando(){
    this.loader = this.loadingCtrl.create({
      content: "Cargando..."
    });
    this.loader.present();
  }

  signInWithFacebook() {
    this.cargando();

    if (this.platform.is('cordova')) {
      this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential)
                .then(user => {
                  console.log(JSON.stringify(user));

                  this.afDB.collection("/users", ref => ref.where('email', '==', user.providerData[0].email))
                      .valueChanges()
                      .subscribe((usuario:any[]) => {
                        console.log(JSON.stringify(usuario));
                        if(usuario.length > 0){
                            this._up.cargarUsuario(user.displayName, user.providerData[0].email, user.photoURL, user.uid, "facebook");
                            this.navCtrl.setRoot(HomePage);
                            this.loader.dismiss();
                        }else{
                          firebase.auth().currentUser.delete().then(() => {
                            this.mensaje("Error", "No tiene permisos para acceder, intentelo con otra cuenta o contacte con los administradores de la aplicación");
                            this.loader.dismiss();
                          }).catch(e => console.error("Error al eliminar usuario en firebase" + JSON.stringify(e)));
                        }
                      });

                }).catch(e => console.error("Error con el login de Facebook " + JSON.stringify(e)));
      })
    }else{
      this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
          console.log(res);
          let user = res.user;

          this.afDB.collection("/users", ref => ref.where('email', '==', res.additionalUserInfo.profile["email"]))
              .valueChanges()
              .subscribe((usuario:any[]) => {
                console.log(usuario);
                if(usuario.length > 0){
                    this._up.cargarUsuario(user.displayName, res.additionalUserInfo.profile["email"], user.photoURL, user.uid, "facebook");
                    this.navCtrl.setRoot(HomePage);
                    this.loader.dismiss();
                }else{
                  firebase.auth().currentUser.delete().then(() => {
                    this.mensaje("Error", "No tiene permisos para acceder, intentelo con otra cuenta o contacte con los administradores de la aplicación");
                    this.loader.dismiss();
                  }).catch(e => console.error("Error al eliminar usuario en firebase", e));
                }
              });

        });
    }
  }

  singInGoogle(){
    this.cargando();

    if (this.platform.is('cordova')) {
      this.googlePlus.login({
        'webClientId': '902706231109-rtkppj9nrqu5mf9jcmbl01jkqeui6nj3.apps.googleusercontent.com',
        'offline': true
      }).then( res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
        .then( user => {
          console.log("Firebase success: " + JSON.stringify(user));


          this.afDB.collection("/users", ref => ref.where('email', '==', user.providerData[0].email))
              .valueChanges()
              .subscribe((usuario:any[]) => {
                console.log(JSON.stringify(usuario));
                if(usuario.length > 0){
                    this._up.cargarUsuario(user.displayName, user.providerData[0].email, user.photoURL, user.uid, "google");
                    this.navCtrl.setRoot(HomePage);
                    this.loader.dismiss();
                }else{
                  firebase.auth().currentUser.delete().then(() => {
                    this.mensaje("Error", "No tiene permisos para acceder, intentelo con otra cuenta o contacte con los administradores de la aplicación");
                    this.loader.dismiss();
                  }).catch(e => console.error("Error al eliminar usuario en firebase" + JSON.stringify(e)));
                }
              });

        })
        .catch( error => console.log("Firebase failure: " + JSON.stringify(error)));
      }).catch(err => console.error("Error: " + JSON.stringify(err)));
    }else{
      var provider = new firebase.auth.GoogleAuthProvider();

      provider.addScope('https://www.googleapis.com/auth/plus.login');
      provider.addScope('email');

      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          console.log(res);
          let user = res.user;

          this.afDB.collection("/users", ref => ref.where('email', '==', res.additionalUserInfo.profile["email"]))
              .valueChanges()
              .subscribe((usuario:any[]) => {
                console.log(usuario);
                if(usuario.length > 0){
                    this._up.cargarUsuario(user.displayName, res.additionalUserInfo.profile["email"], user.photoURL, user.uid, "facebook");
                    this.navCtrl.setRoot(HomePage);
                    this.loader.dismiss();
                }else{
                  firebase.auth().currentUser.delete().then(() => {
                    this.mensaje("Error", "No tiene permisos para acceder, intentelo con otra cuenta o contacte con los administradores de la aplicación");
                    this.loader.dismiss();
                  }).catch(e => console.error("Error al eliminar usuario en firebase", e));
                }
              });

        });
    }
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  mensaje(title:string, subTitle:string){
    this.alertCtrl.create({
      title:title,
      subTitle:subTitle,
      buttons:["Aceptar"]
    }).present();
  }

}
