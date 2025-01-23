
import { Model } from 'mongoose';
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';


@Injectable()
export class ProfileService {
    private readonly logger = new Logger(ProfileService.name);

    constructor(@InjectModel(Profile.name) private profileModel: Model<Profile>) { }


    async create(createProfileDto: CreateProfileDto): Promise<Profile> {
        try {
            const createdProfile = new this.profileModel(createProfileDto);
            return await createdProfile.save();
        } catch (error) {
            this.logger.error('Error creating profile', error.stack);
            throw new InternalServerErrorException('Failed to create profile');
        }
    }
    async findAll(queryParams: { role?: string; location?: string; danceLevel?: string; danceStyle?: string; lookingForFriends?: boolean }, skip = 0, limit = 10): Promise<Profile[]> {
        try {
            const query: any = {};
            console.log('queryParams', queryParams);

            const orConditions: any[] = [];

            if (queryParams.location) {
                orConditions.push({ location: queryParams.location });
            }

            if (queryParams.role) {
                orConditions.push({ role: queryParams.role });
            }

            if (orConditions.length > 0) {
                query['$or'] = orConditions;
            }

            if (queryParams.danceStyle) {
                query["danceStyles"] = { $in: queryParams.danceStyle.split(',') }; // Expecting comma-separated values
            }

            if (queryParams.danceLevel) {
                query["danceLevel"] = queryParams.danceLevel;
            }


            console.log('query', query);

            return await this.profileModel.find(query).skip(skip).limit(limit).exec();
        } catch (error) {
            this.logger.error('Error fetching all profiles', error.stack);
            throw new InternalServerErrorException('Failed to retrieve profiles');
        }
    }

    async findOne(id: string): Promise<Profile> {
        // if (!isValidObjectId(id)) {
        //   throw new BadRequestException(`Invalid ID format: ${id}`);
        // }

        try {
            const profile = await this.profileModel.findById(id).exec();
            if (!profile) {
                throw new NotFoundException(`Profile with ID ${id} not found`);
            }
            return profile;
        } catch (error) {
            this.logger.error(`Error fetching profile with ID ${id}`, error.stack);
            throw new InternalServerErrorException(`Failed to retrieve profile with ID ${id}`);
        }
    }



    async update(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
        // if (!isValidObjectId(id)) {
        //   throw new BadRequestException(`Invalid ID format: ${id}`);
        // }

        try {
            const updatedProfile = await this.profileModel
                .findByIdAndUpdate(id, updateProfileDto, { new: true })
                .exec();
            if (!updatedProfile) {
                throw new NotFoundException(`Profile with ID ${id} not found`);
            }
            return updatedProfile;
        } catch (error) {
            this.logger.error(`Error updating profile with ID ${id}`, error.stack);
            throw new InternalServerErrorException(`Failed to update profile with ID ${id}`);
        }
    }

    async delete(id: string): Promise<Profile> {

        try {
            const deletedProfile = await this.profileModel.findByIdAndDelete(id).exec();
            if (!deletedProfile) {
                throw new NotFoundException(`Profile with ID ${id} not found`);
            }
            return deletedProfile;
        } catch (error) {
            this.logger.error(`Error deleting profile with ID ${id}`, error.stack);
            throw new InternalServerErrorException(`Failed to delete profile with ID ${id}`);
        }
    }
    async matchProfiles(userId: string, profileId: string): Promise<void> {
        try {
            const result = await this.profileModel.updateOne(
                { _id: userId },
                { $addToSet: { matches: profileId } },
            );

            this.logger.log(`Profiles ${userId} and ${profileId} have been matched.`);
            const profile = await this.profileModel.findById(profileId).exec();
            const areTheyMatched = profile.matches.includes(userId)

            if (areTheyMatched) { console.log('Thre is a match. Trigger notification') }

        } catch (error) {
            this.logger.error('Error matching profiles', error.stack);
            throw new InternalServerErrorException('Failed to match profiles');
        }
    }
    async unmatchProfiles(userId: string, profileId: string): Promise<void> {
        try {
            await this.profileModel.updateOne(
                { _id: userId },
                { $pull: { matches: profileId } }
            );


            this.logger.log(`Profiles ${userId} and ${profileId} have been unmatched.`);
        } catch (error) {
            this.logger.error('Error unmatching profiles', error.stack);
            throw new InternalServerErrorException('Failed to unmatch profiles');
        }
    }

}
