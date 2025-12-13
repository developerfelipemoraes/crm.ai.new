import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vehicle } from '@/types/vehicle';
import { Sparkles } from 'lucide-react';

interface ProductDescriptionProps {
  description: string;
  onChange: (description: string) => void;
  vehicleData?: Partial<Vehicle>;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  onChange,
  vehicleData
}) => {
  const generateDescription = () => {
    const parts: string[] = [];

    if (vehicleData?.category) {
      parts.push(`${vehicleData.category.name}`);
    }

    if (vehicleData?.chassisManufacturer && vehicleData?.chassisModel) {
      parts.push(`equipado com chassi ${vehicleData.chassisManufacturer} ${vehicleData.chassisModel}`);
    }

    if (vehicleData?.modelYear) {
      parts.push(`ano/modelo ${vehicleData.manufactureYear || vehicleData.modelYear}/${vehicleData.modelYear}`);
    }

    if (vehicleData?.condition) {
      const conditions = {
        new: 'novo',
        semiNew: 'seminovo',
        used: 'usado'
      };
      parts.push(`em estado ${conditions[vehicleData.condition]}`);
    }

    if (vehicleData?.mileage) {
      parts.push(`com ${vehicleData.mileage.toLocaleString('pt-BR')} km rodados`);
    }

    if (vehicleData?.fuelType) {
      parts.push(`motor ${vehicleData.fuelType}`);
    }

    if (vehicleData?.airConditioning) {
      parts.push('ar-condicionado');
    }

    if (vehicleData?.wifi) {
      parts.push('Wi-Fi');
    }

    const generated = parts.length > 0
      ? `${parts.join(', ')}.`
      : 'Descreva as características principais do veículo.';

    onChange(generated);
  };

  const charCount = description?.length || 0;
  const maxChars = 50000;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Descrição do Produto</h3>
        <p className="text-muted-foreground">
          Forneça uma descrição detalhada do veículo
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={generateDescription}
          variant="outline"
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Gerar Descrição Automática
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Descrição <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={description || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Descreva detalhadamente as características, condições e diferenciais do veículo..."
          rows={10}
          maxLength={maxChars}
        />
        <p className="text-sm text-muted-foreground">
          {charCount.toLocaleString('pt-BR')}/{maxChars.toLocaleString('pt-BR')} caracteres
        </p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">Dicas para uma boa descrição</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-green-700 mb-2">Faça:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use palavras-chave relevantes</li>
                <li>• Destaque diferenciais</li>
                <li>• Seja específico e detalhado</li>
                <li>• Mencione o estado de conservação</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-red-700 mb-2">Evite:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Informações falsas</li>
                <li>• Texto todo em maiúsculas</li>
                <li>• Excesso de emojis</li>
                <li>• Informações de contato</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pré-visualização</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap border-l-4 border-blue-500 pl-4">
              {description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
