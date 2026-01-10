import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { CreateGroup } from './pages/create-group/create-group';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
  },
  {
    path: 'group/create',
    component: CreateGroup,
  },
];
