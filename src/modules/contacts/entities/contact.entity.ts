// contact.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity('contacts')
// Garante unicidade do par (userId, email) e do par (userId, phone)
@Unique(['userId', 'email'])
@Unique(['userId', 'phone'])
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  lastName: string;

  // Removido o unique global e permitido null para respeitar a constraint única por usuário
  @Column({ type: 'varchar', nullable: true, default: null })
  email: string;

  @Column({ type: 'varchar', nullable: true, default: null })
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