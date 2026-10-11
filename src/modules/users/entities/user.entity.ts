import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({name:'name', type: 'varchar', nullable: false, default: '' })
    name: string;
    @Column({ type: 'varchar', nullable: false, default: '' })
    email: string;
    // A propriedade na classe continua sendo "password", 
    // mas o TypeORM grava e lê da coluna "password_hasher" no banco de dados
    @Column({
        name: 'password_hasher',
        type: 'varchar',
        length: 255,
        nullable: false,
        select: false, // Não traz por padrão em consultas normais
    })
    password: string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;  
}