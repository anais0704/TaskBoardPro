import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskHighlightComponent } from './task-highlight.component';
import { Task } from '../../../core/services/task.service';

describe('TaskHighlight', () => {
  let component: TaskHighlightComponent;
  let fixture: ComponentFixture<TaskHighlightComponent>;

  beforeEach(async () => {
    // Configuration du module de test
    await TestBed.configureTestingModule({
      imports: [TaskHighlightComponent]
    }).compileComponents();

    // Création du composant
    fixture = TestBed.createComponent(TaskHighlightComponent);
    component = fixture.componentInstance;
  });

  it('devrait afficher le titre dans le DOM', () => {
    // ARRANGE : Définir la tâche avec un titre
    const mockTask: Task = {
      id: 1,
      title: 'Ma tâche',
      description: 'Description de test',
      completed: false
    };
    component.task = mockTask;

    // ACT : Mettre à jour le template
    fixture.detectChanges(); // ⚠️ IMPORTANT !

    // ASSERT : Vérifier le DOM
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Ma tâche');
  });

  it('devrait afficher la description si elle existe', () => {
    // ARRANGE : Définir une tâche avec description
    const mockTask: Task = {
      id: 1,
      title: 'Ma tâche',
      description: 'Ma description',
      completed: false
    };
    component.task = mockTask;

    // ACT : Mettre à jour le template
    fixture.detectChanges();

    // ASSERT : Vérifier que la description est affichée
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Ma description');
  });

  it('ne devrait pas afficher la description si elle est vide', () => {
    // ARRANGE : Définir une tâche sans description
    const mockTask: Task = {
      id: 1,
      title: 'Ma tâche',
      description: '',
      completed: false
    };
    component.task = mockTask;

    // ACT : Mettre à jour le template
    fixture.detectChanges();

    // ASSERT : Vérifier que le paragraphe n'existe pas
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p')).toBeNull();
  });
});

