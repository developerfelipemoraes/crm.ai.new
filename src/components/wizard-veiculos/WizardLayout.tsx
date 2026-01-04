import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface WizardLayoutProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  onSaveDraft?: () => void;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
}

const stepTitles = [
  'Seleção de Categoria',
  'Seleção de Tipo',
  'Seleção de Subcategoria',
  'Identificação do Produto',
  'Descrição do Produto',
  'Dados do Veículo',
  'Informações do Chassi',
  'Informações Secundárias',
  'Configuração de Poltronas',
  'Opcionais do Veículo',
  'Localização do Produto'
];

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  currentStep,
  totalSteps,
  children,
  onPrevious,
  onNext,
  onSaveDraft,
  isPreviousDisabled = false,
  isNextDisabled = false
}) => {
  const progress = (currentStep / totalSteps) * 100;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Cadastro de Veículo
              </h1>
              <p className="text-gray-600 mt-1">
                {stepTitles[currentStep - 1] || `Etapa ${currentStep}`}
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Etapa {currentStep} de {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-lg">
          <CardHeader className="border-b bg-white">
            <div
              className="flex items-center gap-2 overflow-x-auto pb-2"
              role="list"
              aria-label="Progresso do formulário"
            >
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div
                  key={step}
                  role="listitem"
                  className={`flex items-center ${step !== totalSteps ? 'flex-1' : ''}`}
                >
                  <div
                    title={stepTitles[step - 1] || `Etapa ${step}`}
                    aria-label={`Etapa ${step}: ${stepTitles[step - 1] || ''}`}
                    aria-current={step === currentStep ? 'step' : undefined}
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      step < currentStep
                        ? 'bg-green-500 text-white'
                        : step === currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step !== totalSteps && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-6">
          <Button
            onClick={onPrevious}
            disabled={isPreviousDisabled || currentStep === 1}
            variant="outline"
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex gap-3">
            {onSaveDraft && (
              <Button
                onClick={onSaveDraft}
                variant="outline"
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar Rascunho
              </Button>
            )}

            <Button
              onClick={onNext}
              disabled={isNextDisabled}
              className="gap-2"
            >
              {isLastStep ? 'Finalizar' : 'Próximo'}
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
