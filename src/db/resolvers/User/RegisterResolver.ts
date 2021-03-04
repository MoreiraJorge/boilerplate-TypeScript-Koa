import { Resolver, Mutation, Arg } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../../entities/User";
import "reflect-metadata";

@Resolver(User)
export class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg("firstName") firstName: string,
    @Arg("lastname") lastName: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    return user;
  }
}