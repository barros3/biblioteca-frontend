import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AssuntoComponent } from './component/assunto/assunto.component';
import { ModalCadastrarAssuntoComponent } from './component/assunto/modal.cadastrar.assunto.component';
import { AutorComponent } from './component/autor/autor.component';
import { ModalCadastrarAutorComponent } from './component/autor/modal.cadastrar.autor.component';
import { LivroComponent } from './component/livro/livro.component';
import { ModalCadastrarLivroComponent } from './component/livro/modal.cadastrar.livro.component';
import { ModalerrorComponent } from './modalerror/modalerror.component';
import { FilterPipe } from './pipe.filter';

@NgModule({
  declarations: [
    AppComponent,
    AssuntoComponent,
    ModalCadastrarAssuntoComponent,
    AutorComponent,
    ModalCadastrarAutorComponent,
    LivroComponent,
    ModalCadastrarLivroComponent,
    ModalerrorComponent,
    FilterPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatDialogModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
  ],
  providers: [Router],
  bootstrap: [AppComponent]
})
export class AppModule { }
