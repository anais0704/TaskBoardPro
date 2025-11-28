import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../core/services/task.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  private readonly taskService = inject(TaskService);
  readonly tasks$ = this.taskService.getTasks();

  newTask = { title: '', description: '' };
  showForm = false;

  addTask(): void {
    if (!this.newTask.title.trim() || !this.newTask.description.trim()) {
      return;
    }
    const id = Date.now();
    this.taskService.addTask({ id, ...this.newTask });
    this.newTask = { title: '', description: '' };
    this.showForm = false;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }
}

