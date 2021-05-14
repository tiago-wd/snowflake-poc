
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field()
  @MaxLength(100)
  title: string;

  @Field()
  @IsNotEmpty()
  status: boolean = false;

}