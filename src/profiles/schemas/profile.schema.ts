
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DanceStyle, Goal, DanceLevel, Role } from '../types/enums';


export type ProfileDocument = HydratedDocument<Profile>;

@Schema()
export class Profile {
    @Prop()
    // @Prop({required: true})
    firstName: string;

    // @Prop({required: true})
    @Prop()
    lastName: string;

    // @Prop({required: true})
    @Prop()
    age: number;

    @Prop()
    email: string;

    @Prop({
        type: [String],
        enum: DanceStyle,
    })
    danceStyles: DanceStyle[];


    @Prop([String])
    danceVideos: string[];

    @Prop()
    profilePic: string;

    // @Prop({required: true})
    @Prop()
    height: number;

    @Prop({
        type: [String],
        enum: Goal,
    })
    goal: Goal[];

    @Prop()
    profileDescription: string;

    // @Prop({required: true})
    @Prop()
    location: string;

    @Prop({
        type: String,
        enum: DanceLevel,
    })
    danceLevel: DanceLevel;

    // @Prop({required: true})
    @Prop({
        type: String,
        enum: Role,
    })
    role: Role;

    @Prop()
    lookingForFriends: boolean;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
