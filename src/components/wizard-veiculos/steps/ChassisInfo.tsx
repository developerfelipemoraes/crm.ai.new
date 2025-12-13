import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChassisInfo as ChassisInfoType, VehicleCategory, VehicleSubcategory } from '@/types/vehicle';
import { Info } from 'lucide-react';

interface ChassisInfoProps {
  data: ChassisInfoType;
  onChange: (data: ChassisInfoType) => void;
  category?: VehicleCategory;
  subcategory?: VehicleSubcategory;
  manufactureYear?: number;
  modelYear?: number;
}

export const ChassisInfo: React.FC<ChassisInfoProps> = ({
  data,
  onChange,
  category,
  subcategory
}) => {
  const handleChange = (field: keyof ChassisInfoType, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2">Informações do Chassi e Carroceria</h3>
        <p className="text-muted-foreground">
          Especifique os detalhes técnicos do chassi e carroceria
        </p>
      </div>

      {category && subcategory && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Categoria</Label>
                <p className="font-medium">{category.name}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Subcategoria</Label>
                <p className="font-medium">{subcategory.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chassi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chassisManufacturer">
                Fabricante do Chassi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="chassisManufacturer"
                value={data.chassisManufacturer || ''}
                onChange={(e) => handleChange('chassisManufacturer', e.target.value)}
                placeholder="Ex: Mercedes-Benz"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chassisModel">
                Modelo do Chassi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="chassisModel"
                value={data.chassisModel || ''}
                onChange={(e) => handleChange('chassisModel', e.target.value)}
                placeholder="Ex: OF-1721"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Carroceria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bodyworkManufacturer">
                Fabricante da Carroceria <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bodyworkManufacturer"
                value={data.bodyworkManufacturer || ''}
                onChange={(e) => handleChange('bodyworkManufacturer', e.target.value)}
                placeholder="Ex: Marcopolo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodyworkModel">
                Modelo da Carroceria <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bodyworkModel"
                value={data.bodyworkModel || ''}
                onChange={(e) => handleChange('bodyworkModel', e.target.value)}
                placeholder="Ex: Paradiso G7"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-5 w-5 text-yellow-600" />
            Informação Importante
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            As informações de chassi e carroceria são essenciais para a identificação correta do veículo
            e devem ser preenchidas de acordo com a documentação oficial.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
