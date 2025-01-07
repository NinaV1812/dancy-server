// export class CreateProfileDto {
//     readonly firstName?: string;
//     readonly lastName?: string;
//     readonly age?: number;
//     readonly danceStyles?: string[];
//     readonly danceVideos?: string[];
//     readonly profilePic?: string[];
//     readonly height?: number;
//     readonly goal?: number;
//     readonly profileDescription?: string;
//     readonly location?: string;
//     readonly danceLevel?: string;
//     readonly role?: string;
//     readonly email?: string;
//     readonly lookingForFriends?: boolean;
//   }

  import { IsOptional, IsEnum, IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
  import { DanceStyle, Goal, DanceLevel, Role } from '../types/enums';
  export class CreateProfileDto {
    @IsOptional()
    @IsString()
    readonly firstName?: string;
  
    @IsOptional()
    @IsString()
    readonly lastName?: string;
  
    @IsOptional()
    @IsNumber()
    readonly age?: number;
  
    @IsOptional()
    @IsArray()
    @IsEnum(DanceStyle, { each: true })
    readonly danceStyles?: DanceStyle[];
  
    @IsOptional()
    @IsString()
    readonly danceVideo?: string;
  
    @IsOptional()
    @IsString()
    readonly profilePic?: string;
  
    @IsOptional()
    @IsNumber()
    readonly height?: number;
  
    @IsOptional()
    @IsArray()
    @IsEnum(Goal, { each: true })
    readonly goal?: Goal[];
  
    @IsOptional()
    @IsString()
    readonly profileDescription?: string;
  
    @IsOptional()
    @IsString()
    readonly location?: string;
  
    @IsOptional()
    @IsEnum(DanceLevel)
    readonly danceLevel?: DanceLevel;
  
    @IsOptional()
    @IsEnum(Role)
    readonly role?: Role;
  
    @IsOptional()
    @IsBoolean()
    readonly lookingForFriends?: boolean;
  }