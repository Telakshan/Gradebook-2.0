import {InputType, Field} from 'type-graphql';

@InputType()
export class EmailPasswordInput{

    @Field()
    username: string;

    @Field()
    email: string;
    
    @Field()
    password: string;
}