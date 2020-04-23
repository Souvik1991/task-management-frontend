import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HeaderComponent } from './header/header.component';
import { ProjectComponent } from './project/project.component';
import { TasksComponent } from './tasks/tasks.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { SidenavService } from './service/sidenav.service';
import { MathcesTaskPipe } from './task-filter.pipe';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		ProjectComponent,
		TasksComponent,
		ProjectDetailsComponent,
		MathcesTaskPipe
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatToolbarModule,
		// MatCardModule,
		MatButtonModule,
		HttpClientModule,
		MatIconModule,
		MatSidenavModule,
		MatFormFieldModule,
		MatDatepickerModule,
		MatInputModule,
		MatNativeDateModule,
		FormsModule,
		ReactiveFormsModule,
		MatSnackBarModule,
		MatSelectModule
	],
	providers: [SidenavService],
	bootstrap: [AppComponent]
})
export class AppModule { }
