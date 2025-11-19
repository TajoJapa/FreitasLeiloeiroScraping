import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'lot_logs' })
@Index(['leilaoId', 'loteNumero', 'hashConteudo'])
export class LotLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  urlLote!: string;

  @Column({ nullable: true })
  leilaoId?: string;

  @Column({ nullable: true })
  loteNumero?: string;

  @Column({ type: 'text' })
  descricaoCompleta!: string;

  @Column({ type: 'timestamptz' })
  dataCaptura!: Date;

  @Column({ nullable: true })
  hashConteudo?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  criadoEm!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  atualizadoEm!: Date;
}
