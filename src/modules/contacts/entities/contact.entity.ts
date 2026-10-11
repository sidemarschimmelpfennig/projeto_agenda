// contact.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contacts')
export class Contact{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  lastName: string;

  @Column({ type: 'varchar', nullable: false, default: '', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true, default: '', unique: true })
  phone: string;

  @Column({ type: 'integer', nullable: false })
  userId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Getter virtual para manter compatibilidade com _id
  get _id(): number {
    return this.id;
  }
}
