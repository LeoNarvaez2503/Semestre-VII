import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Vehiculo {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    placa!: string;

    @Column()
    marca!: string;

    @Column()
    modelo!: string;

    @Column()
    anio!: number;
}
