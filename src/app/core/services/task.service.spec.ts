import { TestBed } from '@angular/core/testing';
import { TaskService, Task } from './task.service';
import { NotificationService } from './notification.service';

describe('Task Service', () => {
  let service: TaskService;

  beforeEach(() => {
    // Configurer TestBed
    TestBed.configureTestingModule({
      providers: [TaskService, NotificationService]
    });
    
    // Récupérer le service
    service = TestBed.inject(TaskService);
    service.clearTasks();  // État propre
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait ajouter une tâche', () => {
    const newTask: Task = {
      id: Date.now(),
      title: 'Apprendre les tests',
      description: 'Description de test',
      completed: false
    };
    service.addTask(newTask);
    
    const tasks = service.getTasksSync();
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Apprendre les tests');
    expect(tasks[0].completed).toBe(false);
  });

  it('devrait supprimer une tâche', () => {
    const newTask: Task = {
      id: Date.now(),
      title: 'Tâche temporaire',
      description: '',
      completed: false
    };
    service.addTask(newTask);
    const taskId = service.getTasksSync()[0].id;
    
    service.deleteTask(taskId);
    
    expect(service.getTasksSync().length).toBe(0);
  });

  it('devrait marquer une tâche comme terminée', () => {
    const newTask: Task = {
      id: Date.now(),
      title: 'Tâche à terminer',
      description: '',
      completed: false
    };
    service.addTask(newTask);
    const taskId = service.getTasksSync()[0].id;
    
    service.toggleCompleted(taskId);
    
    const task = service.getTasksSync()[0];
    expect(task.completed).toBe(true);
  });

  it('devrait basculer une tâche de terminée à active', () => {
    // ARRANGE : Ajouter une tâche et la marquer comme terminée
    const newTask: Task = {
      id: Date.now(),
      title: 'Tâche à basculer',
      description: '',
      completed: false
    };
    service.addTask(newTask);
    const taskId = service.getTasksSync()[0].id;
    
    // ACT : Marquer comme terminée puis basculer
    service.toggleCompleted(taskId);
    expect(service.getTasksSync()[0].completed).toBe(true);
    
    service.toggleCompleted(taskId);
    
    // ASSERT : Vérifier qu'elle est redevenue active
    const task = service.getTasksSync()[0];
    expect(task.completed).toBe(false);
  });

  it('devrait mettre à jour une tâche', () => {
    const newTask: Task = {
      id: Date.now(),
      title: 'Tâche originale',
      description: 'Description originale',
      completed: false
    };
    service.addTask(newTask);
    const taskId = service.getTasksSync()[0].id;
    
    service.updateTask(taskId, 'Nouveau titre', 'Nouvelle description');
    
    const task = service.getTasksSync()[0];
    expect(task.title).toBe('Nouveau titre');
    expect(task.description).toBe('Nouvelle description');
  });

  it('devrait retourner un observable pour getTasks', () => {
    const tasks$ = service.getTasks();
    expect(tasks$).toBeDefined();
    expect(tasks$.subscribe).toBeDefined();
  });

  it('devrait avoir des observables pour activeTasks$ et completedTasks$', (done) => {
    // ARRANGE : Ajouter des tâches
    const activeTask: Task = { id: 1, title: 'Active', description: '', completed: false };
    service.addTask(activeTask);
    
    // Marquer une tâche comme complétée
    const taskId = service.getTasksSync()[0].id;
    service.toggleCompleted(taskId);
    
    // Ajouter une autre tâche active
    const activeTask2: Task = { id: 2, title: 'Active 2', description: '', completed: false };
    service.addTask(activeTask2);

    // ACT & ASSERT : Vérifier les observables
    let activeChecked = false;
    let completedChecked = false;

    service.activeTasks$.subscribe((tasks) => {
      if (!activeChecked) {
        activeChecked = true;
        expect(tasks.length).toBeGreaterThanOrEqual(1);
        const activeTasks = tasks.filter(t => !t.completed);
        expect(activeTasks.length).toBeGreaterThanOrEqual(1);
      }
    });

    service.completedTasks$.subscribe((tasks) => {
      if (!completedChecked) {
        completedChecked = true;
        expect(tasks.length).toBeGreaterThanOrEqual(1);
        const completedTasks = tasks.filter(t => t.completed);
        expect(completedTasks.length).toBeGreaterThanOrEqual(1);
        if (activeChecked && completedChecked) {
          done();
        }
      }
    });
  });

  it('devrait forcer completed à false lors de l\'ajout', () => {
    const taskWithCompletedTrue: Task = {
      id: Date.now(),
      title: 'Tâche',
      description: '',
      completed: true  // Essayons de mettre true
    };
    
    service.addTask(taskWithCompletedTrue);
    
    const task = service.getTasksSync()[0];
    expect(task.completed).toBe(false); // Devrait être forcé à false
  });

  it('devrait mettre à jour une tâche qui n\'existe pas sans erreur', () => {
    // ACT : Essayer de mettre à jour une tâche inexistante
    service.updateTask(99999, 'Nouveau titre', 'Nouvelle description');
    
    // ASSERT : Ne devrait pas planter, la tâche n'existe simplement pas
    const tasks = service.getTasksSync();
    expect(tasks.find(t => t.id === 99999)).toBeUndefined();
  });

  it('devrait supprimer une tâche qui n\'existe pas sans erreur', () => {
    // ACT : Essayer de supprimer une tâche inexistante
    service.deleteTask(99999);
    
    // ASSERT : Ne devrait pas planter
    expect(service.getTasksSync().length).toBeGreaterThanOrEqual(0);
  });

  it('devrait basculer une tâche qui n\'existe pas sans erreur', () => {
    // ACT : Essayer de basculer une tâche inexistante
    service.toggleCompleted(99999);
    
    // ASSERT : Ne devrait pas planter
    expect(service.getTasksSync().find(t => t.id === 99999)).toBeUndefined();
  });
});
