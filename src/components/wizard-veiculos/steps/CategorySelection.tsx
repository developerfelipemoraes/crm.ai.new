import React from 'react';
import { VehicleType, VehicleCategory } from '@/types/vehicle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface CategorySelectionProps {
  vehicleType?: VehicleType;
  selectedCategory?: VehicleCategory;
  onCategorySelect: (category: VehicleCategory) => void;
}

export const CategorySelection: React.FC<CategorySelectionProps> = ({
  vehicleType,
  selectedCategory,
  onCategorySelect
}) => {
  if (!vehicleType) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Por favor, selecione primeiro o tipo de veículo
        </p>
      </div>
    );
  }

  const categories = vehicleType.categories || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">
          Categoria de {vehicleType.name}
        </h3>
        <p className="text-muted-foreground">
          Selecione a categoria do veículo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className="w-full text-left"
            onClick={() => onCategorySelect(category)}
            aria-pressed={selectedCategory?.id === category.id}
          >
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCategory?.id === category.id
                  ? 'ring-2 ring-primary border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold leading-none tracking-tight text-lg">
                    {category.name}
                  </div>
                  {selectedCategory?.id === category.id && (
                    <Check className="h-6 w-6 text-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {category.subcategories?.length || 0} subcategorias disponíveis
                </CardDescription>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {selectedCategory && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">{selectedCategory.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Subcategorias disponíveis:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedCategory.subcategories?.map((sub) => (
                <div
                  key={sub.id}
                  className="px-3 py-1 bg-white rounded-full text-sm border"
                >
                  {sub.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
