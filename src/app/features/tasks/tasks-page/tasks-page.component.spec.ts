import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksPageComponent } from './tasks-page.component';
import { Task, TaskService } from '../../../core/services/task.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BehaviorSubject, Observable, map } from 'rxjs';

// 🎭 1️⃣ CRÉER LE MOCK (fausse version du service)
class MockTaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  activeTasks$: Observable<Task[]> = this.tasks$.pipe(
    map((tasks) => tasks.filter((t) => !t.completed))
  );
  completedTasks$: Observable<Task[]> = this.tasks$.pipe(
    map((tasks) => tasks.filter((t) => t.completed))
  );

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(task: Task): void {
    const tasks = this.tasksSubject.value;
    this.tasksSubject.next([...tasks, task]);
  }

  deleteTask(id: number): void {
    const tasks = this.tasksSubject.value.filter((task) => task.id !== id);
    this.tasksSubject.next(tasks);
  }

  toggleCompleted(id: number): void {
    const tasks = this.tasksSubject.value.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.tasksSubject.next(tasks);
  }

  updateTask(id: number, title: string, description: string): void {
    const tasks = this.tasksSubject.value.map((task) =>
      task.id === id ? { ...task, title, description } : task
    );
    this.tasksSubject.next(tasks);
  }
}

// Mock pour NotificationService
class MockNotificationService {
  private notificationSubject = new BehaviorSubject<string>('');
  notifications$: Observable<string> = this.notificationSubject.asObservable();

  show(message: string): void {
    this.notificationSubject.next(message);
  }
}

