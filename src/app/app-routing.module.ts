import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectComponent } from './project/project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [
	{path: '', component: ProjectComponent},
	{path: 'project/:pid', component: ProjectDetailsComponent},
	{path: 'project/:pid/task/:tid', component: TasksComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {
		onSameUrlNavigation: 'reload'
	})],
	exports: [RouterModule]
})
export class AppRoutingModule { }
