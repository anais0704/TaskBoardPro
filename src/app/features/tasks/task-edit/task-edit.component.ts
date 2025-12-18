import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent {
  @Input() title = '';
  @Input() description = '';

  @Output() taskChange = new EventEmitter<{ title: string; description: string }>();
  @Output() cancel = new EventEmitter<void>();

  save(): void {
    const trimmedTitle = this.title.trim();
    const trimmedDescription = this.description.trim();

    if (!trimmedTitle) {
      return;
    }

    this.taskChange.emit({
      title: trimmedTitle,
      description: trimmedDescription
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

