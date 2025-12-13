import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { SecondaryInfo as SecondaryInfoType } from '@/types/vehicle';
import { fuelTypes } from '@/data/vehicleCategories';

interface SecondaryInfoProps {
  data: SecondaryInfoType;
  onChange: (data: SecondaryInfoType) => void;
}

export const SecondaryInfo: React.FC<SecondaryInfoProps> = ({
  data,
  onChange
}) => {
  const handleChange = (field: keyof SecondaryInfoType, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2">Informações Secundárias</h3>
        <p className="text-muted-foreground">
          Complete os dados complementares do veículo
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="passengerCapacity">Quantidade de Pessoas</Label>
          <Input
            id="passengerCapacity"
            type="number"
            value={data.passengerCapacity || ''}
            onChange={(e) => handleChange('passengerCapacity', parseInt(e.target.value))}
            placeholder="0"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">
            Condição do Veículo <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.condition}
            onValueChange={(value: 'new' | 'semiNew' | 'used') => handleChange('condition', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a condição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Novo</SelectItem>
              <SelectItem value="semiNew">Seminovo</SelectItem>
              <SelectItem value="used">Usado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuelType">
            Tipo de Combustível <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.fuelType}
            onValueChange={(value) => handleChange('fuelType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o combustível" />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes.map((fuel) => (
                <SelectItem key={fuel.id} value={fuel.id}>
                  {fuel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="steeringType">Direção</Label>
          <Select
            value={data.steeringType}
            onValueChange={(value: 'assisted' | 'hydraulic' | 'mechanical') =>
              handleChange('steeringType', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de direção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="assisted">Assistida</SelectItem>
              <SelectItem value="hydraulic">Hidráulica</SelectItem>
              <SelectItem value="mechanical">Mecânica</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-0.5">
          <Label htmlFor="singleOwner">Único Dono</Label>
          <p className="text-sm text-muted-foreground">
            O veículo teve apenas um proprietário?
          </p>
        </div>
        <Switch
          id="singleOwner"
          checked={data.singleOwner || false}
          onCheckedChange={(checked) => handleChange('singleOwner', checked)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição Adicional</Label>
        <Textarea
          id="description"
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Informações adicionais sobre o veículo..."
          rows={4}
          maxLength={500}
        />
        <p className="text-sm text-muted-foreground">
          {(data.description?.length || 0)}/500 caracteres
        </p>
      </div>
    </div>
  );
};
