import { Routes } from '@angular/router';
import { CraAgentsComponent } from './components/cra-agents/cra-agents.component';
import { CommandementComponent } from './components/commandement/commandement.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cra',
    pathMatch: 'full',
  },
  {
    path: 'cra',
    loadComponent: () => import('./components/cra-agents/cra-agents.component').then(m => m.CraAgentsComponent),
  },
  {
    path: 'commandement',
    loadComponent: () => import('./components/commandement/commandement.component').then(m => m.CommandementComponent),
  },
];