
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

    //   async create(createCatDto: CreateProfileDto): Promise<Profile> {
    // console.log('createCatDto in service', createCatDto)
    //     const createdCat = new this.profileModel(createCatDto);
    //     console.log('createdCat', createdCat)
    //     return createdCat.save();
    //   }
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
            console.log('queryParams', queryParams)

            if (queryParams.location) {
                query['location'] = queryParams.location;
            }
            if (queryParams.danceStyle) {
                query["danceStyles"] = { $in: queryParams.danceStyle.split(',') }; // Expecting comma-separated values
            }
            if (queryParams.danceLevel) {
                query["danceLevel"] = queryParams.danceLevel;
            }
            if (queryParams.role) {
                query['role'] = queryParams.role;
            }
            // if (queryParams.lookingForFriends !== undefined) {
            //     query["lookingForFriends"] = queryParams.lookingForFriends === 'true';
            //   }
            console.log('query', query)
            return await this.profileModel.find(query).skip(skip).limit(limit).exec();
        } catch (error) {
            this.logger.error('Error fetching all profiles', error.stack);
            throw new InternalServerErrorException('Failed to retrieve profiles');
        }
    }
    //   async findAll(): Promise<Profile[]> {
    //     return this.profileModel.find().exec();
    //   }
    //   async findOne(id: string): Promise<Profile> {
    //     return this.profileModel.findOne({ _id: id }).exec();
    //   }

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

    //   async update(id: string, updateCatDto: UpdateProfileDto): Promise<Profile> {
    //     return this.profileModel
    //       .findByIdAndUpdate({ _id: id }, updateCatDto, { new: true })
    //       .exec();
    //   }

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


    //   async delete(id: string): Promise<Profile> {
    //     const deletedCat = await this.profileModel
    //       .findByIdAndDelete({ _id: id })
    //       .exec();
    //     return deletedCat;
    //   }

    async delete(id: string): Promise<Profile> {
        // if (!isValidObjectId(id)) {
        //   throw new BadRequestException(`Invalid ID format: ${id}`);
        // }

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
}
