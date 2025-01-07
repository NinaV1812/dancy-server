import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './schemas/profile.schema';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post()
  async create(@Body() createCatDto: CreateProfileDto) {
    console.log('createCatDto', createCatDto)
    return this.profileService.create(createCatDto);
  }

  // @Get()
  // async findAll(): Promise<Profile[]> {
  //   return this.profileService.findAll();
  // }

  @Get()
  async findAll(
    @Query() queryParams: { role?: string; location?: string; danceLevel?: string; danceStyle?: string; lookingForFriends?: boolean, skip?: string, limit?: string }
  ): Promise<Profile[]> {
    const skip = parseInt(queryParams.skip) || 0;
    const limit = parseInt(queryParams.limit) || 10;
    return this.profileService.findAll(queryParams, skip, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Profile> {
    return this.profileService.findOne(id);
  }

  @Post(':id')
  async update(@Param('id') id: string, @Body() updateCatDto: UpdateProfileDto) {
    return this.profileService.update(id, updateCatDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.profileService.delete(id);
  }
}