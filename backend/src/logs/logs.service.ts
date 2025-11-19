import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LotLog } from './entities/lot-log.entity';
import { FilterLogsDto } from './dto/filter-logs.dto';
import { createHash } from 'crypto';

interface CreateLogPayload {
  urlLote: string;
  leilaoId?: string;
  loteNumero?: string;
  descricaoCompleta: string;
  dataCaptura: Date;
}

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(LotLog)
    private readonly repository: Repository<LotLog>,
  ) {}

  async createIfChanged(payload: CreateLogPayload): Promise<LotLog | null> {
    const hash = this.hashDescricao(payload.descricaoCompleta);
    const existing = await this.repository.findOne({
      where: {
        leilaoId: payload.leilaoId,
        loteNumero: payload.loteNumero,
        hashConteudo: hash,
      },
    });

    if (existing) {
      return null;
    }

    const log = this.repository.create({
      ...payload,
      hashConteudo: hash,
    });
    return this.repository.save(log);
  }

  async findAll(filter: FilterLogsDto) {
    const { page = 1, limit = 20, leilaoId, loteNumero, descricao, dataInicial, dataFinal } = filter;
    const qb = this.repository.createQueryBuilder('log');

    if (leilaoId) {
      qb.andWhere('log.leilaoId ILIKE :leilaoId', { leilaoId: `%${leilaoId}%` });
    }
    if (loteNumero) {
      qb.andWhere('log.loteNumero ILIKE :loteNumero', { loteNumero: `%${loteNumero}%` });
    }
    if (descricao) {
      qb.andWhere('log.descricaoCompleta ILIKE :descricao', { descricao: `%${descricao}%` });
    }
    if (dataInicial) {
      qb.andWhere('log.dataCaptura >= :dataInicial', { dataInicial });
    }
    if (dataFinal) {
      qb.andWhere('log.dataCaptura <= :dataFinal', { dataFinal });
    }

    qb.orderBy('log.dataCaptura', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const log = await this.repository.findOne({ where: { id } });
    if (!log) {
      throw new NotFoundException('Log não encontrado');
    }
    return log;
  }

  async findLastByLote(leilaoId: string, loteNumero: string) {
    const log = await this.repository.findOne({
      where: { leilaoId, loteNumero },
      order: { dataCaptura: 'DESC' },
    });
    if (!log) {
      throw new NotFoundException('Log não encontrado');
    }
    return log;
  }

  private hashDescricao(text: string) {
    return createHash('sha256').update(text).digest('hex');
  }
}
