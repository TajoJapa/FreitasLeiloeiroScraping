import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FilterLogsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  leilaoId?: string;

  @IsOptional()
  @IsString()
  loteNumero?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsDateString()
  dataInicial?: string;

  @IsOptional()
  @IsDateString()
  dataFinal?: string;
}
