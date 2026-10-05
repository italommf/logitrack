from django.db import models

# As tabelas são criadas pelo script SQL fornecido (database/01_carga_inicial.sql).
# Por isso, todos os models usam "managed = False": o Django lê e grava nessas
# tabelas, mas não cria, altera nem apaga a estrutura delas nas migrations.
# "db_table" informa o nome exato da tabela no banco.


class Veiculo(models.Model):
    TIPOS = [
        ('LEVE', 'Leve'),
        ('PESADO', 'Pesado'),
    ]

    placa = models.CharField(max_length=10, unique=True)
    modelo = models.CharField(max_length=50)
    tipo = models.CharField(max_length=20, choices=TIPOS)
    ano = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'veiculos'
        ordering = ['placa']

    def __str__(self):
        return f'{self.placa} - {self.modelo}'


class Viagem(models.Model):
    veiculo = models.ForeignKey(Veiculo, on_delete=models.CASCADE)
    data_saida = models.DateTimeField()
    data_chegada = models.DateTimeField(null=True, blank=True)
    origem = models.CharField(max_length=100)
    destino = models.CharField(max_length=100)
    km_percorrida = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'viagens'
        ordering = ['-data_saida']

    def __str__(self):
        return f'{self.origem} -> {self.destino}'


class Manutencao(models.Model):
    STATUS = [
        ('PENDENTE', 'Pendente'),
        ('EM_REALIZACAO', 'Em realização'),
        ('CONCLUIDA', 'Concluída'),
    ]

    veiculo = models.ForeignKey(Veiculo, on_delete=models.CASCADE)
    data_inicio = models.DateField()
    data_finalizacao = models.DateField(null=True, blank=True)
    tipo_servico = models.CharField(max_length=100)
    custo_estimado = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS, default='PENDENTE')

    class Meta:
        managed = False
        db_table = 'manutencoes'
        ordering = ['data_inicio']

    def __str__(self):
        return f'{self.tipo_servico} ({self.status})'
