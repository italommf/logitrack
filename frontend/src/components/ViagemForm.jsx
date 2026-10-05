import { useState } from 'react'

// O campo <input type="datetime-local"> usa o formato "2024-05-01T08:00",
// então cortamos os segundos que vêm do backend.
function paraInput(texto) {
  return texto ? texto.slice(0, 16) : ''
}

export default function ViagemForm({ viagem, veiculos, onSalvar, onCancelar }) {
  const [campos, setCampos] = useState({
    veiculo_id: viagem.veiculo_id || '',
    data_saida: paraInput(viagem.data_saida),
    data_chegada: paraInput(viagem.data_chegada),
    origem: viagem.origem || '',
    destino: viagem.destino || '',
    km_percorrida: viagem.km_percorrida ?? '',
  })
  const [erros, setErros] = useState({})

  function alterar(evento) {
    setCampos({ ...campos, [evento.target.name]: evento.target.value })
  }

  async function enviar(evento) {
    evento.preventDefault()
    try {
      await onSalvar({ ...campos, data_chegada: campos.data_chegada || null })
    } catch (resposta) {
      // O backend devolve {"erros": {"campo": ["mensagem"]}}
      setErros(resposta?.erros || { geral: ['Erro ao salvar a viagem.'] })
    }
  }

  // Mostra a primeira mensagem de erro do campo, se houver.
  function erro(campo) {
    return erros[campo] ? <span className="erro">{erros[campo][0]}</span> : null
  }

  return (
    <form className="cartao formulario" onSubmit={enviar}>
      <h3>{viagem.id ? 'Editar viagem' : 'Nova viagem'}</h3>
      {erro('geral')}

      <label>
        Veículo
        <select name="veiculo_id" value={campos.veiculo_id} onChange={alterar} required>
          <option value="">Selecione...</option>
          {veiculos.map((v) => (
            <option key={v.id} value={v.id}>{v.placa} — {v.modelo} ({v.tipo})</option>
          ))}
        </select>
        {erro('veiculo')}
      </label>

      <label>
        Saída
        <input type="datetime-local" name="data_saida" value={campos.data_saida} onChange={alterar} required />
        {erro('data_saida')}
      </label>

      <label>
        Chegada
        <input type="datetime-local" name="data_chegada" value={campos.data_chegada} onChange={alterar} />
        {erro('data_chegada')}
      </label>

      <label>
        Cidade de origem
        <input name="origem" value={campos.origem} onChange={alterar} maxLength="100" required />
        {erro('origem')}
      </label>

      <label>
        Cidade de destino
        <input name="destino" value={campos.destino} onChange={alterar} maxLength="100" required />
        {erro('destino')}
      </label>

      <label>
        Quilometragem percorrida
        <input type="number" name="km_percorrida" value={campos.km_percorrida} onChange={alterar} min="0" step="0.01" required />
        {erro('km_percorrida')}
      </label>

      <div className="botoes">
        <button type="button" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="primario">Salvar</button>
      </div>
    </form>
  )
}
