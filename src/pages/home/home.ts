import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';

import { UsuarioProvider } from '../../providers/usuario/usuario';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              private _up: UsuarioProvider,
              private afAuth: AngularFireAuth) {
                console.log(JSON.stringify(_up.usuario));

                this.afAuth.authState.subscribe(user => {
                  console.log("AFAUTH!!!");
                  console.log(JSON.stringify(user));
                });
              }

  salir(){
    this.afAuth.auth.signOut().then( resp => {
      this._up.usuario = {};
      this.navCtrl.setRoot(LoginPage);
    });
  }
}
