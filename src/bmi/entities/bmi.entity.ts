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

export type BMICategory =
  | 'Bajo peso'
  | 'Peso saludable'
  | 'Sobrepeso'
  | 'Obesidad grado I'
  | 'Obesidad grado II'
  | 'Obesidad grado III';

@Entity('user_bmi')
export class UserBmi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'decimal', precision: 5, scale: 1, name: 'height_cm' })
  heightCm: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'weight_kg' })
  weightKg: number;

  /** IMC = weight_kg / (height_m)² — calculated on save */
  @Column({ type: 'decimal', precision: 4, scale: 2 })
  bmi: number;

  /** WHO classification derived from bmi */
  @Column({ type: 'varchar', length: 30 })
  category: BMICategory;

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
