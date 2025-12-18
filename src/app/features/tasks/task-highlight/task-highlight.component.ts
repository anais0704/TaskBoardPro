import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Task } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-highlight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-highlight.component.html',
  styleUrls: ['./task-highlight.component.scss']
})
export class TaskHighlightComponent {
  @Input() task!: Task;
}


