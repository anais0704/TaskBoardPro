import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'TaskBoard Pro | Home'
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'TaskBoard Pro | About'
  },
  {
    path: 'tasks',
    loadComponent: () => import('./tasks-page/tasks-page.component').then(m => m.TasksPageComponent),
    title: 'TaskBoard Pro | Tasks'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
