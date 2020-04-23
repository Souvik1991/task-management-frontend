import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { environment } from '../../environments/environment';

import { HttpService } from '../service/http.service';
import { SidenavService } from '../service/sidenav.service';
import { ProjectDetails, Project, Tasks, User, TaskDialogData } from '../module/task.module';

@Component({
	selector: 'dialog-example',
	templateUrl: 'dialog-example.html',
})
export class DialogOverviewDialog {
	constructor(
		private HttpService: HttpService,
		private snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<DialogOverviewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: TaskDialogData) {}

	onNoClick(): void {
		this.dialogRef.close();
	}
	deleteProject(){
		this.HttpService.deleteTask(this.data.pid, this.data.tid).subscribe(() => {
			this.dialogRef.close();
			this.snackBar.open('The selected task and all subtasks under it has been deleted successfully.', 'okay', {duration: 5000, horizontalPosition: 'left', verticalPosition: 'bottom'});
			this.data.cb();
		})
	}
}

@Component({
	selector: 'app-project-details',
	templateUrl: './project-details.component.html',
	styleUrls: ['./project-details.component.less']
})
export class ProjectDetailsComponent implements OnInit {
	projectId: Number;
	projectDetails: Project;
	allUsers: User[] = [];
	allTasks: Tasks[] = [];
	parentTasks: Tasks[] = [];
	path: String;
	pform: FormGroup;
	startDate: Date;
	selectedTaskId: Number;
	@ViewChild('tasknav') public snav: MatSidenav;
	
	constructor(
		private route: ActivatedRoute,
		private HttpService: HttpService,
		private snackBar: MatSnackBar,
		private sidenav: SidenavService,
		private formBuilder: FormBuilder,
		public dialog: MatDialog
	) {}

	customFormat(date){
		return date ? formatDate(date, 'dd, MMM yyyy', 'en-US') : "";
	}

	openSideBar(){
		var arr = ['tname', 'tdesc', 'sdate', 'edate', 'asigned', 'parent'],
			i = 0;
		for(; i<arr.length; i++){
			// console.log(arr[i]);
			this.pform.get(arr[i]).markAsUntouched();
		}
		this.pform.reset();
		this.pform.markAsUntouched();
		this.sidenav.toggle();
	}

	ngAfterViewInit(): void {
		// console.log(this.snav);
		this.sidenav.setSidenav(this.snav);
		// console.log(this.sidenav);
	}

	getTasks(){
		this.HttpService.getTasks(this.projectId).subscribe((res: Tasks[]) => {
			this.allTasks = res;
			var ptasks = [];
			res.map(el => {
				ptasks.push({
					id: el.id,
					name: el.name
				})
			});
			this.parentTasks = ptasks;
		})
	}

	editTask(task, parent){
		this.selectedTaskId = task.id;
		this.pform.get("tname").setValue(task.name);
		this.pform.get("tdesc").setValue(task.description);
		this.pform.get("sdate").setValue(new Date(task.start_date));
		this.pform.get("edate").setValue(new Date(task.end_date));
		this.pform.get("asigned").setValue(task.asigned_to.id);
		this.pform.get("parent").setValue(parent);
		this.startDate = new Date(task.start_date);
		this.sidenav.toggle();
	}

	deleteTask(task){
		this.dialog.open(DialogOverviewDialog, {
			data: {
				pid: this.projectId,
				tid: task.id, 
				cb: () => {
					this.getTasks();
				}
			}
		});
	}

	toogleCompleted(tid){
		this.HttpService.toogleCompleted(this.projectId, tid).subscribe(() => {
			this.getTasks();
		})
	}

	showError(error){
		for(var key in error.error)
			for(var i=0; i<error.error[key].length; i++)
				this.snackBar.open(`${key}: ${error.error[key][i]}`, 'okay', {duration: 5000, horizontalPosition: 'left', verticalPosition: 'bottom'});
	}

	onFormSubmit(){
		if(!this.pform.valid){
			this.pform.markAllAsTouched();
			return;
		}
		var parent = parseInt(this.pform.get('parent').value),
			dataObject = {
				project: this.projectId,
				name: this.pform.get('tname').value,
				description: this.pform.get('tdesc').value,
				start_date: formatDate(this.pform.get('sdate').value, 'yyyy-MM-dd', 'en-US'),
				end_date: formatDate(this.pform.get('edate').value, 'yyyy-MM-dd', 'en-US'),
				asigned_to: this.pform.get('asigned').value,
				parent_task: parent > -1 ? parent : 0
			};

		if(this.selectedTaskId){
			this.HttpService.updateTask(dataObject, this.projectId, this.selectedTaskId).subscribe((res: Tasks) => {
				this.selectedTaskId = undefined;
				this.startDate = new Date();
				this.getTasks();
				this.openSideBar();
				this.snackBar.open('The task data has been updated successfully.', 'okay', {duration: 5000, horizontalPosition: 'left', verticalPosition: 'bottom'});
			})
		}
		else{
			this.HttpService.createTask(dataObject, this.projectId).subscribe((res: Tasks) => {
				this.getTasks();
				this.openSideBar();
				this.snackBar.open('A new task has been successfully created.', 'okay', {duration: 5000, horizontalPosition: 'left', verticalPosition: 'bottom'});
			}, (error) => {
				this.showError(error);
			})
		}
	}

	ngOnInit(): void {
		this.startDate = new Date();
		this.path = environment.baseUrl;
		this.projectId = parseInt(this.route.snapshot.params.pid);
		this.projectDetails = {
			id: 0,
			name: '',
			description: '',
			start_date: '',
			end_date: '',
			avatar: undefined
		}
		this.HttpService.getAllUsers().subscribe((res: User[]) => {
			this.allUsers = res;
		});
		this.HttpService.getProjectDetails(this.projectId).subscribe((res: ProjectDetails) => {
			this.projectDetails = {
				id: res.id,
				name: res.name,
				description: res.description,
				start_date: res.start_date,
				end_date: res.end_date,
				avatar: res.avatar
			};
			this.allTasks = res.tasks;
			// console.log(this.allTasks);
			var ptasks = [];
			res.tasks.map(el => {
				ptasks.push({
					id: el.id,
					name: el.name
				})
			})
			this.parentTasks = ptasks;
		});

		this.pform = this.formBuilder.group({
			tname: [null, Validators.required],
			tdesc: [null, Validators.required],
			sdate: [null, Validators.required],
			edate: [null, Validators.required],
			asigned: [null, Validators.required],
			parent: [0, Validators.required],
		});
	}
}
