/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/planner/form/PlannerForm.tsx

import React, { useState, useEffect, useRef } from 'react';
import type { PlannerDto, PlannerRequestDto } from '../../../types/planner';
import type { PlannerMode, PlannerTargetType } from '../../../types/enums';
import { PlannerModes, PlannerTargetTypes } from '../../../types/enums';
import Button from '../../common/Button';
import PlannerBasicFields from './PlannerBasicFields';
import GeneratorSearch from './GeneratorSearch';
import PlannerFuelSection from './PlannerFuelSection';
import '../../../styles/planner/PlannerForm.css';

export interface PlannerFormProps {
  initialPlan?: PlannerDto;
  onSave: (dto: PlannerRequestDto) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const PlannerForm: React.FC<PlannerFormProps> = ({
  initialPlan,
  onSave,
  onCancel,
  isSaving,
}) => {
  const [name, setName] = useState<string>(initialPlan?.name ?? '');
  const [mode, setMode] = useState<PlannerMode>(
    (initialPlan?.mode as PlannerMode) ?? 'FACTORY'
  );
  const [generator, setGenerator] = useState(initialPlan?.generator ?? null);
  const [targetType, setTargetType] = useState<PlannerTargetType>(
    (initialPlan?.targetType as PlannerTargetType) ?? PlannerTargetTypes[0]
  );
  const [amount, setAmount] = useState<number | undefined>(
    initialPlan?.targetAmount
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const resetForm = () => {
    setName('');
    setMode('FACTORY');
    setGenerator(null);
    setTargetType(PlannerTargetTypes[0]);
    setAmount(undefined);
    setErrorMsg(null);
    setShowErrors(false);
  };

  useEffect(() => {
    setName(initialPlan?.name ?? '');
    setMode((initialPlan?.mode as PlannerMode) ?? 'FACTORY');
    setGenerator(initialPlan?.generator ?? null);
    setTargetType(
      (initialPlan?.targetType as PlannerTargetType) ?? PlannerTargetTypes[0]
    );
    setAmount(initialPlan?.targetAmount);
    setErrorMsg(null);
    setShowErrors(false);
  }, [initialPlan]);

  const validate = (): boolean => {
    if (!name.trim()) {
      setErrorMsg('Name is required.');
      return false;
    }
    if (mode === 'FUEL') {
      if (!generator) {
        setErrorMsg('Generator selection is required.');
        return false;
      }
      if (amount == null || amount <= 0) {
        setErrorMsg('Amount must be greater than zero.');
        return false;
      }
    }
    setErrorMsg(null);
    return true;
  };

  const handleSave = async () => {
    setShowErrors(true);
    if (!validate()) {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const dto: PlannerRequestDto = {
      id: initialPlan?.id,
      name,
      mode,
      generator: generator!,
      targetType,
      targetAmount: amount!,
    };

    try {
      await onSave(dto);
      resetForm();
    } catch (err: any) {
      const backendMsg = err.response?.data?.message;
      setErrorMsg(backendMsg ?? err.message ?? 'Save failed.');
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <div className="planner-form" ref={formRef}>
      {errorMsg && (
        <div className="planner-form__error-summary">{errorMsg}</div>
      )}

      <PlannerBasicFields
        name={name}
        mode={mode}
        modes={PlannerModes}
        onNameChange={(v) => {
          setName(v);
          setShowErrors(false);
        }}
        onModeChange={(v) => {
          setMode(v);
          setShowErrors(false);
        }}
        error={showErrors && !name.trim() ? 'Name is required.' : undefined}
      />

      {mode === 'FUEL' && (
        <>
          <GeneratorSearch
            selected={generator}
            onSelect={(gen) => {
              setGenerator(gen);
              setShowErrors(false);
            }}
            error={
              showErrors && !generator ? 'Generator is required.' : undefined
            }
          />

          <PlannerFuelSection
            targetType={targetType}
            amount={amount}
            onTargetTypeChange={setTargetType}
            onAmountChange={(value) => {
              setAmount(value);
              setShowErrors(false);
            }}
            error={
              showErrors && (amount == null || amount <= 0)
                ? 'Amount must be greater than zero.'
                : undefined
            }
          />
        </>
      )}

      <div className="planner-form__actions">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default PlannerForm;
