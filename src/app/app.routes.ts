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
    loadComponent: () => import('./features/about/about/about.component').then(m => m.AboutComponent),
    title: 'TaskBoard Pro | About'
  },
  {
    path: 'tasks',
    loadChildren: () => import('./features/tasks/routes').then(m => m.TASKS_ROUTES),
    title: 'TaskBoard Pro | Tasks'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
