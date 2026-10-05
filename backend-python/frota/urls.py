from django.urls import path

from . import views

urlpatterns = [
    path('csrf/', views.csrf),
    path('veiculos/', views.veiculos_lista),
    path('viagens/', views.viagens_lista),
    path('viagens/<int:viagem_id>/', views.viagem_detalhe),
    path('dashboard/', views.dashboard),
]
