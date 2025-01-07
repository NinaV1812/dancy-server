import { IsOptional, IsEnum, IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
import { DanceStyle, Goal, DanceLevel, Role } from '../types/enums';
export class UpdateProfileDto {
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
  @IsArray()
  @IsString({ each: true })
  readonly danceVideos?: string[];

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