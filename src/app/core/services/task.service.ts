import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NotificationService } from './notification.service';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    { id: 1, title: 'Planifier le sprint', description: 'Lister les user stories prioritaires pour la semaine.', completed: false },
    { id: 2, title: 'Préparer la démo', description: 'Créer une courte présentation des features livrées.', completed: false },
    { id: 3, title: 'Nettoyer le backlog', description: 'Archiver les cartes obsolètes et clarifier les prochaines étapes.', completed: false }
  ];

  private readonly taskSubject = new BehaviorSubject<Task[]>([...this.tasks]);
  private lastMessage = '';

  readonly tasks$: Observable<Task[]> = this.taskSubject.asObservable().pipe(
    tap(() => {
      if (this.lastMessage) {
        this.notificationService.show(this.lastMessage);
        this.lastMessage = '';
      }
    })
  );

  readonly completedTasks$ = this.tasks$.pipe(
    map((tasks) => tasks.filter((t) => t.completed))
  );

  readonly activeTasks$ = this.tasks$.pipe(
    map((tasks) => tasks.filter((t) => !t.completed))
  );

  constructor(private readonly notificationService: NotificationService) {}

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(task: Task): void {
    this.tasks = [...this.tasks, { ...task, completed: false }];
    this.lastMessage = 'Tâche ajoutée';
    this.emitTasks();
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
     this.lastMessage = 'Tâche supprimée';
    this.emitTasks();
  }

  toggleCompleted(id: number): void {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.lastMessage = 'État de la tâche mis à jour';
    this.emitTasks();
  }

  updateTask(id: number, title: string, description: string): void {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, title, description } : task
    );
    this.lastMessage = 'Tâche mise à jour';
    this.emitTasks();
  }

  private emitTasks(): void {
    this.taskSubject.next([...this.tasks]);
  }
}
