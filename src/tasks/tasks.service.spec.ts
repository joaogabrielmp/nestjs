import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';

const mockUser = { id: 12, username: 'Test user' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let tasksService: any;
  let taskRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDTO = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      };

      const result = await tasksService.getTasks(filters, mockUser);

      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and succesffuly retrieve and return the task', async () => {
      const mockTask = { title: 'Test task', description: 'Test desc' };
      const taskId = 1;

      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(taskId, mockUser);

      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: taskId,
          userId: mockUser.id,
        },
      });
    });

    it('throws an error as task is not found', () => {
      const taskId = 1;

      taskRepository.findOne.mockResolvedValue(null);

      expect(tasksService.getTaskById(taskId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('calls taskRepository.create() and returns the result', async () => {
      taskRepository.createTask.mockResolvedValue('someTask');

      expect(taskRepository.createTask).not.toHaveBeenCalled();

      const createTaskDto = { title: 'Test task', description: 'Test desc' };
      const result = await tasksService.createTask(createTaskDto, mockUser);

      expect(taskRepository.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );

      expect(result).toEqual('someTask');
    });
  });

  describe('deleteTask', () => {
    it('calls taskRepository.deleteTask() to delete a task', async () => {
      const taskId = 1;

      taskRepository.delete.mockResolvedValue({ affected: 1 });

      expect(taskRepository.delete).not.toHaveBeenCalled();

      await tasksService.deleteTask(taskId, mockUser);

      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: taskId,
        userId: mockUser.id,
      });
    });

    it('throws an error as task could not be found', () => {
      const taskId = 1;

      taskRepository.delete.mockResolvedValue({ affected: 0 });

      expect(tasksService.deleteTask(taskId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('updates a task status', async () => {
      const save = jest.fn().mockResolvedValue(true);
      const taskId = 1;

      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });

      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const result = await tasksService.updateTaskStatus(
        taskId,
        TaskStatus.DONE,
        mockUser,
      );

      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
