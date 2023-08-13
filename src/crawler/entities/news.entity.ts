import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  source: string;

  @Column({ type: 'longtext' })
  news: string;

  @Column({ type: 'datetime' })
  update_time: Date;
}
