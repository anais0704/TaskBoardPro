# TaskBoard Pro

## Commandes utilisées

```bash
ng serve
ng g component home 
ng g component about 
ng g component task 
```

## Routes actives

- `/` HomeComponent
- `/about` AboutComponent

## Séquence 2 - Logique réactive du flux de données

### 1. Structure du flux

Le service `TaskService` utilise un **BehaviorSubject** pour stocker et diffuser la liste des tâches.

Le composant `Task` s'abonne à ce flux via `tasks$` et le **pipe async**.

### 2. Mise à jour des données

La méthode `addTask()` ajoute une tâche puis appelle `next()` pour émettre la nouvelle liste.

La méthode `removeTask()` supprime une tâche puis émet à nouveau la liste mise à jour.

La vue est automatiquement réactualisée sans rechargement.

### 3. Ce que fait `async`

Le pipe `async` est un opérateur Angular qui :
- **S'abonne automatiquement** à l'Observable (ici `tasks$`)
- **Affiche les données** dès qu'elles arrivent
- **Se désabonne automatiquement** quand le composant est détruit (évite les fuites mémoire)
- **Gère les états de chargement** avec `*ngIf="tasks$ | async as tasks"`

Dans le template : `*ngFor="let task of (tasks$ | async)"` permet d'itérer sur les tâches sans gérer manuellement les abonnements.

### 4. Ce que fait `BehaviorSubject`

`BehaviorSubject` est un type d'Observable qui :
- **Garde en mémoire la dernière valeur émise** : contrairement à un Observable classique, il stocke l'état actuel
- **Émet immédiatement la dernière valeur** quand un composant s'abonne (pas besoin d'attendre une nouvelle émission)
- **Émet toutes les valeurs suivantes** après l'abonnement
- **Permet de partager l'état** entre plusieurs composants qui écoutent le même flux

Dans notre cas, `taskSubject` conserve la liste complète des tâches et la diffuse à tous les composants abonnés.

### 5. Comment fonctionne le flux service → composant → template

**Service (`TaskService`)** :
- Contient un `BehaviorSubject` privé qui stocke l'état actuel des tâches
- Expose un Observable public `tasks$` via `asObservable()`
- Les méthodes `addTask()` et `removeTask()` modifient le tableau puis appellent `next()` pour émettre la nouvelle valeur

**Composant (`TaskComponent`)** :
- Injecte le service via `inject(TaskService)`
- Récupère l'Observable `tasks$` depuis le service
- Passe cet Observable directement au template (pas de transformation)

**Template (`task.component.html`)** :
- Utilise le pipe `async` pour s'abonner à `tasks$`
- Affiche automatiquement les données quand elles arrivent
- Se met à jour automatiquement quand le service émet une nouvelle valeur via `next()`

**Flux complet** :
1. Le service émet une nouvelle liste via `taskSubject.next(updatedTasks)`
2. L'Observable `tasks$` propage cette valeur
3. Le pipe `async` dans le template reçoit la nouvelle valeur
4. Angular détecte le changement et met à jour la vue

### 6. Concepts compris

- **BehaviorSubject** : un type d'Observable qui garde en mémoire la dernière valeur émise. Quand un composant s'abonne, il reçoit immédiatement cette dernière valeur, puis toutes les suivantes.

- **Observable** : un flux de données asynchrone auquel on peut s'abonner. Il peut émettre plusieurs valeurs dans le temps.

- **Pipe async** : simplifie l'utilisation des Observables dans les templates en gérant automatiquement l'abonnement et le désabonnement.

- **Réactivité** : le principe selon lequel la vue se met à jour automatiquement quand les données changent, sans avoir à appeler manuellement des méthodes de rafraîchissement.

- **Flux unidirectionnel** : les données vont du service vers le composant, puis vers le template. Les modifications passent par le service qui émet les nouvelles valeurs.

### 7. Points clés retenus

- Pas besoin d'appeler `getTasks()` à chaque fois : la donnée est **vivante**.
- `async` gère l'abonnement et le désabonnement automatiquement.
- Le flux reste cohérent entre le service et la vue.
- `BehaviorSubject` permet de conserver l'état et de le partager entre plusieurs composants.
