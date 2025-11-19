import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';
import { LotLog } from '../types/log';

export default function LogDetailPage() {
  const { id } = useParams();
  const [log, setLog] = useState<LotLog | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLog() {
      try {
        const response = await api.get<LotLog>(`/logs/${id}`);
        setLog(response.data);
      } catch (err) {
        setError('Não foi possível carregar o log.');
      }
    }
    if (id) {
      fetchLog();
    }
  }, [id]);

  if (error) {
    return (
      <div className="detail-card">
        <p>{error}</p>
        <Link to="/">Voltar</Link>
      </div>
    );
  }

  if (!log) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="detail-card">
      <h2>Detalhes do log</h2>
      <p>
        <strong>Leilão:</strong> {log.leilaoId ?? '-'}
      </p>
      <p>
        <strong>Lote:</strong> {log.loteNumero ?? '-'}
      </p>
      <p>
        <strong>Data de captura:</strong> {new Date(log.dataCaptura).toLocaleString()}
      </p>
      <p>
        <strong>URL do lote:</strong>{' '}
        <a href={log.urlLote} target="_blank" rel="noreferrer">
          Abrir lote
        </a>
      </p>
      <p>
        <strong>Descrição completa:</strong>
      </p>
      <div className="description">{log.descricaoCompleta}</div>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/">Voltar</Link>
      </div>
    </div>
  );
}