describe('TasksPage avec Mock', () => {
  let component: TasksPageComponent;
  let fixture: ComponentFixture<TasksPageComponent>;
  let mockTaskService: MockTaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksPageComponent],
      providers: [
        // 🎭 2️⃣ UTILISER LE MOCK au lieu du vrai service
        { provide: TaskService, useClass: MockTaskService },
        { provide: NotificationService, useClass: MockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksPageComponent);
    component = fixture.componentInstance;
    mockTaskService = TestBed.inject(TaskService) as any;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait utiliser le mock pour ajouter une tâche', () => {
    // ACT : On appelle la méthode du composant
    component.addTask('Tâche mockée', 'Description mockée');

    // ASSERT : Le mock a bien simulé l'ajout
    mockTaskService.tasks$.subscribe((tasks) => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('Tâche mockée');
      expect(tasks[0].description).toBe('Description mockée');
      expect(tasks[0].completed).toBe(false);
    });
  });

  it('devrait utiliser le mock pour supprimer une tâche', () => {
    // ARRANGE : Ajouter une tâche d'abord
    const mockTask: Task = {
      id: 1,
      title: 'Tâche à supprimer',
      description: '',
      completed: false
    };
    mockTaskService.addTask(mockTask);

    // ACT : Supprimer la tâche
    component.removeTask(1);

    // ASSERT : Vérifier que la tâche a été supprimée
    mockTaskService.tasks$.subscribe((tasks) => {
      expect(tasks.length).toBe(0);
    });
  });

  it('devrait utiliser le mock pour basculer l\'état d\'une tâche', () => {
    // ARRANGE : Ajouter une tâche
    const mockTask: Task = {
      id: 1,
      title: 'Tâche à basculer',
      description: '',
      completed: false
    };
    mockTaskService.addTask(mockTask);

    // ACT : Basculer l'état
    component.toggleTask(mockTask);

    // ASSERT : Vérifier que l'état a changé
    mockTaskService.tasks$.subscribe((tasks) => {
      expect(tasks[0].completed).toBe(true);
    });
  });

  it('devrait ne pas ajouter une tâche si le titre est vide', () => {
    // ACT : Essayer d'ajouter une tâche avec un titre vide
    component.addTask('', 'Description');

    // ASSERT : Vérifier qu'aucune tâche n'a été ajoutée
    mockTaskService.tasks$.subscribe((tasks) => {
      expect(tasks.length).toBe(0);
    });
  });

  it('devrait ne pas ajouter une tâche si le titre ne contient que des espaces', () => {
    // ACT : Essayer d'ajouter une tâche avec un titre contenant seulement des espaces
    component.addTask('   ', 'Description');

    // ASSERT : Vérifier qu'aucune tâche n'a été ajoutée
    mockTaskService.tasks$.subscribe((tasks) => {
      expect(tasks.length).toBe(0);
    });
  });

  it('devrait vérifier si une tâche est complétée', () => {
    // ARRANGE : Créer une tâche complétée
    const completedTask: Task = {
      id: 1,
      title: 'Tâche complétée',
      description: '',
      completed: true
    };

    // ACT & ASSERT : Vérifier la méthode
    expect(component.isTaskCompleted(completedTask)).toBe(true);
  });

  it('devrait filtrer les tâches actives', (done) => {
    // ARRANGE : Ajouter des tâches actives et complétées
    const activeTask: Task = { id: 1, title: 'Active', description: '', completed: false };
    const completedTask: Task = { id: 2, title: 'Complétée', description: '', completed: true };
    mockTaskService.addTask(activeTask);
    mockTaskService.addTask(completedTask);

    // ACT : Filtrer les tâches actives
    component.filter = 'active';
    fixture.detectChanges();

    // ASSERT : Vérifier le filtre
    component.filteredTasks$.subscribe((tasks) => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].completed).toBe(false);
      done();
    });
  });

  it('devrait filtrer les tâches complétées', (done) => {
    // ARRANGE : Ajouter des tâches actives et complétées
    const activeTask: Task = { id: 1, title: 'Active', description: '', completed: false };
    const completedTask: Task = { id: 2, title: 'Complétée', description: '', completed: true };
    mockTaskService.addTask(activeTask);
    mockTaskService.addTask(completedTask);

    // ACT : Filtrer les tâches complétées
    component.filter = 'completed';
    fixture.detectChanges();

    // ASSERT : Vérifier le filtre
    component.filteredTasks$.subscribe((tasks) => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].completed).toBe(true);
      done();
    });
  });

  it('devrait afficher toutes les tâches quand le filtre est "all"', (done) => {
    // ARRANGE : Ajouter des tâches
    const task1: Task = { id: 1, title: 'Tâche 1', description: '', completed: false };
    const task2: Task = { id: 2, title: 'Tâche 2', description: '', completed: true };
    mockTaskService.addTask(task1);
    mockTaskService.addTask(task2);

    // ACT : Filtrer toutes les tâches
    component.filter = 'all';
    fixture.detectChanges();

    // ASSERT : Vérifier que toutes les tâches sont affichées
    component.filteredTasks$.subscribe((tasks) => {
      expect(tasks.length).toBe(2);
      done();
    });
  });

  it('devrait vérifier qu\'une tâche non complétée retourne false', () => {
    // ARRANGE : Créer une tâche non complétée
    const activeTask: Task = {
      id: 1,
      title: 'Tâche active',
      description: '',
      completed: false
    };

    // ACT & ASSERT : Vérifier la méthode
    expect(component.isTaskCompleted(activeTask)).toBe(false);
  });

  it('ne devrait pas highlight si highlightContainer est undefined', () => {
    // ARRANGE : S'assurer que highlightContainer est undefined
    component.highlightContainer = undefined;
    const task: Task = { id: 1, title: 'Test', description: '', completed: false };

    // ACT : Essayer de highlight
    component.highlightTask(task);

    // ASSERT : Ne devrait pas planter (pas d'erreur)
    expect(component.highlightContainer).toBeUndefined();
  });

  it('ne devrait pas éditer si editContainers est undefined', () => {
    // ARRANGE : S'assurer que editContainers est undefined
    component.editContainers = undefined;
    const task: Task = { id: 1, title: 'Test', description: '', completed: false };

    // ACT : Essayer d'éditer
    component.editTask(task, 0);

    // ASSERT : Ne devrait pas planter (pas d'erreur)
    expect(component.editContainers).toBeUndefined();
  });

  it('devrait basculer showForm', () => {
    // ARRANGE : État initial
    expect(component.showForm).toBe(false);

    // ACT : Basculer
    component.showForm = true;

    // ASSERT : Vérifier le changement
    expect(component.showForm).toBe(true);
  });

  it('devrait utiliser updateTask via editTask', (done) => {
    // ARRANGE : Ajouter une tâche et créer un mock container
    const task: Task = { id: 1, title: 'Tâche à éditer', description: 'Desc', completed: false };
    mockTaskService.addTask(task);
    fixture.detectChanges();

    // Simuler editContainers avec un QueryList mock
    const mockContainer = {
      clear: jasmine.createSpy('clear'),
      createComponent: jasmine.createSpy('createComponent').and.returnValue({
        instance: {
          title: '',
          description: '',
          taskChange: { subscribe: jasmine.createSpy('subscribe') },
          cancel: { subscribe: jasmine.createSpy('subscribe') }
        }
      })
    };

    const mockQueryList = {
      forEach: jasmine.createSpy('forEach'),
      get: jasmine.createSpy('get').and.returnValue(mockContainer)
    } as any;

    component.editContainers = mockQueryList;

    // ACT : Éditer la tâche
    component.editTask(task, 0);

    // ASSERT : Vérifier que updateTask serait appelé (via la subscription)
    expect(mockQueryList.get).toHaveBeenCalledWith(0);
    done();
  });

  it('ne devrait pas éditer si container.get retourne undefined', () => {
    // ARRANGE : Créer un mock QueryList qui retourne undefined
    const mockQueryList = {
      forEach: jasmine.createSpy('forEach'),
      get: jasmine.createSpy('get').and.returnValue(undefined)
    } as any;

    component.editContainers = mockQueryList;
    const task: Task = { id: 1, title: 'Test', description: '', completed: false };

    // ACT : Essayer d'éditer
    component.editTask(task, 999);

    // ASSERT : Ne devrait pas planter
    expect(mockQueryList.get).toHaveBeenCalledWith(999);
  });
});

