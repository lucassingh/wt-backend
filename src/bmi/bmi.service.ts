import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBmiDto } from './dto/create-bmi.dto';
import { UpdateBmiDto } from './dto/update-bmi.dto';
import { BMICategory, UserBmi } from './entities/bmi.entity';

function calcBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function getBmiCategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'Bajo peso';
  if (bmi < 25)   return 'Peso saludable';
  if (bmi < 30)   return 'Sobrepeso';
  if (bmi < 35)   return 'Obesidad grado I';
  if (bmi < 40)   return 'Obesidad grado II';
  return 'Obesidad grado III';
}

@Injectable()
export class BmiService {
  constructor(
    @InjectRepository(UserBmi)
    private readonly bmiRepository: Repository<UserBmi>,
  ) {}

  create(userId: string, dto: CreateBmiDto): Promise<UserBmi> {
    const bmi      = +calcBmi(dto.weightKg, dto.heightCm).toFixed(2);
    const category = getBmiCategory(bmi);
    const record   = this.bmiRepository.create({ ...dto, userId, bmi, category });
    return this.bmiRepository.save(record);
  }

  findAll(userId: string): Promise<UserBmi[]> {
    return this.bmiRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<UserBmi> {
    const record = await this.bmiRepository.findOne({ where: { id } });
    if (!record) throw new NotFoundException('BMI record not found');
    if (record.userId !== userId) throw new ForbiddenException();
    return record;
  }

  async update(id: string, userId: string, dto: UpdateBmiDto): Promise<UserBmi> {
    const record = await this.findOne(id, userId);
    Object.assign(record, dto);
    const bmi      = +calcBmi(Number(record.weightKg), Number(record.heightCm)).toFixed(2);
    record.bmi      = bmi;
    record.category = getBmiCategory(bmi);
    return this.bmiRepository.save(record);
  }

  async remove(id: string, userId: string): Promise<void> {
    const record = await this.findOne(id, userId);
    await this.bmiRepository.remove(record);
  }
}
