import { ColumnNumericTransformer } from 'src/database/transformers/column-numeric-transformer';
import { Category } from '../../categories/entities/category.entity';
import { Company } from '../../companies/entities/company.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
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

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Company, (company) => company.payments)
  company: Company;

  @ManyToOne(() => Category, (category) => category.payments)
  category?: Category;
}
