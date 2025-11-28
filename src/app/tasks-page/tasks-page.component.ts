import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../core/services/task.service';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FormsModule],
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss']
})
export class TasksPageComponent {
  private taskService = inject(TaskService);
  tasks$ = this.taskService.getTasks();

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

