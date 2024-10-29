import { ColumnNumericTransformer } from '../../database/transformers/column-numeric-transformer';
import { Category } from '../../categories/entities/category.entity';
import { Company } from '../../companies/entities/company.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column()
  date: Date;

  @Column()
  companyId: number;

  @Column({ nullable: true })
  categoryId: number;

  @Column()
  description: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Company, (company) => company.payments, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  company: Company;

  @ManyToOne(() => Category, (category) => category.payments, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  category?: Category;
}
