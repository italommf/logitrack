from django.contrib import admin

from .models import Manutencao, Veiculo, Viagem

admin.site.register(Veiculo)
admin.site.register(Viagem)
admin.site.register(Manutencao)
