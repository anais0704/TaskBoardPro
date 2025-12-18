import { Component, EnvironmentInjector, ViewChild, ViewChildren, ViewContainerRef, QueryList, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Task, TaskService } from '../../../core/services/task.service';
import { TaskHighlightComponent } from '../task-highlight/task-highlight.component';
import { TaskEditComponent } from '../task-edit/task-edit.component';
import { NotificationService } from '../../../core/services/notification.service';
import { TaskStatsComponent } from '../task-stats/task-stats.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, AsyncPipe, TaskStatsComponent],
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss']
})
export class TasksPageComponent {
  private readonly taskService = inject(TaskService);
  private readonly injector = inject(EnvironmentInjector);
  private readonly notificationService = inject(NotificationService);
  @ViewChild('highlightContainer', { read: ViewContainerRef }) highlightContainer?: ViewContainerRef;
  @ViewChildren('editContainer', { read: ViewContainerRef }) editContainers?: QueryList<ViewContainerRef>;
  tasks$: Observable<Task[]> = this.taskService.getTasks();
  notifications$ = this.notificationService.notifications$;

  // observables pour les filtres
  activeTasks$ = this.taskService.activeTasks$;
  completedTasks$ = this.taskService.completedTasks$;
  filter: 'all' | 'active' | 'completed' = 'all';

  // affichage du formulaire d'ajout
  showForm = false;

  addTask(title: string, description: string): void {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle) {
      return;
    }
    const task: Task = {
      id: Date.now(),
      title: trimmedTitle,
      description: trimmedDescription,
      completed: false
    };
    this.taskService.addTask(task);
  }

  get filteredTasks$(): Observable<Task[]> {
    switch (this.filter) {
      case 'active':
        return this.activeTasks$;
      case 'completed':
        return this.completedTasks$;
      default:
        return this.tasks$;
    }
  }

  highlightTask(task: Task): void {
    if (!this.highlightContainer) {
      return;
    }
    this.highlightContainer.clear();
    const ref = this.highlightContainer.createComponent<TaskHighlightComponent>(TaskHighlightComponent, {
      environmentInjector: this.injector
    });
    ref.instance.task = task;
  }

  editTask(task: Task, index: number): void {
    const containers = this.editContainers;
    if (!containers) return;

    // on ferme tous les autres formulaires d'édition
    containers.forEach((c) => c.clear());

    const container = containers.get(index);
    if (!container) return;

    const ref = container.createComponent<TaskEditComponent>(TaskEditComponent, {
      environmentInjector: this.injector
    });
    ref.instance.title = task.title;
    ref.instance.description = task.description;
    ref.instance.taskChange.subscribe((updated) => {
      this.taskService.updateTask(task.id, updated.title, updated.description);
      container.clear();
    });
    ref.instance.cancel.subscribe(() => {
      container.clear();
    });
  }

  toggleTask(task: Task): void {
    this.taskService.toggleCompleted(task.id);
  }

  isTaskCompleted(task: Task): boolean {
    return task.completed;
  }

  removeTask(taskId: number): void {
    this.taskService.deleteTask(taskId);
  }
}

