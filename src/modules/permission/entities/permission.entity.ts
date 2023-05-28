import {
    Entity,
    Column,
    UpdateDateColumn,
    DeleteDateColumn,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { PermissionCategory } from '../../permission-category/entities/permission-category.entity';
import { Role } from '../../role/entities/role.entity';

@Entity({
    name: 'permissions',
    engine: 'InnoDB',
})
export class Permission {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id',
        unsigned: true,
        comment: 'Id of permission',
    })
    id: number;

    @Column({
        type: 'varchar',
        name: 'name',
        length: 255,
        nullable: false,
        comment: 'Name of permission',
    })
    name: string;

    @Column({
        type: 'varchar',
        name: 'slug',
        length: 255,
        nullable: false,
        unique: true,
        comment: 'Slug of permission',
    })
    slug: string;

    @Column({
        type: 'text',
        name: 'description',
        default: null,
        nullable: true,
        comment: 'Description of permission',
    })
    description: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at',
        nullable: false,
        comment: 'Created date of permission',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at',
        nullable: false,
        comment: 'Updated date of permission',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        nullable: true,
        comment: 'Deleted date of permission',
    })
    deletedAt: Date;

    // Relation with PermissionCategory

    @ManyToOne(() => PermissionCategory, (permissionCategory) => permissionCategory.permissions)
    permissionCategory: PermissionCategory;

    // Relation with Role

    @ManyToMany(() => Role, (role) => role.permissions)
    @JoinTable({
        name: 'role_permission',
        joinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    })
    roles: Role[];
}
