import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDTO {
  @IsOptional()
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
