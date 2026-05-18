import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type Gender = 'M' | 'F';
export type Goal = 'loss' | 'maintain' | 'gain';
export type GoalAggressiveness = 'normal' | 'moderate' | 'aggressive';

@Entity('user_tmb')
export class UserTmb {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'char', length: 1 })
  gender: Gender;

  @Column({ type: 'integer' })
  age: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, name: 'height_cm' })
  heightCm: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'weight_kg' })
  weightKg: number;

  /** One of: 1.2 | 1.375 | 1.55 | 1.725 | 1.9 */
  @Column({ type: 'decimal', precision: 4, scale: 3, name: 'activity_coefficient' })
  activityCoefficient: number;

  /** Harris-Benedict BMR, calculated on save */
  @Column({ type: 'decimal', precision: 7, scale: 2 })
  bmr: number;

  /** Total Daily Energy Expenditure = bmr × activityCoefficient */
  @Column({ type: 'decimal', precision: 7, scale: 2 })
  tdee: number;

  /** Caloric goal: loss | maintain | gain */
  @Column({ type: 'varchar', length: 10, nullable: true })
  goal?: Goal;

  /** How aggressive the deficit/surplus is — null when goal = maintain */
  @Column({ type: 'varchar', length: 12, nullable: true, name: 'goal_aggressiveness' })
  goalAggressiveness?: GoalAggressiveness;

  /** Target daily calories = tdee ± adjustment */
  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true, name: 'target_calories' })
  targetCalories?: number;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
