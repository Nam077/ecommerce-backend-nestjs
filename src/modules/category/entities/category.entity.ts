import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({
    name: 'categories',
})
export class Category {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id',
        unsigned: true,
        comment: 'Id of category',
    })
    id: number;

    @Column({
        type: 'varchar',
        name: 'name',
        length: 255,
        nullable: false,
        comment: 'Name of category',
    })
    name: string;

    @Column({
        type: 'varchar',
        name: 'slug',
        length: 255,
        nullable: false,
        unique: true,
        comment: 'Slug of category',
    })
    slug: string;

    @Column({
        type: 'text',
        name: 'description',
        default: null,
        nullable: true,
        comment: 'Description of category',
    })
    description: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at',
        nullable: false,
        comment: 'Created date of category',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at',
        nullable: false,
        comment: 'Updated date of category',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        nullable: true,
        comment: 'Deleted date of category',
    })
    deletedAt: Date;

    @OneToMany(() => Category, (category) => category.parent)
    @JoinColumn({
        name: 'parent_id',
        referencedColumnName: 'id',
    })
    children: Category[];

    @ManyToOne(() => Category, (category) => category.children)
    @JoinColumn({
        name: 'parent_id',
        referencedColumnName: 'id',
    })
    parent: Category;
}
