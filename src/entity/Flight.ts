import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['from', 'to', 'date'])
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
