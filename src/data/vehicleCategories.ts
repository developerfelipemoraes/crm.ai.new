import { VehicleType } from '../types/vehicle';

export const vehicleTypes: VehicleType[] = [
  {
    id: 'onibus',
    name: 'Ônibus',
    icon: '🚌',
    categories: [
      {
        id: 'urbano',
        name: 'Urbano',
        subcategories: [
          { id: 'padrao', name: 'Padrão', description: 'Ônibus urbano padrão' },
          { id: 'articulado', name: 'Articulado', description: 'Ônibus articulado para alto volume' },
          { id: 'biarticulado', name: 'Biarticulado', description: 'Ônibus biarticulado' },
          { id: 'brt', name: 'BRT', description: 'Bus Rapid Transit' }
        ]
      },
      {
        id: 'rodoviario',
        name: 'Rodoviário',
        subcategories: [
          { id: 'convencional', name: 'Convencional', description: 'Viagens curtas e médias' },
          { id: 'executivo', name: 'Executivo', description: 'Conforto para viagens longas' },
          { id: 'semi-leito', name: 'Semi-Leito', description: 'Poltronas reclináveis' },
          { id: 'leito', name: 'Leito', description: 'Máximo conforto' },
          { id: 'double-decker', name: 'Double Decker', description: 'Dois andares' }
        ]
      },
      {
        id: 'fretamento',
        name: 'Fretamento',
        subcategories: [
          { id: 'turismo', name: 'Turismo', description: 'Viagens turísticas' },
          { id: 'escolar', name: 'Escolar', description: 'Transporte escolar' },
          { id: 'empresarial', name: 'Empresarial', description: 'Transporte de funcionários' }
        ]
      },
      {
        id: 'especial',
        name: 'Especial',
        subcategories: [
          { id: 'acessivel', name: 'Acessível', description: 'Adaptado para PCD' },
          { id: 'hospitalar', name: 'Hospitalar', description: 'Transporte de pacientes' },
          { id: 'prisional', name: 'Prisional', description: 'Transporte de detentos' }
        ]
      }
    ]
  },
  {
    id: 'automoveis',
    name: 'Automóveis',
    icon: '🚗',
    categories: [
      {
        id: 'hatch',
        name: 'Hatch',
        subcategories: [
          { id: 'compacto', name: 'Compacto', description: 'Hatches pequenos' },
          { id: 'medio', name: 'Médio', description: 'Hatches médios' },
          { id: 'premium', name: 'Premium', description: 'Hatches de luxo' }
        ]
      },
      {
        id: 'sedan',
        name: 'Sedan',
        subcategories: [
          { id: 'compacto', name: 'Compacto', description: 'Sedans compactos' },
          { id: 'medio', name: 'Médio', description: 'Sedans médios' },
          { id: 'grande', name: 'Grande', description: 'Sedans grandes' },
          { id: 'luxo', name: 'Luxo', description: 'Sedans de luxo' }
        ]
      },
      {
        id: 'suv',
        name: 'SUV',
        subcategories: [
          { id: 'compacto', name: 'Compacto', description: 'SUVs compactos' },
          { id: 'medio', name: 'Médio', description: 'SUVs médios' },
          { id: 'grande', name: 'Grande', description: 'SUVs grandes' },
          { id: 'luxo', name: 'Luxo', description: 'SUVs de luxo' }
        ]
      },
      {
        id: 'pickup',
        name: 'Picape',
        subcategories: [
          { id: 'compacta', name: 'Compacta', description: 'Picapes compactas' },
          { id: 'media', name: 'Média', description: 'Picapes médias' },
          { id: 'grande', name: 'Grande', description: 'Picapes grandes' }
        ]
      },
      {
        id: 'esportivo',
        name: 'Esportivo',
        subcategories: [
          { id: 'coupe', name: 'Cupê', description: 'Carros cupê' },
          { id: 'conversivel', name: 'Conversível', description: 'Carros conversíveis' },
          { id: 'super-esportivo', name: 'Super Esportivo', description: 'Super carros' }
        ]
      },
      {
        id: 'minivan',
        name: 'Minivan',
        subcategories: [
          { id: 'compacta', name: 'Compacta', description: 'Minivans compactas' },
          { id: 'familiar', name: 'Familiar', description: 'Minivans familiares' }
        ]
      },
      {
        id: 'utilitario',
        name: 'Utilitário',
        subcategories: [
          { id: 'furgao', name: 'Furgão', description: 'Furgões pequenos' },
          { id: 'van', name: 'Van', description: 'Vans de carga' }
        ]
      }
    ]
  },
  {
    id: 'caminhoes',
    name: 'Caminhões',
    icon: '🚚',
    categories: [
      {
        id: 'leve',
        name: 'Leve',
        subcategories: [
          { id: '3-4-ton', name: '3/4', description: 'Até 3,5 toneladas' },
          { id: 'toco', name: 'Toco', description: 'Dois eixos simples' }
        ]
      },
      {
        id: 'medio',
        name: 'Médio',
        subcategories: [
          { id: 'truck', name: 'Truck', description: 'Três eixos' },
          { id: 'bitruck', name: 'Bitruck', description: 'Quatro eixos' }
        ]
      },
      {
        id: 'pesado',
        name: 'Pesado',
        subcategories: [
          { id: 'cavalo-mecanico', name: 'Cavalo Mecânico', description: 'Para semi-reboques' },
          { id: 'carreta', name: 'Carreta', description: 'Conjunto completo' },
          { id: 'bitrem', name: 'Bitrem', description: 'Dois semi-reboques' },
          { id: 'rodotrem', name: 'Rodotrem', description: 'Reboque + semi-reboque' }
        ]
      },
      {
        id: 'especial',
        name: 'Especial',
        subcategories: [
          { id: 'betoneira', name: 'Betoneira', description: 'Transporte de concreto' },
          { id: 'tanque', name: 'Tanque', description: 'Transporte de líquidos' },
          { id: 'frigorífico', name: 'Frigorífico', description: 'Refrigerado' },
          { id: 'cegonha', name: 'Cegonha', description: 'Transporte de veículos' },
          { id: 'guindaste', name: 'Guindaste', description: 'Içamento de cargas' },
          { id: 'munck', name: 'Munck', description: 'Guindaste hidráulico' }
        ]
      }
    ]
  },
  {
    id: 'vans',
    name: 'Vans',
    icon: '🚐',
    categories: [
      {
        id: 'passageiros',
        name: 'Passageiros',
        subcategories: [
          { id: 'standard', name: 'Standard', description: 'Vans padrão' },
          { id: 'executiva', name: 'Executiva', description: 'Vans de luxo' },
          { id: 'escolar', name: 'Escolar', description: 'Transporte escolar' },
          { id: 'acessivel', name: 'Acessível', description: 'Adaptada para PCD' }
        ]
      },
      {
        id: 'carga',
        name: 'Carga',
        subcategories: [
          { id: 'furgao', name: 'Furgão', description: 'Van de carga' },
          { id: 'bau', name: 'Baú', description: 'Com baú' },
          { id: 'refrigerada', name: 'Refrigerada', description: 'Com refrigeração' },
          { id: 'adaptada', name: 'Adaptada', description: 'Uso específico' }
        ]
      }
    ]
  },
  {
    id: 'motocicletas',
    name: 'Motocicletas',
    icon: '🏍️',
    categories: [
      {
        id: 'street',
        name: 'Street',
        subcategories: [
          { id: 'naked', name: 'Naked', description: 'Sem carenagem' },
          { id: 'sport', name: 'Sport', description: 'Esportivas' },
          { id: 'custom', name: 'Custom', description: 'Customizadas' }
        ]
      },
      {
        id: 'trail',
        name: 'Trail',
        subcategories: [
          { id: 'on-off', name: 'On/Off', description: 'Misto' },
          { id: 'enduro', name: 'Enduro', description: 'Off-road' },
          { id: 'adventure', name: 'Adventure', description: 'Grandes viagens' }
        ]
      },
      {
        id: 'scooter',
        name: 'Scooter',
        subcategories: [
          { id: 'standard', name: 'Standard', description: 'Scooter padrão' },
          { id: 'maxiscooter', name: 'Maxiscooter', description: 'Scooter grande' }
        ]
      },
      {
        id: 'touring',
        name: 'Touring',
        subcategories: [
          { id: 'sport-touring', name: 'Sport Touring', description: 'Esportiva de viagem' },
          { id: 'cruiser', name: 'Cruiser', description: 'Tipo Harley' }
        ]
      },
      {
        id: 'supersport',
        name: 'Supersport',
        subcategories: [
          { id: '600cc', name: '600cc', description: 'Até 600cc' },
          { id: '1000cc', name: '1000cc', description: 'Acima de 600cc' }
        ]
      },
      {
        id: 'utilitaria',
        name: 'Utilitária',
        subcategories: [
          { id: 'standard', name: 'Standard', description: 'Uso geral' },
          { id: 'carga', name: 'Carga', description: 'Para entregas' },
          { id: 'triciclo', name: 'Triciclo', description: 'Três rodas' }
        ]
      }
    ]
  },
  {
    id: 'motorhome',
    name: 'Motorhome',
    icon: '🚙',
    categories: [
      {
        id: 'classe',
        name: 'Classe',
        subcategories: [
          { id: 'classe-a', name: 'Classe A', description: 'Grande porte' },
          { id: 'classe-b', name: 'Classe B', description: 'Médio porte' },
          { id: 'classe-c', name: 'Classe C', description: 'Compacto' }
        ]
      }
    ]
  },
  {
    id: 'reboques',
    name: 'Reboques e Semi-reboques',
    icon: '🚛',
    categories: [
      {
        id: 'reboque',
        name: 'Reboque',
        subcategories: [
          { id: 'carga-seca', name: 'Carga Seca', description: 'Reboque para carga seca' },
          { id: 'tanque', name: 'Tanque', description: 'Reboque tanque' },
          { id: 'refrigerado', name: 'Refrigerado', description: 'Reboque refrigerado' },
          { id: 'especial', name: 'Especial', description: 'Uso especial' }
        ]
      },
      {
        id: 'semi-reboque',
        name: 'Semi-reboque',
        subcategories: [
          { id: 'bau', name: 'Baú', description: 'Semi-reboque baú' },
          { id: 'sider', name: 'Sider', description: 'Com cortinas' },
          { id: 'graneleiro', name: 'Graneleiro', description: 'Para grãos' },
          { id: 'prancha', name: 'Prancha', description: 'Plataforma' }
        ]
      }
    ]
  },
  {
    id: 'agricola',
    name: 'Agrícola',
    icon: '🚜',
    categories: [
      {
        id: 'trator',
        name: 'Trator',
        subcategories: [
          { id: 'compacto', name: 'Compacto', description: 'Pequeno porte' },
          { id: 'medio', name: 'Médio', description: 'Médio porte' },
          { id: 'grande', name: 'Grande', description: 'Grande porte' }
        ]
      },
      {
        id: 'colheitadeira',
        name: 'Colheitadeira',
        subcategories: [
          { id: 'graos', name: 'Grãos', description: 'Para colheita de grãos' },
          { id: 'cana', name: 'Cana', description: 'Para cana-de-açúcar' },
          { id: 'cafe', name: 'Café', description: 'Para café' }
        ]
      },
      {
        id: 'implemento',
        name: 'Implemento',
        subcategories: [
          { id: 'arado', name: 'Arado', description: 'Para arar a terra' },
          { id: 'grade', name: 'Grade', description: 'Para gradear' },
          { id: 'plantadeira', name: 'Plantadeira', description: 'Para plantar' },
          { id: 'pulverizador', name: 'Pulverizador', description: 'Para pulverizar' }
        ]
      }
    ]
  },
  {
    id: 'construcao',
    name: 'Construção',
    icon: '🏗️',
    categories: [
      {
        id: 'escavadeira',
        name: 'Escavadeira',
        subcategories: [
          { id: 'hidraulica', name: 'Hidráulica', description: 'Escavadeira hidráulica' },
          { id: 'mini', name: 'Mini', description: 'Mini escavadeira' }
        ]
      },
      {
        id: 'retro',
        name: 'Retroescavadeira',
        subcategories: [
          { id: 'standard', name: 'Standard', description: 'Retroescavadeira padrão' },
          { id: 'mini', name: 'Mini', description: 'Mini retroescavadeira' }
        ]
      },
      {
        id: 'pá-carregadeira',
        name: 'Pá Carregadeira',
        subcategories: [
          { id: 'pequena', name: 'Pequena', description: 'Pequeno porte' },
          { id: 'media', name: 'Média', description: 'Médio porte' },
          { id: 'grande', name: 'Grande', description: 'Grande porte' }
        ]
      },
      {
        id: 'motoniveladora',
        name: 'Motoniveladora',
        subcategories: [
          { id: 'standard', name: 'Standard', description: 'Motoniveladora padrão' },
          { id: 'especial', name: 'Especial', description: 'Uso especial' }
        ]
      },
      {
        id: 'rolo',
        name: 'Rolo Compactador',
        subcategories: [
          { id: 'liso', name: 'Liso', description: 'Rolo liso' },
          { id: 'pe-carneiro', name: 'Pé de Carneiro', description: 'Com saliências' }
        ]
      }
    ]
  }
];

export const comfortCategories = [
  { id: 'convencional', name: 'Convencional' },
  { id: 'executivo', name: 'Executivo' },
  { id: 'semi-leito', name: 'Semi-leito' },
  { id: 'leito', name: 'Leito' },
  { id: 'leito-cama', name: 'Leito-cama' }
];

export const fuelTypes = [
  { id: 'diesel', name: 'Diesel' },
  { id: 'gasolina', name: 'Gasolina' },
  { id: 'etanol', name: 'Etanol' },
  { id: 'flex', name: 'Flex' },
  { id: 'gnv', name: 'GNV' },
  { id: 'eletrico', name: 'Elétrico' },
  { id: 'hibrido', name: 'Híbrido' },
  { id: 'hibrido-plugin', name: 'Híbrido Plug-in' },
  { id: 'hidrogênio', name: 'Hidrogênio' },
  { id: 'biodiesel', name: 'Biodiesel' },
  { id: 'outros', name: 'Outros' }
];

export const getAllCategories = (): VehicleType[] => {
  return vehicleTypes;
};
