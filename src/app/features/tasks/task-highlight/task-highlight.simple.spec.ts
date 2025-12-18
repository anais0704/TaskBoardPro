import { TaskHighlight } from './task-highlight';

describe('TaskHighlight', () => {
  it('devrait initialiser title avec une chaîne vide', () => {
    const component = new TaskHighlight();
    expect(component.title).toBe('');
  });

  it('devrait permettre de changer le titre', () => {
    const component = new TaskHighlight();
    component.title = 'Tâche en avant';
    expect(component.title).toBe('Tâche en avant');
  });
});

