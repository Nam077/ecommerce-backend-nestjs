import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';

@Entity({
    name: 'permission_categories',
})
export class PermissionCategory {
    // id, name, slug, description, created_at, updated_at, deleted_at,
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id',
        unsigned: true,
        comment: 'Id of permission category',
    })
    id: number;

    @Column({
        type: 'varchar',
        name: 'name',
        length: 255,
        nullable: false,
        comment: 'Name of permission category',
    })
    name: string;

    @Column({
        type: 'varchar',
        name: 'slug',
        length: 255,
        nullable: false,
        unique: true,
        comment: 'Slug of permission category',
    })
    slug: string;

    @Column({
        type: 'text',
        name: 'description',
        default: null,
        nullable: true,
        comment: 'Description of permission category',
    })
    description: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at',
        nullable: false,
        comment: 'Created date of permission category',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at',
        nullable: false,
        comment: 'Updated date of permission category',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        nullable: true,
        comment: 'Deleted date of permission category',
    })
    deletedAt: Date;

    // Relations with permission

    @OneToMany(() => Permission, (permission) => permission.permissionCategory)
    permissions: Permission[];
}
