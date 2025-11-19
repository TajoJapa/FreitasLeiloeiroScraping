import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { load } from 'cheerio';
import { LogsService } from '../logs/logs.service';

const SEARCH_PATH = '/Leiloes/Pesquisar?query=&categoria=1';

const SELECTORS = {
  lotCard: '.card-lote, .lote, .col-lg-4',
  detailLink: 'a[href*="LoteDetalhes"], a.btn',
  lotNumber: '.lote-numero, .lot-number, .loteNumero',
  descriptionLabel: '.descricao label, .descricao strong, h4, h5',
  descriptionContainer: '.descricao, .descricao-completa, .descricaoLote',
  descriptionContent: '.descricao-texto, .descricaoDetalhe, p',
};

interface ScrapedLot {
  url: string;
  leilaoId?: string;
  loteNumero?: string;
  titulo?: string;
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(private readonly config: ConfigService, private readonly logsService: LogsService) {}

  async runSpider() {
    const baseUrl = this.config.get<string>('baseUrl') ?? 'https://www.freitasleiloeiro.com.br';
    const searchUrl = new URL(SEARCH_PATH, baseUrl).toString();
    this.logger.log(`Iniciando spider na URL ${searchUrl}`);

    const indexHtml = await this.fetchHtml(searchUrl);
    const lots = this.extractLots(indexHtml, baseUrl);
    this.logger.log(`Encontrados ${lots.length} lotes na pesquisa.`);

    const results = [];
    for (const lot of lots) {
      try {
        await this.delay();
        const detailHtml = await this.fetchHtml(lot.url);
        const descricaoCompleta = this.extractDescription(detailHtml);
        const dataCaptura = new Date();
        const created = await this.logsService.createIfChanged({
          urlLote: lot.url,
          leilaoId: lot.leilaoId,
          loteNumero: lot.loteNumero,
          descricaoCompleta,
          dataCaptura,
        });
        if (created) {
          results.push(created);
          this.logger.log(`Novo log salvo para lote ${lot.leilaoId ?? ''}-${lot.loteNumero ?? ''}`);
        } else {
          this.logger.debug(`Sem mudanças para ${lot.url}`);
        }
      } catch (error) {
        this.logger.error(`Erro processando lote ${lot.url}: ${error instanceof Error ? error.message : error}`);
      }
    }

    return { processed: lots.length, created: results.length };
  }

  private async fetchHtml(url: string) {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; FreitasSpider/1.0; +https://www.freitasleiloeiro.com.br)',
        Accept: 'text/html,application/xhtml+xml',
      },
      timeout: 15000,
    });
    return response.data as string;
  }

  private extractLots(html: string, baseUrl: string): ScrapedLot[] {
    const $ = load(html);
    const lots: ScrapedLot[] = [];
    $(SELECTORS.lotCard).each((_, card) => {
      const link = $(card).find(SELECTORS.detailLink).attr('href');
      if (!link) {
        return;
      }
      const url = new URL(link, baseUrl).toString();
      const lotNumberText = $(card).find(SELECTORS.lotNumber).text().trim();
      const identifiers = this.extractIdsFromUrl(url);
      lots.push({
        url,
        loteNumero: identifiers.loteNumero ?? lotNumberText ?? undefined,
        leilaoId: identifiers.leilaoId,
      });
    });

    return lots;
  }

  private extractDescription(html: string): string {
    const $ = load(html);
    let descriptionText = '';

    const label = $(SELECTORS.descriptionLabel).filter((_, el) =>
      /descrição completa/i.test($(el).text()),
    );

    if (label.length) {
      const container = label.closest(SELECTORS.descriptionContainer);
      if (container.length) {
        descriptionText = container
          .text()
          .replace(/descrição completa:?/i, '')
          .trim();
      } else {
        const sibling = label.nextAll(SELECTORS.descriptionContent).first();
        if (sibling.length) {
          descriptionText = sibling.text().trim();
        }
      }
    }

    if (!descriptionText) {
      descriptionText = $(SELECTORS.descriptionContainer).text().trim();
    }

    if (!descriptionText) {
      throw new Error('Descrição completa não encontrada');
    }

    return descriptionText.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n');
  }

  private extractIdsFromUrl(url: string) {
    const { searchParams } = new URL(url);
    const leilaoId = searchParams.get('leilaoId') ?? undefined;
    const loteNumero = searchParams.get('loteNumero') ?? undefined;
    return { leilaoId, loteNumero };
  }

  private async delay() {
    const ms = 1000 + Math.floor(Math.random() * 2000);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
