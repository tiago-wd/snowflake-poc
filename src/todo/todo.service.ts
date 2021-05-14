import { Inject, Injectable } from '@nestjs/common';
import { Todo } from './models/todo.model';
import { CreateTodoInput } from './dto/create-todo.input';
import { Snowflake } from 'snowflake-promise';

@Injectable()
export class TodoService {
  constructor(@Inject('SNOWFLAKE') private readonly snowflake: Snowflake) { }

  async create(createTodoInput: CreateTodoInput): Promise<Todo> {
    const query = `call create_todo('${createTodoInput.title}');`
    const createdTodo = await this.snowflake.execute(query);
    return await this.findOneById(createdTodo[0].CREATE_TODO.data.id);
  }

  async findOneById(todoId: string): Promise<Todo> {
    const query = `call get_todo_by_id('${todoId}');`
    const todo = await this.snowflake.execute(query);

    return todo[0].GET_TODO_BY_ID.data;
  }

  async findAll(): Promise<Todo[]> {
    const query = `call get_todos();`
    const todos = await this.snowflake.execute(query);

    return todos[0].GET_TODOS.data;
  }
}