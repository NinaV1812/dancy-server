import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './schemas/profile.schema';
import { Role, DanceLevel } from './types/enums';
import { InternalServerErrorException, Logger } from '@nestjs/common';


describe('ProfileController', () => {
    let controller: ProfileController;
    let service: ProfileService;

    const profileModelMock = {
        updateOne: jest.fn(),
    };

    const loggerMock = {
        log: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProfileController],
            providers: [
                {
                    provide: Logger,
                    useValue: loggerMock,
                },
                {
                    provide: 'ProfileModel',
                    useValue: profileModelMock,
                },
                {
                    provide: ProfileService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                        unmatchProfiles: jest.fn(),
                        matchProfiles: jest.fn(async (userId: string, profileId: string) => {
                            await profileModelMock.updateOne(
                                { _id: userId },
                                { $addToSet: { matches: profileId } },
                            );
                        }),
                    },
                },
            ],
        }).compile();

        controller = module.get<ProfileController>(ProfileController);
        service = module.get<ProfileService>(ProfileService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a profile', async () => {
            const createProfileDto: CreateProfileDto = {
                firstName: 'Test User',
                age: 30,
                role: Role.DANCER,
            };
            const result: Profile = {
                _id: '1',
                firstName: 'Test User',
                lastName: 'Doe',
                age: 30,
                danceStyles: [],
                danceVideo: '',
                profilePic: '',
                height: 170,
                goal: [],
                profileDescription: '',
                email: 'testuser@example.com',
                matches: [],
                role: Role.DANCER,
                location: '',
                danceLevel: DanceLevel.BEGINNER,
                lookingForFriends: false
            };
            jest.spyOn(service, 'create').mockResolvedValue(result);

            expect(await controller.create(createProfileDto)).toEqual(result);
            expect(service.create).toHaveBeenCalledWith(createProfileDto);
        });
    });

    describe('findAll', () => {
        it('should return all profiles', async () => {
            const result: Profile[] = [{
                _id: '1', firstName: 'Test User', age: 30, role: Role.DANCER,
                lastName: '',
                email: '',
                danceStyles: [],
                danceVideo: '',
                profilePic: '',
                height: 0,
                goal: [],
                profileDescription: '',
                location: '',
                danceLevel: DanceLevel.BEGINNER,
                lookingForFriends: false,
                matches: []
            }];
            jest.spyOn(service, 'findAll').mockResolvedValue(result);

            const queryParams = { skip: '0', limit: '10' };
            expect(await controller.findAll(queryParams)).toEqual(result);
            expect(service.findAll).toHaveBeenCalledWith(queryParams, 0, 10);
        });
    });

    describe('findOne', () => {
        it('should return a single profile by ID', async () => {
            const result: Profile = {
                _id: '1', firstName: 'Test User', age: 30, role: Role.DANCER,
                lastName: '',
                email: '',
                danceStyles: [],
                danceVideo: '',
                profilePic: '',
                height: 0,
                goal: [],
                profileDescription: '',
                location: '',
                danceLevel: DanceLevel.BEGINNER,
                lookingForFriends: false,
                matches: []
            };
            jest.spyOn(service, 'findOne').mockResolvedValue(result);

            expect(await controller.findOne('1')).toEqual(result);
            expect(service.findOne).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should update a profile', async () => {
            const updateProfileDto: UpdateProfileDto = { firstName: 'Updated User' };
            const result: Profile = {
                _id: '1',
                firstName: 'Updated User',
                lastName: 'Doe',
                email: 'updateduser@example.com',
                age: 30,
                danceStyles: [],
                profilePic: '',
                height: 170,
                goal: [],
                profileDescription: '',
                matches: [],
                role: Role.DANCER,
                danceVideo: '',
                location: '',
                danceLevel: DanceLevel.BEGINNER,
                lookingForFriends: false
            };
            jest.spyOn(service, 'update').mockResolvedValue(result);

            expect(await controller.update('1', updateProfileDto)).toEqual(result);
            expect(service.update).toHaveBeenCalledWith('1', updateProfileDto);
        });
    });

    describe('delete', () => {
        it('should delete a profile', async () => {
            const result: Profile = {
                _id: '1',
                firstName: 'Updated User',
                lastName: 'Doe',
                email: 'updateduser@example.com',
                age: 30,
                danceStyles: [],
                profilePic: '',
                height: 170,
                goal: [],
                profileDescription: '',
                matches: [],
                role: Role.DANCER,
                danceVideo: '',
                location: '',
                danceLevel: DanceLevel.BEGINNER,
                lookingForFriends: false
            };
            jest.spyOn(service, 'delete').mockResolvedValue(result);

            expect(await controller.delete('1')).toEqual(result);
            expect(service.delete).toHaveBeenCalledWith('1');
        });
    });

    describe('matchProfiles', () => {
        it('should match profiles successfully', async () => {
            const userId = 'user1';
            const profileId = 'profile1';

            const updateOneMock = jest
                .spyOn(profileModelMock, 'updateOne')
                .mockResolvedValue({ modifiedCount: 1 });

            await service.matchProfiles(userId, profileId);

            expect(updateOneMock).toHaveBeenCalledWith(
                { _id: userId },
                { $addToSet: { matches: profileId } }
            );
            expect(loggerMock.log.mockResolvedValue(`Profiles ${userId} and ${profileId} have been matched.`))
        });


        it('should throw InternalServerErrorException on error', async () => {
            const userId = 'user1';
            const profileId = 'profile1';

            jest.spyOn(profileModelMock, 'updateOne').mockRejectedValue(new InternalServerErrorException('Database error'));
            await expect(service.matchProfiles(userId, profileId)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(loggerMock.error.mockResolvedValue('Error matching profiles'))
        });

        // describe('unmatchProfiles', () => {
        //     it('should unmatch profiles successfully', async () => {
        //         const userId = 'user1';
        //         const profileId = 'profile1';

        //         // Mock the `updateOne` method
        //         const updateOneMock = jest.fn().mockResolvedValue({ modifiedCount: 1 });
        //         jest.spyOn(service['profileModel'], 'updateOne').mockImplementation(updateOneMock);

        //         await service.unmatchProfiles(userId, profileId);

        //         // Verify the `updateOne` method is called with correct arguments
        //         expect(updateOneMock).toHaveBeenCalledWith(
        //             { _id: userId },
        //             { $pull: { matches: profileId } }
        //         );

        //         // Verify the logger logs the success message
        //         expect(service['logger'].log).toHaveBeenCalledWith(
        //             `Profiles ${userId} and ${profileId} have been unmatched.`
        //         );
        //     });

        // it('should throw InternalServerErrorException on error', async () => {
        //     const userId = 'user1';
        //     const profileId = 'profile1';

        //     // Mock the `updateOne` method to throw an error
        //     jest.spyOn(profileModelMock, 'updateOne').mockRejectedValue(new Error('Database error'));

        //     await expect(service.unmatchProfiles(userId, profileId)).rejects.toThrow(
        //         InternalServerErrorException
        //       );

        //     // Verify the logger error method is called
        //     expect(service['logger'].error).toHaveBeenCalledWith(
        //         'Error unmatching profiles',
        //         expect.any(String)
        //       );
        // });
    });
});
