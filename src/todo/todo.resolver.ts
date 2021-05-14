import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { CreateTodoInput } from './dto/create-todo.input';
import { Todo } from './models/todo.model';
import { TodoService } from './todo.service';

const pubSub = new PubSub();

@Resolver(of => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(returns => Todo)
  async getTodoById(@Args('id') id: string): Promise<Todo> {
    const todo = await this.todoService.findOneById(id);
    if (!todo) {
      throw new NotFoundException(id);
    }
    return todo;
  }

  @Query(returns => [Todo])
  async getTodos(): Promise<Todo[]> {
    return await this.todoService.findAll();
  }

  @Mutation(returns => Todo)
  async createTodo(
    @Args('newTodoData') newTodoData: CreateTodoInput,
  ): Promise<Todo> {
    return await this.todoService.create(newTodoData);
  }
}