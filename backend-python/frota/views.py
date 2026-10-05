import json

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from . import consultas
from .forms import ViagemForm
from .models import Veiculo, Viagem


def veiculo_para_dict(veiculo):
    return {
        'id': veiculo.id,
        'placa': veiculo.placa,
        'modelo': veiculo.modelo,
        'tipo': veiculo.tipo,
        'ano': veiculo.ano,
    }


def viagem_para_dict(viagem):
    return {
        'id': viagem.id,
        'veiculo_id': viagem.veiculo.id,
        'veiculo_placa': viagem.veiculo.placa,
        'veiculo_modelo': viagem.veiculo.modelo,
        'data_saida': viagem.data_saida,
        'data_chegada': viagem.data_chegada,
        'origem': viagem.origem,
        'destino': viagem.destino,
        'km_percorrida': float(viagem.km_percorrida),
    }


def dados_do_formulario(request):
    """Lê o JSON enviado pelo frontend e troca 'veiculo_id' por 'veiculo', o nome do campo no form."""
    dados = json.loads(request.body)
    dados['veiculo'] = dados.pop('veiculo_id', None)
    return dados


@ensure_csrf_cookie
@require_http_methods(['GET'])
def csrf(request):
    """Só garante que o navegador receba o cookie 'csrftoken'.
    O frontend envia esse valor no cabeçalho X-CSRFToken em POST, PUT e DELETE."""
    return JsonResponse({'ok': True})


@require_http_methods(['GET'])
def veiculos_lista(request):
    veiculos = Veiculo.objects.all()
    return JsonResponse([veiculo_para_dict(v) for v in veiculos], safe=False)


@require_http_methods(['GET', 'POST'])
def viagens_lista(request):
    if request.method == 'GET':
        # select_related busca o veículo no mesmo SELECT (com JOIN),
        # em vez de fazer uma consulta extra para cada viagem.
        viagens = Viagem.objects.select_related('veiculo').all()
        return JsonResponse([viagem_para_dict(v) for v in viagens], safe=False)

    form = ViagemForm(dados_do_formulario(request))
    if not form.is_valid():
        return JsonResponse({'erros': form.errors}, status=400)
    viagem = form.save()
    return JsonResponse(viagem_para_dict(viagem), status=201)


@require_http_methods(['GET', 'PUT', 'DELETE'])
def viagem_detalhe(request, viagem_id):
    try:
        viagem = Viagem.objects.select_related('veiculo').get(id=viagem_id)
    except Viagem.DoesNotExist:
        return JsonResponse({'erro': 'Viagem não encontrada.'}, status=404)

    if request.method == 'GET':
        return JsonResponse(viagem_para_dict(viagem))

    if request.method == 'PUT':
        form = ViagemForm(dados_do_formulario(request), instance=viagem)
        if not form.is_valid():
            return JsonResponse({'erros': form.errors}, status=400)
        viagem = form.save()
        return JsonResponse(viagem_para_dict(viagem))

    viagem.delete()
    return HttpResponse(status=204)


@require_http_methods(['GET'])
def dashboard(request):
    # Filtro opcional: /api/dashboard/?veiculo_id=1 calcula o KM só desse veículo.
    veiculo_id = request.GET.get('veiculo_id')
    return JsonResponse({
        'total_km': consultas.total_km(veiculo_id),
        'volume_por_categoria': consultas.volume_por_categoria(),
        'proximas_manutencoes': consultas.proximas_manutencoes(),
        'ranking_utilizacao': consultas.ranking_utilizacao(),
        'projecao_financeira': consultas.projecao_financeira(),
    })
