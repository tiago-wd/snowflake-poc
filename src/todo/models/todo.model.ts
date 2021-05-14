import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Todo {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  status: boolean;

  @Field()
  createdAt: string;
}