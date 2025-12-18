import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { take } from 'rxjs';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait émettre une notification quand show() est appelé', (done) => {
    // ARRANGE : Observer les notifications
    service.notifications$.pipe(take(1)).subscribe((message) => {
      // ASSERT : Vérifier que la notification est émise
      expect(message).toBe('Test notification');
      done();
    });

    // ACT : Afficher une notification
    service.show('Test notification');
  });

  it('ne devrait pas émettre si le message est vide', (done) => {
    let emitted = false;
    
    service.notifications$.pipe(take(1)).subscribe(() => {
      emitted = true;
    });

    // ACT : Essayer d'afficher une notification vide
    service.show('');

    // ASSERT : Vérifier que rien n'a été émis
    setTimeout(() => {
      expect(emitted).toBe(false);
      done();
    }, 100);
  });

  it('devrait masquer automatiquement la notification après la durée spécifiée', (done) => {
    const messages: string[] = [];

    service.notifications$.subscribe((message) => {
      messages.push(message);
      if (messages.length === 2) {
        // ASSERT : Vérifier que la notification a été masquée
        expect(messages[0]).toBe('Notification temporaire');
        expect(messages[1]).toBe(''); // Masquée
        done();
      }
    });

    // ACT : Afficher une notification avec une durée courte
    service.show('Notification temporaire', 100);
  });

  it('ne devrait pas masquer automatiquement si durationMs est 0', (done) => {
    let messageCount = 0;

    service.notifications$.subscribe((message) => {
      messageCount++;
      if (messageCount === 1) {
        expect(message).toBe('Notification permanente');
        // Attendre un peu pour vérifier qu'aucun autre message n'est émis
        setTimeout(() => {
          expect(messageCount).toBe(1);
          done();
        }, 200);
      }
    });

    // ACT : Afficher une notification sans durée (0)
    service.show('Notification permanente', 0);
  });
});

