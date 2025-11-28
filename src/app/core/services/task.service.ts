import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = [
    { id: 1, title: 'Planifier le sprint', description: 'Lister les user stories prioritaires pour la semaine.' },
    { id: 2, title: 'Préparer la démo', description: 'Créer une courte présentation des features livrées.' },
    { id: 3, title: 'Nettoyer le backlog', description: 'Archiver les cartes obsolètes et clarifier les prochaines étapes.' }
  ];

  private readonly taskSubject = new BehaviorSubject([...this.tasks]);
  readonly tasks$ = this.taskSubject.asObservable();

  getTasks(): Observable<{ id: number; title: string; description: string }[]> {
    return this.tasks$;
  }

  addTask(task: { id: number; title: string; description: string }): void {
    this.tasks = [...this.tasks, task];
    this.emitTasks();
  }

  removeTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.emitTasks();
  }

  private emitTasks(): void {
    this.taskSubject.next([...this.tasks]);
  }
}
