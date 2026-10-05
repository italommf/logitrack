// Funções para exibir valores no padrão brasileiro.
// As datas chegam do backend como texto ("2024-05-01T08:00:00" ou "2024-05-01")
// e são formatadas como texto, sem converter fuso horário.

export function dataHora(texto) {
  if (!texto) return '—'
  const [data, hora] = texto.split('T')
  return `${data.split('-').reverse().join('/')} ${hora.slice(0, 5)}`
}

export function data(texto) {
  if (!texto) return '—'
  return texto.split('-').reverse().join('/')
}

export function km(valor) {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + ' km'
}

export function dinheiro(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const NOMES_STATUS = { PENDENTE: 'Pendente', EM_REALIZACAO: 'Em realização', CONCLUIDA: 'Concluída' }

export function status(valor) {
  return NOMES_STATUS[valor] || valor
}
