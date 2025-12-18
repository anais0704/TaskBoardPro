import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-task-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-stats.component.html',
  styleUrls: ['./task-stats.component.scss']
})
export class TaskStatsComponent {
  private readonly taskService = inject(TaskService);

  stats$ = this.taskService.tasks$.pipe(
    map((tasks) => {
      const total = tasks.length;
      const done = tasks.filter((t) => t.completed).length;
      const active = total - done;
      const percent = total ? Math.round((done / total) * 100) : 0;
      return { total, done, active, percent };
    })
  );
}


