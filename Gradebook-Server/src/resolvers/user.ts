import { User } from "../entities/User";
import { MyContext } from "../types";
import { EmailPasswordInput } from "./EmailPasswordInputs";
import {
  Resolver,
  Mutation,
  Int,
  Field,
  Arg,
  Ctx,
  ObjectType,
  Query,
  FieldResolver,
  Root,
} from "type-graphql";
import argon2 from "argon2";
import { getConnection } from "typeorm";
import { validateRegister } from "../utils/validateRegisterInput";
import { COOKIE_NAME, FORGOT_PASSWORD } from "../constants";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";
import { LoginUserInput } from "./LoginUserInput";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    if (req.session.userId === user.id) {
      return user.email;
    }
    return "";
  }

  @Query(() => [User], { nullable: true })
  getAllUsers(@Ctx() {}: MyContext) {
    return User.find({});
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ email });

    if (!user) {
      return true;
    }

    const token = v4();

    //Remember for one day
    redis.set(FORGOT_PASSWORD + token, user.id, "ex", 1000 * 60 * 60 * 24);

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
    );

    return true;
  }

  //Check if logged in
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return User.findOne(req.session.userId);
  }

  //Register mutation
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: EmailPasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    const { username, email, password } = options;

    const hashedPassword = await argon2.hash(password);

    let user;

    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: username,
          email: email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (error) {
      if (error.code === "23505") {
        return {
          errors: [
            {
              field: "email",
              message: "email is already in use",
            },
          ],
        };
      }
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: LoginUserInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const { email, password } = options;
    const user = await User.findOne({ email });
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "Email is not registered",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };
    }
    req.session.userId = user.id;


    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve, reject) =>
      req.session?.destroy((error) => {
        res.clearCookie(COOKIE_NAME);
        if (error) {
          reject(error);
          return;
        }
        resolve(true);
      })
    );
  }

  @Mutation(() => Boolean)
  async deleteAccount(
    @Arg("id", () => Int) id: number,
    @Ctx() {}: MyContext
  ): Promise<Boolean> {
    const user = await User.findOne(id);

    if (!user) {
      return false;
    }
    await User.delete({ id });

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Length must be greater than 2",
          },
        ],
      };
    }
    const redisKey = FORGOT_PASSWORD + token;
    const userId = await redis.get(redisKey);

    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }
    const id = parseInt(userId);
    const user = await User.findOne(id);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "User no longer exists",
          },
        ],
      };
    }

    await User.update(
      {
        id: id,
      },
      {
        password: await argon2.hash(newPassword),
      }
    );

    await redis.del(redisKey);

    req.session.userId = id;

    return { user };
  }
}
