from django import forms

from .models import Viagem


class ViagemForm(forms.ModelForm):
    """Valida os dados de uma viagem antes de salvar no banco."""

    class Meta:
        model = Viagem
        fields = ['veiculo', 'data_saida', 'data_chegada', 'origem', 'destino', 'km_percorrida']

    def clean_km_percorrida(self):
        km = self.cleaned_data['km_percorrida']
        if km < 0:
            raise forms.ValidationError('A quilometragem não pode ser negativa.')
        return km

    def clean(self):
        dados = super().clean()
        saida = dados.get('data_saida')
        chegada = dados.get('data_chegada')
        if saida and chegada and chegada < saida:
            self.add_error('data_chegada', 'A chegada não pode ser antes da saída.')
        return dados
