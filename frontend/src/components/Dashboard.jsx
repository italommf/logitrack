import { useEffect, useState } from 'react'
import { api } from '../api'
import * as formatar from '../formatar'

export default function Dashboard({ veiculos }) {
  const [dados, setDados] = useState(null)
  const [veiculoId, setVeiculoId] = useState('')

  // Busca de novo sempre que o filtro de veículo muda.
  useEffect(() => {
    api.dashboard(veiculoId).then(setDados)
  }, [veiculoId])

  if (!dados) return <p className="suave">Carregando...</p>

  const maiorVolume = Math.max(...dados.volume_por_categoria.map((c) => c.quantidade), 1)
  const maiorKm = Math.max(...dados.ranking_utilizacao.map((r) => r.total_km), 1)
  const lider = dados.ranking_utilizacao[0]

  return (
    <section className="dashboard">
      <h2>Dashboard</h2>

      <div className="indicadores">
        <div className="cartao">
          <div className="rotulo">Total de KM percorrido</div>
          <div className="valor">{formatar.km(dados.total_km)}</div>
          <select value={veiculoId} onChange={(e) => setVeiculoId(e.target.value)}>
            <option value="">Toda a frota</option>
            {veiculos.map((v) => (
              <option key={v.id} value={v.id}>{v.placa} — {v.modelo}</option>
            ))}
          </select>
        </div>

        <div className="cartao">
          <div className="rotulo">Veículo mais utilizado</div>
          <div className="valor">{lider ? lider.placa : '—'}</div>
          <div className="suave">{lider ? `${lider.modelo} · ${formatar.km(lider.total_km)}` : 'Sem viagens'}</div>
        </div>

        <div className="cartao">
          <div className="rotulo">Projeção de manutenção no mês</div>
          <div className="valor">{formatar.dinheiro(dados.projecao_financeira)}</div>
          <div className="suave">Soma dos custos estimados</div>
        </div>
      </div>

      <div className="grade">
        <div className="cartao">
          <h3>Viagens por categoria</h3>
          {dados.volume_por_categoria.map((c) => (
            <div key={c.tipo} className="barra-linha">
              <span className="barra-nome">{c.tipo === 'LEVE' ? 'Leve' : 'Pesado'}</span>
              <div className="barra-fundo">
                <div className="barra" style={{ width: `${(c.quantidade / maiorVolume) * 100}%` }} />
              </div>
              <span className="barra-valor">{c.quantidade}</span>
            </div>
          ))}
        </div>

        <div className="cartao">
          <h3>Ranking de utilização</h3>
          {dados.ranking_utilizacao.map((r, i) => (
            <div key={r.veiculo_id} className="barra-linha">
              <span className="barra-nome">{i + 1}º {r.placa}</span>
              <div className="barra-fundo">
                <div className="barra" style={{ width: `${(r.total_km / maiorKm) * 100}%` }} />
              </div>
              <span className="barra-valor">{formatar.km(r.total_km)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cartao">
        <h3>Próximas manutenções</h3>
        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>Início</th>
                <th>Previsão de término</th>
                <th>Veículo</th>
                <th>Serviço</th>
                <th>Status</th>
                <th className="numero">Custo estimado</th>
              </tr>
            </thead>
            <tbody>
              {dados.proximas_manutencoes.map((m) => (
                <tr key={m.id}>
                  <td>{formatar.data(m.data_inicio)}</td>
                  <td>{formatar.data(m.data_finalizacao)}</td>
                  <td>{m.placa} <span className="suave">{m.modelo}</span></td>
                  <td>{m.tipo_servico}</td>
                  <td><span className={'etiqueta ' + m.status}>{formatar.status(m.status)}</span></td>
                  <td className="numero">{formatar.dinheiro(m.custo_estimado)}</td>
                </tr>
              ))}
              {dados.proximas_manutencoes.length === 0 && (
                <tr><td colSpan="6" className="suave">Nenhuma manutenção agendada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
