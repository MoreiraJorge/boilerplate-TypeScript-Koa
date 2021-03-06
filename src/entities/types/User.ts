import { Field, ID, InterfaceType } from "type-graphql";

@InterfaceType()
export abstract class IUser {
  @Field(() => ID)
  id!: number;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  email!: string;
}
