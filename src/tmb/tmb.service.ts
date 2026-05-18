import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTmbDto } from './dto/create-tmb.dto';
import { UpdateTmbDto } from './dto/update-tmb.dto';
import { Gender, Goal, GoalAggressiveness, UserTmb } from './entities/tmb.entity';

function harrisBenedict(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  return gender === 'M'
    ? 66 + 13.7 * weightKg + 5 * heightCm - 6.8 * age
    : 655 + 9.6 * weightKg + 1.8 * heightCm - 4.7 * age;
}

const GOAL_ADJUSTMENTS: Record<Exclude<Goal, 'maintain'>, Record<GoalAggressiveness, number>> = {
  loss: { normal: -500, moderate: -700, aggressive: -1000 },
  gain: { normal:  300, moderate:  500, aggressive:   700 },
};

function calcTargetCalories(
  tdee: number,
  goal: Goal,
  aggressiveness?: GoalAggressiveness,
): number {
  if (goal === 'maintain') return tdee;
  return tdee + GOAL_ADJUSTMENTS[goal][aggressiveness ?? 'normal'];
}

@Injectable()
export class TmbService {
  constructor(
    @InjectRepository(UserTmb)
    private readonly tmbRepository: Repository<UserTmb>,
  ) {}

  create(userId: string, dto: CreateTmbDto): Promise<UserTmb> {
    const bmr  = +harrisBenedict(dto.gender, dto.weightKg, dto.heightCm, dto.age).toFixed(2);
    const tdee = +(bmr * dto.activityCoefficient).toFixed(2);
    const targetCalories = +calcTargetCalories(tdee, dto.goal, dto.goalAggressiveness).toFixed(2);
    const record = this.tmbRepository.create({ ...dto, userId, bmr, tdee, targetCalories });
    return this.tmbRepository.save(record);
  }

  findAll(userId: string): Promise<UserTmb[]> {
    return this.tmbRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<UserTmb> {
    const record = await this.tmbRepository.findOne({ where: { id } });
    if (!record) throw new NotFoundException('TMB record not found');
    if (record.userId !== userId) throw new ForbiddenException();
    return record;
  }

  async update(id: string, userId: string, dto: UpdateTmbDto): Promise<UserTmb> {
    const record = await this.findOne(id, userId);
    Object.assign(record, dto);
    const bmr  = +harrisBenedict(
      record.gender,
      Number(record.weightKg),
      Number(record.heightCm),
      record.age,
    ).toFixed(2);
    const tdee = +(bmr * Number(record.activityCoefficient)).toFixed(2);
    record.bmr  = bmr;
    record.tdee = tdee;
    if (record.goal) {
      record.targetCalories = +calcTargetCalories(tdee, record.goal, record.goalAggressiveness).toFixed(2);
    }
    return this.tmbRepository.save(record);
  }

  async remove(id: string, userId: string): Promise<void> {
    const record = await this.findOne(id, userId);
    await this.tmbRepository.remove(record);
  }
}
