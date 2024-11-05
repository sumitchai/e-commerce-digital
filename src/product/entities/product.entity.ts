import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        length: 45,
        nullable: true
    })
    name: string;

    @Column("decimal",{ 
        precision: 45,
        scale: 2,
        nullable: true 
    })
    price: number;

    @Column()
    quantity: number

    @CreateDateColumn({
        type: 'datetime',
    })
    created_at: Date

    @UpdateDateColumn({ type: 'datetime' })
    updated_at: Date

    @DeleteDateColumn({ 
        type: 'datetime', 
        nullable: true 
    })
    deleted_at: Date

    @BeforeInsert()
    protected setCreatedAt(): void {
        this.created_at = new Date();
    }

    @BeforeUpdate()
    protected setUpdatedAt(): void {
        this.updated_at = new Date();
    }
}
