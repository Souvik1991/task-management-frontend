import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';

import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

import { Project, DialogData } from '../module/task.module';
import { HttpService } from '../service/http.service';
import { SidenavService } from '../service/sidenav.service';

@Component({
	selector: 'app-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.less']
})
export class ProjectComponent implements OnInit {
	allProjects: Project[] = [];
	pform: FormGroup;
	logoFile: File;
	fileSelected: Number;
	selectedProjectId: Number;
	startDate = new Date();
	path = environment.baseUrl;
	
	@ViewChild('sidenav') public snav: MatSidenav;
	
	constructor(
		private HttpService: HttpService,
		private sidenav: SidenavService,
		private snackBar: MatSnackBar,
		private formBuilder: FormBuilder,
		public dialog: MatDialog
	) {}

	onFileSelected(image) {
		if(image.target.files.length > 0){
			this.logoFile = image.target.files[0];
			this.fileSelected = 1;
		}
		else{
			this.logoFile = undefined;
			this.fileSelected = 0;
		}
	}

	editProject(project){
		this.selectedProjectId = project.id;
		this.pform.get("pname").setValue(project.name);
		this.pform.get("pdesc").setValue(project.description);
		this.pform.get("sdate").setValue(new Date(project.start_date));
		this.pform.get("edate").setValue(new Date(project.end_date));
		this.startDate = new Date(project.start_date);
		this.sidenav.toggle();
	}

	deleteProject(project){
		this.dialog.open(DialogOverviewDialog, {
			data: {
				id: project.id, 
				cb: () => {
					this.getProjects();
				}
			}
		});
	}

	customFormat(date){
		return formatDate(date, 'dd, MMM yyyy', 'en-US');
	}

	showError(error){
		for(var key in error.error)
			for(var i=0; i<error.error[key].length; i++)
				this.snackBar.open(`${key}: ${error.error[key][i]}`, 'okay', {duration: 5000, horizontalPosition: 'left', verticalPosition: 'bottom'});
	}

	onFormSubmit() {
		if(!this.pform.valid){
			this.pform.markAllAsTouched();
			if(this.logoFile === undefined) this.fileSelected = 0;
			else this.fileSelected = 1;
			return;
		}
		else if(this.logoFile === undefined){
			const bar = this.snackBar.open(
				'Please select a file for avatar', 'close', 
				{duration: 2000, horizontalPosition: 'left', verticalPosition: 'bottom'}
			);
			bar.onAction().subscribe(() => {
				bar.dismiss();
			});
			this.fileSelected = 0;
			return;
		}
		var d = new FormData();
		d.append('name', this.pform.get('pname').value);
		d.append('description', this.pform.get('pdesc').value);
		d.append('start_date', formatDate(this.pform.get('sdate').value, 'yyyy-MM-dd', 'en-US'));
		d.append('end_date', formatDate(this.pform.get('edate').value, 'yyyy-MM-dd', 'en-US'));
		d.append('avatar', this.logoFile);
		
		if(this.selectedProjectId){
			this.HttpService.updateProject(d, this.selectedProjectId).subscribe((res: Project) => {
				this.logoFile = undefined;
				this.selectedProjectId = undefined;
				this.startDate = new Date();
				this.sidenav.toggle();
				this.pform.markAsUntouched();
				this.pform.reset();
				this.snackBar.open('A new project has been successfully created.', 'okay', {duration: 5000, horizontalPosition: 'left', verticalPosition: 'bottom'});
				this.getProjects();
			}, (error) => {
				this.showError(error);
			})
		}
		else{
			this.HttpService.createProject(d).subscribe((res: Project) => {
				this.sidenav.toggle();
				this.pform.markAsUntouched();
				this.pform.reset();
				this.logoFile = undefined;
				this.snackBar.open('A new project has been successfully created.', 'okay', {duration: 5000, horizontalPosition: 'left', verticalPosition: 'bottom'});
				this.getProjects();
			}, (error) => {
				this.showError(error);
			})
		}
	}

	getProjects(){
		this.HttpService.getAllProjects().subscribe((res: Project[]) => {
			this.allProjects = res;
		});
	}

	openSideBar(){
		this.pform.markAsUntouched();
		this.pform.reset();
		this.sidenav.toggle();
	}

	ngAfterViewInit(): void {
		// console.log(this.snav);
		this.sidenav.setSidenav(this.snav);
		// console.log(this.sidenav);
	}

	ngOnInit(): void {
		this.getProjects();

		this.pform = this.formBuilder.group({
			pname: [null, Validators.required],
			pdesc: [null, Validators.required],
			sdate: [null, Validators.required],
			edate: [null, Validators.required]
		});
	}
}

@Component({
	selector: 'dialog-example',
	templateUrl: 'dialog-example.html',
})
export class DialogOverviewDialog {
	constructor(
		private HttpService: HttpService,
		private snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<DialogOverviewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

	onNoClick(): void {
		this.dialogRef.close();
	}
	deleteProject(){
		this.HttpService.deleteProject(this.data.id).subscribe(() => {
			this.dialogRef.close();
			this.snackBar.open('The selected project has been deleted successfully.', 'okay', {duration: 5000, horizontalPosition: 'left', verticalPosition: 'bottom'});
			this.data.cb();
		})
	}
}