import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SeatComposition, VehicleType } from '@/types/vehicle';
import { Info } from 'lucide-react';

interface SeatConfigurationProps {
  data: SeatComposition;
  onChange: (data: SeatComposition) => void;
  vehicleType?: VehicleType;
}

const seatTypes = [
  { key: 'conventional', label: 'Convencional', icon: '💺' },
  { key: 'executive', label: 'Executivo', icon: '🪑' },
  { key: 'semiSleeper', label: 'Semi-leito', icon: '🛋️' },
  { key: 'sleeper', label: 'Leito', icon: '🛏️' },
  { key: 'sleeperBed', label: 'Leito-cama', icon: '🛌' },
  { key: 'fixed', label: 'Fixo', icon: '🪑' }
];

export const SeatConfiguration: React.FC<SeatConfigurationProps> = ({
  data,
  onChange,
  vehicleType
}) => {
  const [localData, setLocalData] = useState<SeatComposition>(data);

  useEffect(() => {
    const total = Object.keys(localData)
      .filter(key => ['conventional', 'executive', 'semiSleeper', 'sleeper', 'sleeperBed', 'fixed'].includes(key))
      .reduce((sum, key) => sum + (localData[key as keyof SeatComposition] as number || 0), 0);

    const composition = seatTypes
      .filter(st => (localData[st.key as keyof SeatComposition] as number || 0) > 0)
      .map(st => `${localData[st.key as keyof SeatComposition]} ${st.label.toLowerCase()}`)
      .join(' + ');

    const updated = {
      ...localData,
      totalCapacity: total,
      compositionText: composition || 'Sem configuração'
    };

    setLocalData(updated);
    onChange(updated);
  }, [
    localData.conventional,
    localData.executive,
    localData.semiSleeper,
    localData.sleeper,
    localData.sleeperBed,
    localData.fixed
  ]);

  const handleChange = (field: keyof SeatComposition, value: number) => {
    setLocalData({ ...localData, [field]: value });
  };

  const isBus = vehicleType?.id === 'onibus';

  if (!isBus) {
    return (
      <div className="text-center py-12 space-y-4">
        <Info className="h-12 w-12 mx-auto text-blue-500" />
        <h3 className="text-xl font-semibold">Esta etapa é específica para ônibus</h3>
        <p className="text-muted-foreground">
          Clique em "Próximo" para continuar com os opcionais do veículo
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2">Configuração de Poltronas</h3>
        <p className="text-muted-foreground">
          Defina a quantidade e tipo de assentos do ônibus
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seatTypes.map((seatType) => (
          <Card key={seatType.key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="text-2xl">{seatType.icon}</span>
                {seatType.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                value={localData[seatType.key as keyof SeatComposition] || ''}
                onChange={(e) =>
                  handleChange(seatType.key as keyof SeatComposition, parseInt(e.target.value) || 0)
                }
                placeholder="0"
                min="0"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {localData.totalCapacity! > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">
              Resumo da Configuração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {seatTypes.map((seatType) => {
                const count = localData[seatType.key as keyof SeatComposition] as number || 0;
                if (count > 0) {
                  return (
                    <div key={seatType.key} className="flex items-center gap-2">
                      <span className="text-2xl">{seatType.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{seatType.label}</p>
                        <p className="text-lg font-bold text-green-700">{count}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            <div className="pt-4 border-t border-green-300">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-green-800">
                  Capacidade Total:
                </span>
                <span className="text-2xl font-bold text-green-700">
                  {localData.totalCapacity} lugares
                </span>
              </div>
              {localData.compositionText && (
                <p className="text-sm text-green-700 mt-2">
                  {localData.compositionText}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
