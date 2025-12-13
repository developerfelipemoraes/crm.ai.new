import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { ProductIdentification as ProductIdentificationType } from '@/types/vehicle';

interface ProductIdentificationProps {
  data: ProductIdentificationType;
  onChange: (data: ProductIdentificationType) => void;
}

export const ProductIdentification: React.FC<ProductIdentificationProps> = ({
  data,
  onChange
}) => {
  const handleChange = (field: keyof ProductIdentificationType, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const charCount = data.productTitle?.length || 0;
  const maxChars = 60;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Identificação do Produto</h3>
        <p className="text-muted-foreground">
          Defina um título claro e objetivo para o veículo
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="productTitle">
          Título do Produto <span className="text-red-500">*</span>
        </Label>
        <Input
          id="productTitle"
          value={data.productTitle || ''}
          onChange={(e) => handleChange('productTitle', e.target.value)}
          placeholder="Ex: Ônibus Rodoviário Mercedes-Benz OF-1721 Paradiso G7 2020"
          maxLength={maxChars}
        />
        <p className="text-sm text-muted-foreground">
          {charCount}/{maxChars} caracteres
        </p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Dicas para um bom título
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Inclua marca, modelo e ano</p>
          <p>• Mencione características importantes</p>
          <p>• Use palavras-chave que facilitem a busca</p>
          <p>• Seja claro e objetivo</p>
        </CardContent>
      </Card>

      {data.productTitle && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pré-visualização</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{data.productTitle}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
