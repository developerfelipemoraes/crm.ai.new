import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VehicleData as VehicleDataType } from '@/types/vehicle';

interface VehicleDataProps {
  data: VehicleDataType;
  onChange: (data: VehicleDataType) => void;
  showBusPrefix?: boolean;
}

export const VehicleData: React.FC<VehicleDataProps> = ({
  data,
  onChange,
  showBusPrefix = false
}) => {
  const handleChange = (field: keyof VehicleDataType, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2">Dados do Veículo</h3>
        <p className="text-muted-foreground">
          Preencha as informações técnicas e comerciais
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="manufactureYear">
            Ano de Fabricação <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.manufactureYear?.toString()}
            onValueChange={(value) => handleChange('manufactureYear', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="modelYear">
            Ano Modelo <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.modelYear?.toString()}
            onValueChange={(value) => handleChange('modelYear', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salePrice">
            Preço de Venda <span className="text-red-500">*</span>
          </Label>
          <Input
            id="salePrice"
            type="number"
            value={data.salePrice || ''}
            onChange={(e) => handleChange('salePrice', parseFloat(e.target.value))}
            placeholder="0,00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPrice">Preço de Custo</Label>
          <Input
            id="costPrice"
            type="number"
            value={data.costPrice || ''}
            onChange={(e) => handleChange('costPrice', parseFloat(e.target.value))}
            placeholder="0,00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">
            Quilometragem <span className="text-red-500">*</span>
          </Label>
          <Input
            id="mileage"
            type="number"
            value={data.mileage || ''}
            onChange={(e) => handleChange('mileage', parseInt(e.target.value))}
            placeholder="0"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="licensePlate">Placa</Label>
          <Input
            id="licensePlate"
            value={data.licensePlate || ''}
            onChange={(e) => handleChange('licensePlate', e.target.value.toUpperCase())}
            placeholder="ABC-1234"
            maxLength={8}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="renavam">RENAVAM</Label>
          <Input
            id="renavam"
            value={data.renavam || ''}
            onChange={(e) => handleChange('renavam', e.target.value)}
            placeholder="00000000000"
            maxLength={11}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chassisNumber">Número do Chassi</Label>
          <Input
            id="chassisNumber"
            value={data.chassisNumber || ''}
            onChange={(e) => handleChange('chassisNumber', e.target.value.toUpperCase())}
            placeholder="9BW..."
            maxLength={17}
          />
        </div>

        {showBusPrefix && (
          <div className="space-y-2">
            <Label htmlFor="busPrefix">Prefixo da Linha</Label>
            <Input
              id="busPrefix"
              value={data.busPrefix || ''}
              onChange={(e) => handleChange('busPrefix', e.target.value)}
              placeholder="Ex: 101"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="availableQuantity">
            Quantidade Disponível <span className="text-red-500">*</span>
          </Label>
          <Input
            id="availableQuantity"
            type="number"
            value={data.availableQuantity || ''}
            onChange={(e) => handleChange('availableQuantity', parseInt(e.target.value))}
            placeholder="1"
            min="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="internalNotes">Observações Internas</Label>
        <Textarea
          id="internalNotes"
          value={data.internalNotes || ''}
          onChange={(e) => handleChange('internalNotes', e.target.value)}
          placeholder="Notas e observações para uso interno..."
          rows={4}
          maxLength={1000}
        />
        <p className="text-sm text-muted-foreground">
          {(data.internalNotes?.length || 0)}/1000 caracteres
        </p>
      </div>
    </div>
  );
};
