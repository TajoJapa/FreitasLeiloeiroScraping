import { useCallback, useEffect, useState } from 'react';
import Filters, { FiltersState } from '../components/Filters';
import LogsTable from '../components/LogsTable';
import api from '../api/client';
import { LotLog, PaginatedLogs } from '../types/log';

const defaultFilters: FiltersState = {
  leilaoId: '',
  loteNumero: '',
  descricao: '',
};

export default function LogsPage() {
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [data, setData] = useState<LotLog[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<PaginatedLogs>('/logs', {
        params: {
          ...filters,
          page,
          limit,
          descricao: filters.descricao,
        },
      });
      setData(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Erro ao carregar logs', error);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSubmit = () => {
    setPage(1);
    fetchLogs();
  };

  const handlePage = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
  };

  return (
    <section>
      <Filters values={filters} onChange={setFilters} onSubmit={handleSubmit} />
      {loading ? <p>Carregando...</p> : <LogsTable logs={data} total={total} page={page} limit={limit} onPageChange={handlePage} />}
    </section>
  );
}
