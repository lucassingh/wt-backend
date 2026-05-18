import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserWeightDto } from './dto/create-user-weight.dto';
import { UpdateUserWeightDto } from './dto/update-user-weight.dto';
import { UserWeight } from './entities/user-weight.entity';

@Injectable()
export class UserWeightService {
  constructor(
    @InjectRepository(UserWeight)
    private readonly weightRepository: Repository<UserWeight>,
  ) {}

  create(userId: string, dto: CreateUserWeightDto): Promise<UserWeight> {
    const weight = this.weightRepository.create({ ...dto, userId });
    return this.weightRepository.save(weight);
  }

  findAll(userId: string): Promise<UserWeight[]> {
    return this.weightRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<UserWeight> {
    const weight = await this.weightRepository.findOne({ where: { id } });

    if (!weight) throw new NotFoundException('Weight record not found');
    if (weight.userId !== userId) throw new ForbiddenException();

    return weight;
  }

  async update(id: string, userId: string, dto: UpdateUserWeightDto): Promise<UserWeight> {
    const weight = await this.findOne(id, userId);
    Object.assign(weight, dto);
    return this.weightRepository.save(weight);
  }

  async remove(id: string, userId: string): Promise<void> {
    const weight = await this.findOne(id, userId);
    await this.weightRepository.remove(weight);
  }
}
