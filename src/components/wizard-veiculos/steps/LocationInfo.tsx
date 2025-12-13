import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationInfo as LocationInfoType } from '@/types/vehicle';
import { MapPin } from 'lucide-react';

interface LocationInfoProps {
  data: LocationInfoType;
  onChange: (data: LocationInfoType) => void;
}

const brazilianStates = [
  { uf: 'AC', name: 'Acre' },
  { uf: 'AL', name: 'Alagoas' },
  { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' },
  { uf: 'BA', name: 'Bahia' },
  { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' },
  { uf: 'ES', name: 'Espírito Santo' },
  { uf: 'GO', name: 'Goiás' },
  { uf: 'MA', name: 'Maranhão' },
  { uf: 'MT', name: 'Mato Grosso' },
  { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'MG', name: 'Minas Gerais' },
  { uf: 'PA', name: 'Pará' },
  { uf: 'PB', name: 'Paraíba' },
  { uf: 'PR', name: 'Paraná' },
  { uf: 'PE', name: 'Pernambuco' },
  { uf: 'PI', name: 'Piauí' },
  { uf: 'RJ', name: 'Rio de Janeiro' },
  { uf: 'RN', name: 'Rio Grande do Norte' },
  { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'RO', name: 'Rondônia' },
  { uf: 'RR', name: 'Roraima' },
  { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'SP', name: 'São Paulo' },
  { uf: 'SE', name: 'Sergipe' },
  { uf: 'TO', name: 'Tocantins' }
];

export const LocationInfo: React.FC<LocationInfoProps> = ({
  data,
  onChange
}) => {
  const handleChange = (field: keyof LocationInfoType, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleCEPChange = (value: string) => {
    const formatted = formatCEP(value);
    handleChange('cep', formatted);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2">
          <MapPin className="h-6 w-6" />
          Localização do Produto
        </h3>
        <p className="text-muted-foreground">
          Informe onde o veículo está localizado
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">
            Endereço <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            value={data.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Rua, Avenida, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            value={data.neighborhood || ''}
            onChange={(e) => handleChange('neighborhood', e.target.value)}
            placeholder="Nome do bairro"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cep">
            CEP <span className="text-red-500">*</span>
          </Label>
          <Input
            id="cep"
            value={data.cep || ''}
            onChange={(e) => handleCEPChange(e.target.value)}
            placeholder="00000-000"
            maxLength={9}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">
            Cidade <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            value={data.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="Nome da cidade"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="state">
            Estado <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.state}
            onValueChange={(value) => handleChange('state', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {brazilianStates.map((state) => (
                <SelectItem key={state.uf} value={state.uf}>
                  {state.name} ({state.uf})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800">
            <MapPin className="inline h-4 w-4 mr-1" />
            O endereço informado será usado para ajudar os compradores a localizarem o veículo
            no mapa.
          </p>
        </CardContent>
      </Card>

      {data.address && data.city && data.state && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Endereço Completo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              {data.address}
              {data.neighborhood && `, ${data.neighborhood}`}
              {data.cep && ` - CEP: ${data.cep}`}
              <br />
              {data.city} - {data.state}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
