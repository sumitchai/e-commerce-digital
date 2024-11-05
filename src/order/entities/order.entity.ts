import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    product_id: number

    @Column()
    user_id: number

    @Column()
    quantity: number

    @Column()
    ref_no:string;

    @Column("decimal",{ 
        precision: 45,
        scale: 2,
        nullable: true 
    })
    amount: number

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
