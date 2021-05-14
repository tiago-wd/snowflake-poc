import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { snowflakeConn } from '../providers/snowflake';

@Module({
  providers: [TodoService, TodoResolver, snowflakeConn]
})
export class TodoModule {}
