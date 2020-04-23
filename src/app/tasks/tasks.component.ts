import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { HttpService } from '../service/http.service';
import { Tasks } from '../module/task.module';

@Component({
	selector: 'app-tasks',
	templateUrl: './tasks.component.html',
	styleUrls: ['./tasks.component.less']
})
export class TasksComponent implements OnInit {
	projectId: Number;
	taskId: Number;
	taskDetails: Tasks;
	loaded: Boolean;

	constructor(
		private route: ActivatedRoute,
		private HttpService: HttpService,
	) {}

	customFormat(date){
		return date ? formatDate(date, 'dd, MMM yyyy', 'en-US') : "";
	}

	toogleCompleted(tid){
		this.HttpService.toogleCompleted(this.projectId, tid).subscribe(() => {
			this.getTaskDetails();
		})
	}

	getTaskDetails(){
		this.HttpService.getTask(this.projectId, this.taskId).subscribe((res: Tasks) => {
			this.loaded = true;
			this.taskDetails = res;
		})
	}

	ngOnInit(): void {
		this.projectId = parseInt(this.route.snapshot.params.pid);
		this.taskId = parseInt(this.route.snapshot.params.tid);
		this.loaded = false;
		this.getTaskDetails();
	}
}
