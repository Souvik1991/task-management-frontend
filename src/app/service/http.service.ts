import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Project } from '../module/task.module'; 

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	constructor(private http: HttpClient) {
	}

	getAllUsers(): Observable<any> {
		return this.http.get<Project[]>(`${environment.apiUrl}users/`).pipe();
	}

	getAllProjects(): Observable<any> {
		return this.http.get<Project[]>(`${environment.apiUrl}project/`).pipe();
	}

	createProject(d): Observable<any> {
		return this.http.post(`${environment.apiUrl}project/`, d).pipe();
	}

	updateProject(d, pid:Number): Observable<any> {
		return this.http.put(`${environment.apiUrl}project/${pid}/`, d).pipe();
	}

	deleteProject(pid:Number): Observable<any> {
		return this.http.delete(`${environment.apiUrl}project/${pid}/`).pipe();
	}

	getProjectDetails(pid:Number): Observable<any> {
		return this.http.get(`${environment.apiUrl}project/${pid}/`).pipe();
	}

	getTasks(pid:Number): Observable<any> {
		return this.http.get(`${environment.apiUrl}task/${pid}/`).pipe();
	}

	getTask(pid:Number, tid:Number): Observable<any> {
		return this.http.get(`${environment.apiUrl}task/${pid}/${tid}/`).pipe();
	}

	createTask(d, pid:Number): Observable<any> {
		return this.http.post(`${environment.apiUrl}task/${pid}/`, d).pipe();
	}

	toogleCompleted(pid:Number, tid:Number): Observable<any> {
		return this.http.post(`${environment.apiUrl}task/${pid}/${tid}/`, {}).pipe();
	}

	updateTask(d, pid:Number, tid:Number): Observable<any> {
		return this.http.put(`${environment.apiUrl}task/${pid}/${tid}/`, d).pipe();
	}

	deleteTask(pid:Number, tid:Number): Observable<any> {
		return this.http.delete(`${environment.apiUrl}task/${pid}/${tid}/`).pipe();
	}
}
