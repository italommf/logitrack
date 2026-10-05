// Todas as chamadas ao backend ficam neste arquivo.

// Lê um cookie pelo nome. Usado para pegar o token CSRF que o Django envia.
function lerCookie(nome) {
  const cookie = document.cookie.split('; ').find((c) => c.startsWith(nome + '='))
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : ''
}

async function requisicao(metodo, caminho, corpo) {
  const resposta = await fetch('/api' + caminho, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': lerCookie('csrftoken'),
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  })

  // 204 = sucesso sem conteúdo (resposta do DELETE)
  const dados = resposta.status === 204 ? null : await resposta.json()

  if (!resposta.ok) {
    // Lança o próprio JSON de erro, para a tela mostrar as mensagens de cada campo.
    throw dados
  }
  return dados
}

export const api = {
  iniciar: () => requisicao('GET', '/csrf/'),
  listarVeiculos: () => requisicao('GET', '/veiculos/'),
  listarViagens: () => requisicao('GET', '/viagens/'),
  criarViagem: (viagem) => requisicao('POST', '/viagens/', viagem),
  atualizarViagem: (id, viagem) => requisicao('PUT', `/viagens/${id}/`, viagem),
  excluirViagem: (id) => requisicao('DELETE', `/viagens/${id}/`),
  dashboard: (veiculoId) => requisicao('GET', '/dashboard/' + (veiculoId ? `?veiculo_id=${veiculoId}` : '')),
}
