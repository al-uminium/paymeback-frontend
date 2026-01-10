import { Component } from '@angular/core';
import { GroupForm } from '../../feature/group/group-form/group-form';

@Component({
  selector: 'app-create-group',
  imports: [GroupForm],
  templateUrl: './create-group.html',
  styleUrl: './create-group.css',
})
export class CreateGroup {}
