import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PacientesService } from './pacientes.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from "ngx-bootstrap/modal";
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { CpfMaskDirective } from './cpf-mask.directive';

@NgModule({
  declarations: [
    AppComponent,
    PacientesComponent,
    CpfMaskDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule, 
    HttpClientModule,
    ReactiveFormsModule,
    ModalModule.forRoot()
  ],
  providers: [HttpClientModule, PacientesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
