import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum AllowedValutes {
    DOLLAR='USD',
    EURO='EUR'
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    userId: string;

    @Column({
        type: "decimal",
        scale: 2,
        nullable: false,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        },
    })
    balanceOfValute: number;

    // increment for each user
    @Column({ nullable: false })
    orderNumber: number;

    @Column({ type: 'enum', enum: AllowedValutes, nullable: false })
    valuteCode: AllowedValutes;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}