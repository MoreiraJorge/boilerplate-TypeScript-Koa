import { Resolver, Query } from "type-graphql";
import "reflect-metadata";

@Resolver()
export class CheckStatusResolver {
  @Query(() => String)
  async hello() {
    return "Hello World";
  }
}
