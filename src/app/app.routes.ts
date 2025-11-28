import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'TaskBoard Pro | Home'
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent),
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
