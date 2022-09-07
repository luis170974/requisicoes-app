import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuncionarioRoutingModule } from './funcionario-routing.module';
import { FuncionarioComponent } from './funcionario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    FuncionarioComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    FuncionarioRoutingModule,
    NgSelectModule
  ]
})
export class FuncionarioModule { }
