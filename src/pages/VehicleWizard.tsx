import React, { useState } from 'react';
import { WizardLayout } from '../components/wizard-veiculos/WizardLayout';
import { VehicleTypeSelection } from '../components/wizard-veiculos/steps/VehicleTypeSelection';
import { CategorySelection } from '../components/wizard-veiculos/steps/CategorySelection';
import { SubcategorySelection } from '../components/wizard-veiculos/steps/SubcategorySelection';
import { ProductIdentification } from '../components/wizard-veiculos/steps/ProductIdentification';
import { ProductDescription } from '../components/wizard-veiculos/steps/ProductDescription';
import { VehicleData } from '../components/wizard-veiculos/steps/VehicleData';
import { ChassisInfo } from '../components/wizard-veiculos/steps/ChassisInfo';
import { SecondaryInfo } from '../components/wizard-veiculos/steps/SecondaryInfo';
import { SeatConfiguration } from '../components/wizard-veiculos/steps/SeatConfiguration';
import { VehicleOptionals } from '../components/wizard-veiculos/steps/VehicleOptionals';
import { LocationInfo } from '../components/wizard-veiculos/steps/LocationInfo';
import { Vehicle } from '../types/vehicle';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const VehicleWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicleData, setVehicleData] = useState<Partial<Vehicle>>({});

  const totalSteps = 11;

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

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!vehicleData.vehicleType;
      case 2:
        return !!vehicleData.category;
      case 3:
        return !!vehicleData.subcategory || (vehicleData.category?.subcategories?.length === 0);
      case 4:
        return !!(vehicleData.productTitle && vehicleData.productTitle.trim().length > 0);
      case 5:
        return !!(vehicleData.description && vehicleData.description.trim().length > 0);
      case 6:
        return !!(
          vehicleData.manufactureYear &&
          vehicleData.modelYear &&
          vehicleData.salePrice &&
          vehicleData.mileage !== undefined &&
          vehicleData.availableQuantity
        );
      case 7:
        return !!(
          vehicleData.chassisManufacturer &&
          vehicleData.chassisModel &&
          vehicleData.bodyworkManufacturer &&
          vehicleData.bodyworkModel
        );
      case 8:
        return !!(vehicleData.condition && vehicleData.fuelType);
      case 9:
        return true;
      case 10:
        return true;
      case 11:
        return !!(vehicleData.address && vehicleData.cep && vehicleData.city && vehicleData.state);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFinish = () => {
    toast.success('Veículo cadastrado com sucesso!');
    console.log('Vehicle data:', vehicleData);
    navigate('/vehicles');
  };

  const handleSaveDraft = () => {
    toast.info('Rascunho salvo!');
    console.log('Draft saved:', vehicleData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <VehicleTypeSelection
            selectedType={vehicleData.vehicleType}
            onTypeSelect={(type) => setVehicleData({ ...vehicleData, vehicleType: type, category: undefined, subcategory: undefined })}
          />
        );
      case 2:
        return (
          <CategorySelection
            vehicleType={vehicleData.vehicleType}
            selectedCategory={vehicleData.category}
            onCategorySelect={(category) => setVehicleData({ ...vehicleData, category, subcategory: undefined })}
          />
        );
      case 3:
        return (
          <SubcategorySelection
            category={vehicleData.category}
            selectedSubcategory={vehicleData.subcategory}
            onSubcategorySelect={(subcategory) => setVehicleData({ ...vehicleData, subcategory })}
          />
        );
      case 4:
        return (
          <ProductIdentification
            data={{ productTitle: vehicleData.productTitle }}
            onChange={(data) => setVehicleData({ ...vehicleData, ...data })}
          />
        );
      case 5:
        return (
          <ProductDescription
            description={vehicleData.description || ''}
            onChange={(description) => setVehicleData({ ...vehicleData, description })}
            vehicleData={vehicleData}
          />
        );
      case 6:
        return (
          <VehicleData
            data={{
              manufactureYear: vehicleData.manufactureYear,
              modelYear: vehicleData.modelYear,
              salePrice: vehicleData.salePrice,
              costPrice: vehicleData.costPrice,
              mileage: vehicleData.mileage,
              licensePlate: vehicleData.licensePlate,
              renavam: vehicleData.renavam,
              chassisNumber: vehicleData.chassisNumber,
              busPrefix: vehicleData.busPrefix,
              availableQuantity: vehicleData.availableQuantity,
              internalNotes: vehicleData.internalNotes
            }}
            onChange={(data) => setVehicleData({ ...vehicleData, ...data })}
            showBusPrefix={vehicleData.vehicleType?.id === 'onibus'}
          />
        );
      case 7:
        return (
          <ChassisInfo
            data={{
              chassisManufacturer: vehicleData.chassisManufacturer,
              chassisModel: vehicleData.chassisModel,
              bodyworkManufacturer: vehicleData.bodyworkManufacturer,
              bodyworkModel: vehicleData.bodyworkModel
            }}
            onChange={(data) => setVehicleData({ ...vehicleData, ...data })}
            category={vehicleData.category}
            subcategory={vehicleData.subcategory}
            manufactureYear={vehicleData.manufactureYear}
            modelYear={vehicleData.modelYear}
          />
        );
      case 8:
        return (
          <SecondaryInfo
            data={{
              passengerCapacity: vehicleData.passengerCapacity,
              condition: vehicleData.condition,
              fuelType: vehicleData.fuelType,
              steeringType: vehicleData.steeringType,
              singleOwner: vehicleData.singleOwner,
              description: vehicleData.description
            }}
            onChange={(data) => setVehicleData({ ...vehicleData, ...data })}
          />
        );
      case 9:
        return (
          <SeatConfiguration
            data={{
              conventional: vehicleData.conventional,
              executive: vehicleData.executive,
              semiSleeper: vehicleData.semiSleeper,
              sleeper: vehicleData.sleeper,
              sleeperBed: vehicleData.sleeperBed,
              fixed: vehicleData.fixed,
              totalCapacity: vehicleData.totalCapacity,
              compositionText: vehicleData.compositionText,
              compositionDetails: vehicleData.compositionDetails
            }}
            onChange={(data) => setVehicleData({ ...vehicleData, ...data })}
            vehicleType={vehicleData.vehicleType}
          />
        );
      case 10:
        return (
          <VehicleOptionals
            data={{
              airConditioning: vehicleData.airConditioning,
              legSupport: vehicleData.legSupport,
              curtain: vehicleData.curtain,
              usb: vehicleData.usb,
              soundSystem: vehicleData.soundSystem,
              monitor: vehicleData.monitor,
              wifi: vehicleData.wifi,
              packageHolder: vehicleData.packageHolder,
              bathroom: vehicleData.bathroom,
              cabin: vehicleData.cabin,
              coffeeMaker: vehicleData.coffeeMaker,
              accessibility: vehicleData.accessibility,
              factoryRetarder: vehicleData.factoryRetarder,
              optionalRetarder: vehicleData.optionalRetarder,
              glasType: vehicleData.glasType
            }}
            onChange={(data) => setVehicleData({ ...vehicleData, ...data })}
          />
        );
      case 11:
        return (
          <LocationInfo
            data={{
              address: vehicleData.address,
              neighborhood: vehicleData.neighborhood,
              cep: vehicleData.cep,
              city: vehicleData.city,
              state: vehicleData.state,
              latitude: vehicleData.latitude,
              longitude: vehicleData.longitude
            }}
            onChange={(data) => setVehicleData({ ...vehicleData, ...data })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      stepTitles={stepTitles}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
    >
      {renderStep()}
    </WizardLayout>
  );
};
