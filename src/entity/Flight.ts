import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  from!: string;

  @Column()
  to!: string;

  @Column()
  date!: string;

  @Column({ nullable: true })
  price!: number;
}
