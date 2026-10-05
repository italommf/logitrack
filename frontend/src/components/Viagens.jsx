import { useEffect, useState } from 'react'
import { api } from '../api'
import * as formatar from '../formatar'
import ViagemForm from './ViagemForm'

export default function Viagens({ veiculos }) {
  const [viagens, setViagens] = useState([])
  // null = formulário fechado | {} = nova viagem | viagem = editando essa viagem
  const [emEdicao, setEmEdicao] = useState(null)

  function carregar() {
    api.listarViagens().then(setViagens)
  }

  useEffect(carregar, [])

  async function salvar(dados) {
    if (emEdicao.id) {
      await api.atualizarViagem(emEdicao.id, dados)
    } else {
      await api.criarViagem(dados)
    }
    setEmEdicao(null)
    carregar()
  }

  async function excluir(viagem) {
    if (!confirm(`Excluir a viagem ${viagem.origem} → ${viagem.destino}?`)) return
    await api.excluirViagem(viagem.id)
    carregar()
  }

  return (
    <section>
      <div className="titulo-secao">
        <h2>Viagens</h2>
        {!emEdicao && <button className="primario" onClick={() => setEmEdicao({})}>Nova viagem</button>}
      </div>

      {emEdicao && (
        <ViagemForm
          viagem={emEdicao}
          veiculos={veiculos}
          onSalvar={salvar}
          onCancelar={() => setEmEdicao(null)}
        />
      )}

      <div className="tabela-container">
        <table>
          <thead>
            <tr>
              <th>Veículo</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Saída</th>
              <th>Chegada</th>
              <th className="numero">KM</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {viagens.map((v) => (
              <tr key={v.id}>
                <td>{v.veiculo_placa} <span className="suave">{v.veiculo_modelo}</span></td>
                <td>{v.origem}</td>
                <td>{v.destino}</td>
                <td>{formatar.dataHora(v.data_saida)}</td>
                <td>{formatar.dataHora(v.data_chegada)}</td>
                <td className="numero">{formatar.km(v.km_percorrida)}</td>
                <td className="acoes">
                  <button onClick={() => setEmEdicao(v)}>Editar</button>
                  <button className="perigo" onClick={() => excluir(v)}>Excluir</button>
                </td>
              </tr>
            ))}
            {viagens.length === 0 && (
              <tr><td colSpan="7" className="suave">Nenhuma viagem cadastrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
