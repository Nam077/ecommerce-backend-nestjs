import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    DeleteDateColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity({
    name: 'roles',
    engine: 'InnoDB',
})
export class Role {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id',
        unsigned: true,
        comment: 'Id of role',
    })
    id: number;

    @Column({
        type: 'varchar',
        name: 'name',
        length: 255,
        nullable: false,
        comment: 'Name of role',
    })
    name: string;

    @Column({
        type: 'varchar',
        name: 'slug',
        length: 255,
        nullable: false,
        unique: true,
        comment: 'Slug of role',
    })
    slug: string;

    @Column({
        type: 'text',
        name: 'description',
        default: null,
        nullable: true,
        comment: 'Description of role',
    })
    description: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at',
        nullable: false,
        comment: 'Created date of role',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at',
        nullable: false,
        comment: 'Updated date of role',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        nullable: true,
        comment: 'Deleted date of role',
    })
    deletedAt: Date;

    // Relation with User

    @ManyToMany(() => User, (user) => user.roles)
    @JoinTable({
        name: 'user_role',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    })
    users: User[];

    // Relation with Permission
    @ManyToMany(() => Permission, (permission) => permission.roles)
    permissions: Permission[];
}
