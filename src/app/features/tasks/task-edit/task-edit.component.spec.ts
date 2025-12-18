import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskEditComponent } from './task-edit.component';

describe('TaskEditComponent', () => {
  let component: TaskEditComponent;
  let fixture: ComponentFixture<TaskEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEditComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskEditComponent);
    component = fixture.componentInstance;
    component.title = 'Tâche initiale';
    component.description = 'Description initiale';
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait émettre taskChange avec les bonnes données', () => {
    // ARRANGE : Espionner l'événement @Output
    let savedData: any;
    component.taskChange.subscribe((data) => {
      savedData = data;
    });

    // ACT : Modifier les valeurs et appeler save
    component.title = 'Nouvelle tâche';
    component.description = 'Nouvelle description';
    component.save();

    // ASSERT : Vérifier les données émises
    expect(savedData.title).toBe('Nouvelle tâche');
    expect(savedData.description).toBe('Nouvelle description');
  });

  it('devrait émettre cancel quand on annule', () => {
    // ARRANGE : Espionner l'événement @Output
    let cancelled = false;
    component.cancel.subscribe(() => {
      cancelled = true;
    });

    // ACT : Appeler la méthode onCancel
    component.onCancel();

    // ASSERT : Vérifier que l'événement a été émis
    expect(cancelled).toBe(true);
  });

  it('ne devrait pas émettre taskChange si le titre est vide', () => {
    // ARRANGE : Espionner l'événement @Output
    let emitted = false;
    component.taskChange.subscribe(() => {
      emitted = true;
    });

    // ACT : Essayer de sauvegarder avec un titre vide
    component.title = '   ';  // Titre vide (espaces)
    component.description = 'Description';
    component.save();

    // ASSERT : Vérifier que l'événement n'a pas été émis
    expect(emitted).toBe(false);
  });

  it('devrait trimmer le titre et la description avant d\'émettre', () => {
    // ARRANGE : Espionner l'événement @Output
    let savedData: any;
    component.taskChange.subscribe((data) => {
      savedData = data;
    });

    // ACT : Sauvegarder avec des espaces
    component.title = '  Titre avec espaces  ';
    component.description = '  Description avec espaces  ';
    component.save();

    // ASSERT : Vérifier que les espaces ont été supprimés
    expect(savedData.title).toBe('Titre avec espaces');
    expect(savedData.description).toBe('Description avec espaces');
  });

  it('devrait émettre même si la description est vide mais le titre est valide', () => {
    // ARRANGE : Espionner l'événement @Output
    let savedData: any;
    component.taskChange.subscribe((data) => {
      savedData = data;
    });

    // ACT : Sauvegarder avec un titre valide mais description vide
    component.title = 'Titre valide';
    component.description = '';
    component.save();

    // ASSERT : Vérifier que l'événement est émis
    expect(savedData.title).toBe('Titre valide');
    expect(savedData.description).toBe('');
  });

  it('devrait avoir des valeurs par défaut vides', () => {
    // ARRANGE : Créer un nouveau composant
    const newFixture = TestBed.createComponent(TaskEditComponent);
    const newComponent = newFixture.componentInstance;

    // ASSERT : Vérifier les valeurs par défaut
    expect(newComponent.title).toBe('');
    expect(newComponent.description).toBe('');
  });
});

