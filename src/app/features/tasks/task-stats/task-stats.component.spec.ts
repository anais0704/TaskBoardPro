import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskStatsComponent } from './task-stats.component';
import { TaskService } from '../../../core/services/task.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../../core/services/task.service';
import { skip, first } from 'rxjs/operators';

describe('TaskStatsComponent', () => {
  let component: TaskStatsComponent;
  let fixture: ComponentFixture<TaskStatsComponent>;
  let taskService: TaskService;
  let tasksSubject: BehaviorSubject<Task[]>;

  beforeEach(async () => {
    tasksSubject = new BehaviorSubject<Task[]>([]);

    await TestBed.configureTestingModule({
      imports: [TaskStatsComponent],
      providers: [TaskService, NotificationService]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskStatsComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir un observable stats$ défini', () => {
    expect(component.stats$).toBeDefined();
  });
});

