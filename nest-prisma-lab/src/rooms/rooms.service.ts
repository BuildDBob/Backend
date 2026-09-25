/*
AI Declaration:
No Generative AI tools were used for this lab.
All code was written manually by the student.

Reflection:
I practiced validation pipe in nestjs, error handling, and logging. 
]
*/





import { Logger, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('RoomsService');

  async create(createRoomDto: CreateRoomDto) {
    try {
      this.logger.log(`Creating room: ${createRoomDto.name}`);
      return await this.prisma.rooms.create({
        data: {
          name: createRoomDto.name,
          description: createRoomDto.description,
          capacity: createRoomDto.capacity,
          price_per_night: createRoomDto.price_per_night,
          image_url: createRoomDto.image_url,
          is_active: createRoomDto.is_active
        }
      });
    } catch (e: any) {
      if (typeof e?.message === 'string' && e.message.toLowerCase().includes('unique'))
      {
        this.logger.log(`Error: cannot create`);
        throw new BadRequestException('tag_number must be unique');
      }
      throw new BadRequestException(e?.message ?? 'Create failed');
    }
  }

  findAll() {
    this.logger.log(`Fetching all rooms`)
    return this.prisma.rooms.findMany();
  }

  async findARoom(id: number) {
    this.logger.log(`Fetching room id=${id}`);
    const room = await this.prisma.rooms.findUnique( { where: {id}});
    if (!room) {
      this.logger.log(`Room ${id} not found`);
      throw new NotFoundException(`Room ${id} not found`);
    }
    return room;
  }

  async disable(id: number) {
    this.logger.log(`Disabling room id=${id}`);
    await this.findARoom(id);

    return this.prisma.rooms.update({
      where: {id},
      data: { is_active: false},
    });
  }

  async enable(id: number) {
    this.logger.log(`Enabling room id=${id}`);
    await this.findARoom(id);

    return this.prisma.rooms.update({
      where: {id},
      data: { is_active: true},
    });
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
