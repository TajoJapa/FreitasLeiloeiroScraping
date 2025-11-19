import { Link } from 'react-router-dom';
import { LotLog } from '../types/log';

interface Props {
  logs: LotLog[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function LogsTable({ logs, total, page, limit, onPageChange }: Props) {
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="card">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Data captura</th>
              <th>Leilão</th>
              <th>Lote</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.dataCaptura).toLocaleString()}</td>
                <td>{log.leilaoId ?? '-'}</td>
                <td>{log.loteNumero ?? '-'}</td>
                <td>
                  <Link to={`/logs/${log.id}`}>Ver detalhes</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span>
          Página {page} de {totalPages}
        </span>
        <div>
          <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            Anterior
          </button>
          <button type="button" style={{ marginLeft: '0.5rem' }} onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
