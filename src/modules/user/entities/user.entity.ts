import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@Entity({
    name: 'users',
    engine: 'InnoDB',
})
export class User {
    // id, name, email, password, created_at, updated_at, deleted_at,
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id',
        unsigned: true,
        comment: 'Id of user',
    })
    id: number;

    @Column({
        type: 'varchar',
        name: 'name',
        length: 255,
        nullable: false,
        comment: 'Name of user',
    })
    name: string;

    @Column({
        type: 'varchar',
        name: 'email',
        length: 255,
        nullable: false,
        unique: true,
        comment: 'Email of user',
    })
    email: string;

    @Column({
        type: 'text',
        name: 'password',
        nullable: false,
        comment: 'Password of user',
    })
    password: string;

    @Column({
        type: 'text',
        name: 'refresh_token',
        nullable: true,
        comment: 'Refresh token of user',
    })
    refreshToken: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at',
        nullable: false,
        comment: 'Created date of user',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at',
        nullable: false,
        comment: 'Updated date of user',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        nullable: true,
    })
    deletedAt: Date;

    @ManyToMany(() => Role, (role) => role.users)
    roles: Role[];
}
