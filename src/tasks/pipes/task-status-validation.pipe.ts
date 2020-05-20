import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (this.isStatusNotValid(value)) {
      throw new BadRequestException();
    }

    return value;
  }

  private isStatusNotValid(status: any) {
    const index = this.allowedStatuses.indexOf(status);

    return index === -1;
  }
}
