import React from 'react';
import { VehicleCategory, VehicleSubcategory } from '@/types/vehicle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface SubcategorySelectionProps {
  category?: VehicleCategory;
  selectedSubcategory?: VehicleSubcategory;
  onSubcategorySelect: (subcategory: VehicleSubcategory) => void;
}

export const SubcategorySelection: React.FC<SubcategorySelectionProps> = ({
  category,
  selectedSubcategory,
  onSubcategorySelect
}) => {
  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Por favor, selecione primeiro a categoria do veículo
        </p>
      </div>
    );
  }

  const subcategories = category.subcategories || [];

  if (subcategories.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-lg font-medium">
          A categoria {category.name} não possui subcategorias específicas
        </p>
        <p className="text-muted-foreground">
          Clique em "Próximo" para continuar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">
          Subcategoria de {category.name}
        </h3>
        <p className="text-muted-foreground">
          Selecione a subcategoria específica do veículo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subcategories.map((subcategory) => (
          <Card
            key={subcategory.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedSubcategory?.id === subcategory.id
                ? 'ring-2 ring-primary border-primary bg-primary/5'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onSubcategorySelect(subcategory)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                {selectedSubcategory?.id === subcategory.id && (
                  <Check className="h-6 w-6 text-primary" />
                )}
              </div>
            </CardHeader>
            {subcategory.description && (
              <CardContent>
                <CardDescription>{subcategory.description}</CardDescription>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {selectedSubcategory && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">{selectedSubcategory.name}</CardTitle>
          </CardHeader>
          {selectedSubcategory.description && (
            <CardContent>
              <p className="text-sm">{selectedSubcategory.description}</p>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};
