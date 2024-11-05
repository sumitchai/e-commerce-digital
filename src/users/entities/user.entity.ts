import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        length: 256,
        nullable: false,
        unique: true,
    })
    username: string;

    @Column({
        type: 'varchar',
        length: 256,
        nullable: false,
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 500,
        nullable: true,
    })
    access_token: string;

    @BeforeInsert() async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10); // salt rounds
    }

    async comparePasswordAsync(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password);
    }

    @Column({
        type: 'nvarchar',
        length: 256,
        nullable: false,
    })
    name: string;

    @Column()
    role: string

    @CreateDateColumn({
        type: 'datetime',
    })
    created_at: Date

    @UpdateDateColumn({ type: 'datetime' })
    updated_at: Date

    @DeleteDateColumn({ type: 'datetime' })
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
