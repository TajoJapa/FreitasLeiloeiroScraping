import { FormEvent } from 'react';

export interface FiltersState {
  leilaoId: string;
  loteNumero: string;
  descricao: string;
}

interface Props {
  values: FiltersState;
  onChange: (values: FiltersState) => void;
  onSubmit: () => void;
}

export default function Filters({ values, onChange, onSubmit }: Props) {
  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    onChange({ ...values, [name]: value });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="filters" onSubmit={handleSubmit}>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
        <label>
          Leilão ID
          <input name="leilaoId" value={values.leilaoId} onInput={handleInput} placeholder="7517" />
        </label>
        <label>
          Lote Nº
          <input name="loteNumero" value={values.loteNumero} onInput={handleInput} placeholder="84" />
        </label>
        <label>
          Texto na descrição
          <input name="descricao" value={values.descricao} onInput={handleInput} placeholder="ex: GOL" />
        </label>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button type="submit">Filtrar</button>
      </div>
    </form>
  );
}
