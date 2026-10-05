"""
Consultas SQL do dashboard.

O desafio exige que as 5 métricas sejam extraídas via SQL, então aqui usamos
SQL puro com connection.cursor(), como mostra a documentação do Django:
https://docs.djangoproject.com/en/5.2/topics/db/sql/#executing-custom-sql-directly

Os valores vindos do usuário são passados como parâmetro (%s), nunca colados
na string do SQL. Assim o próprio driver do banco trata o valor e evita SQL injection.
"""

from django.db import connection


def total_km(veiculo_id=None):
    """Soma da quilometragem de um veículo ou, se nenhum for informado, da frota toda."""
    with connection.cursor() as cursor:
        if veiculo_id:
            cursor.execute(
                'SELECT COALESCE(SUM(km_percorrida), 0) FROM viagens WHERE veiculo_id = %s',
                [veiculo_id],
            )
        else:
            cursor.execute('SELECT COALESCE(SUM(km_percorrida), 0) FROM viagens')
        return float(cursor.fetchone()[0])


def volume_por_categoria():
    """Quantidade de viagens por tipo de veículo (LEVE / PESADO)."""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT ve.tipo, COUNT(vi.id)
            FROM veiculos ve
            LEFT JOIN viagens vi ON vi.veiculo_id = ve.id
            GROUP BY ve.tipo
            ORDER BY ve.tipo
        """)
        return [{'tipo': tipo, 'quantidade': quantidade} for tipo, quantidade in cursor.fetchall()]


def proximas_manutencoes():
    """As próximas 5 manutenções agendadas (a partir de hoje e não concluídas), ordenadas por data."""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT m.id, ve.placa, ve.modelo, m.data_inicio, m.data_finalizacao,
                   m.tipo_servico, m.custo_estimado, m.status
            FROM manutencoes m
            JOIN veiculos ve ON ve.id = m.veiculo_id
            WHERE m.data_inicio >= CURRENT_DATE
              AND m.status <> 'CONCLUIDA'
            ORDER BY m.data_inicio
            LIMIT 5
        """)
        resultado = []
        for linha in cursor.fetchall():
            resultado.append({
                'id': linha[0],
                'placa': linha[1],
                'modelo': linha[2],
                'data_inicio': linha[3],
                'data_finalizacao': linha[4],
                'tipo_servico': linha[5],
                'custo_estimado': float(linha[6]),
                'status': linha[7],
            })
        return resultado


def ranking_utilizacao():
    """Veículos ordenados pela quilometragem acumulada. O primeiro é o mais utilizado."""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT ve.id, ve.placa, ve.modelo, SUM(vi.km_percorrida) AS total_km
            FROM viagens vi
            JOIN veiculos ve ON ve.id = vi.veiculo_id
            GROUP BY ve.id, ve.placa, ve.modelo
            ORDER BY total_km DESC
        """)
        resultado = []
        for linha in cursor.fetchall():
            resultado.append({
                'veiculo_id': linha[0],
                'placa': linha[1],
                'modelo': linha[2],
                'total_km': float(linha[3]),
            })
        return resultado


def projecao_financeira():
    """Soma do custo estimado das manutenções que começam no mês atual."""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT COALESCE(SUM(custo_estimado), 0)
            FROM manutencoes
            WHERE data_inicio >= DATE_TRUNC('month', CURRENT_DATE)
              AND data_inicio < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
        """)
        return float(cursor.fetchone()[0])
