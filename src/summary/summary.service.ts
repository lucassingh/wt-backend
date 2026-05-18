import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBmi } from '../bmi/entities/bmi.entity';
import { UserTmb } from '../tmb/entities/tmb.entity';
import { UserWeight } from '../user-weight/entities/user-weight.entity';

@Injectable()
export class SummaryService {
  constructor(
    @InjectRepository(UserWeight) private weightRepo: Repository<UserWeight>,
    @InjectRepository(UserBmi)   private bmiRepo:    Repository<UserBmi>,
    @InjectRepository(UserTmb)   private tmbRepo:    Repository<UserTmb>,
  ) {}

  async getSummary(userId: string) {
    const [weights, bmis, tmbs] = await Promise.all([
      this.weightRepo.find({ where: { userId }, order: { date: 'ASC' } }),
      this.bmiRepo.find({ where: { userId }, order: { date: 'DESC' } }),
      this.tmbRepo.find({ where: { userId }, order: { date: 'DESC' } }),
    ]);

    /* ── Weight ── */
    const latestW = weights[weights.length - 1] ?? null;
    const prevW   = weights[weights.length - 2] ?? null;

    const now      = new Date(); now.setHours(0, 0, 0, 0);
    const weekAgo  = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(now); monthAgo.setDate(monthAgo.getDate() - 30);
    const thirtyAgo = new Date(now); thirtyAgo.setDate(thirtyAgo.getDate() - 30);

    const weekEntry  = weights.filter((w) => new Date(w.date) <= weekAgo).slice(-1)[0]  ?? null;
    const monthEntry = weights.filter((w) => new Date(w.date) <= monthAgo).slice(-1)[0] ?? null;

    const wVals = weights.map((w) => Number(w.weight));

    const last30Days = weights
      .filter((w) => new Date(w.date) >= thirtyAgo)
      .map((w) => ({ date: w.date, weight: Number(w.weight) }));

    /* ── BMI ── */
    const latestBmi = bmis[0] ?? null;
    const prevBmi   = bmis[1] ?? null;

    /* ── TMB ── */
    const latestTmb = tmbs[0] ?? null;

    return {
      weight: {
        total: weights.length,
        latest: latestW
          ? { date: latestW.date, weight: Number(latestW.weight) }
          : null,
        previousWeight: prevW ? Number(prevW.weight) : null,
        weekChange: latestW && weekEntry
          ? +(Number(latestW.weight) - Number(weekEntry.weight)).toFixed(2)
          : null,
        monthChange: latestW && monthEntry
          ? +(Number(latestW.weight) - Number(monthEntry.weight)).toFixed(2)
          : null,
        min:  wVals.length ? +Math.min(...wVals).toFixed(2) : null,
        max:  wVals.length ? +Math.max(...wVals).toFixed(2) : null,
        avg:  wVals.length
          ? +(wVals.reduce((a, b) => a + b, 0) / wVals.length).toFixed(2)
          : null,
        last30Days,
      },
      bmi: {
        total: bmis.length,
        latest: latestBmi
          ? {
              date:     latestBmi.date,
              bmi:      Number(latestBmi.bmi),
              category: latestBmi.category,
              heightCm: Number(latestBmi.heightCm),
              weightKg: Number(latestBmi.weightKg),
            }
          : null,
        previousBmi: prevBmi ? Number(prevBmi.bmi) : null,
      },
      tmb: {
        total: tmbs.length,
        latest: latestTmb
          ? {
              date:               latestTmb.date,
              bmr:                Number(latestTmb.bmr),
              tdee:               Number(latestTmb.tdee),
              goal:               latestTmb.goal               ?? null,
              goalAggressiveness: latestTmb.goalAggressiveness ?? null,
              targetCalories:     latestTmb.targetCalories
                ? Number(latestTmb.targetCalories)
                : null,
            }
          : null,
      },
    };
  }
}
