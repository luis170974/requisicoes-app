import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { environment } from 'src/environments/environment';
import { LoginComponent } from './auth/login/login.component';
import { AuthenticationService } from './auth/services/authentication.service';
import { PainelComponent } from './painel/painel.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DepartamentoModule } from './departamentos/departamento.module';
import { EquipamentoModule } from './equipamentos/equipamento.module';
import { ToastrModule } from 'ngx-toastr';

import { FuncionarioModule } from './funcionarios/funcionario.module';
import { RequisicaoModule } from './requisicoes/requisicao.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PainelComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    
    

    DepartamentoModule,
    EquipamentoModule,
    FuncionarioModule,
    RequisicaoModule
  ],
  providers: [AuthenticationService,
    { provide: LOCALE_ID, useValue: "pt" },
    { provide: DEFAULT_CURRENCY_CODE, useValue: "BRL" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
