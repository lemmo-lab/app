'use client';

import React, { useMemo } from 'react';
import {
  AiCpu,
  Check01,
  Refresh01,
} from 'synthline/react';
import type { ToolManifest, ToolField } from '@/sdk/types';
import { resolveFormState } from '../utils/formState';

interface DynamicToolFormProps {
  tool: ToolManifest;
  values: Record<string, unknown>;
  onChange: (newValues: Record<string, unknown>) => void;
  locale?: string;
  isRtl?: boolean;
}

const DEFAULT_ASPECT_OPTIONS = [
  { label: '1:1', value: '1:1' },
  { label: '16:9', value: '16:9' },
  { label: '9:16', value: '9:16' },
  { label: '4:3', value: '4:3' },
  { label: '3:4', value: '3:4' },
];

export function DynamicToolForm({
  tool,
  values,
  onChange,
  locale = 'fa',
  isRtl = true,
}: DynamicToolFormProps) {
  const currentModelRef = useMemo(() => {
    return (
      (values.model as string) ||
      (values.model_ref as string) ||
      tool.models?.find((m) => m.default)?.model_ref ||
      tool.models?.[0]?.model_ref ||
      'gpt-image-2'
    );
  }, [values, tool]);

  const activeModelOption = useMemo(() => {
    return tool.models?.find((m) => m.model_ref === currentModelRef);
  }, [tool, currentModelRef]);

  const handleFieldChange = (fieldId: string, val: unknown) => {
    onChange({
      ...values,
      [fieldId]: val,
    });
  };

  const handleModelChange = (newModelRef: string) => {
    const reconciled = resolveFormState(tool, newModelRef, values);
    onChange(reconciled);
  };

  // Render individual field
  const renderField = (field: ToolField) => {
    const label = locale === 'fa' && field.labelFa ? field.labelFa : field.label;
    const placeholder =
      locale === 'fa' && field.placeholderFa ? field.placeholderFa : field.placeholder;
    const val = values[field.id];

    switch (field.type) {
      case 'textarea': {
        const textVal = typeof val === 'string' ? val : '';
        const isFarsiPrompt = /[\u0600-\u06FF]/.test(textVal);
        return (
          <div key={field.id} className="dynamic-form-field field-textarea">
            <label className="field-label" htmlFor={`field-${field.id}`}>
              {label}
            </label>
            <textarea
              id={`field-${field.id}`}
              className="field-textarea-input"
              rows={3}
              dir={isFarsiPrompt ? 'rtl' : 'ltr'}
              placeholder={placeholder || (locale === 'fa' ? 'متن خود را وارد کنید...' : 'Enter prompt...')}
              value={textVal}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            />
          </div>
        );
      }

      case 'aspect_ratio':
      case 'select': {
        if (field.id === 'aspect_ratio' || field.type === 'aspect_ratio') {
          const overrides = (activeModelOption?.field_overrides as Record<string, unknown>) || {};
          const aspectOverride = overrides.aspect_ratio as { options?: Array<{ label: string; value: string }> } | undefined;
          const options = aspectOverride?.options || field.options || DEFAULT_ASPECT_OPTIONS;
          const currentRatio = (val as string) || '1:1';

          return (
            <div key={field.id} className="dynamic-form-field field-aspect-ratio">
              <label className="field-label">{label}</label>
              <div className="aspect-ratio-selector-grid">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`aspect-option-pill ${currentRatio === opt.value ? 'active' : ''}`}
                    onClick={() => handleFieldChange(field.id, opt.value)}
                  >
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        }

        // Standard select
        return (
          <div key={field.id} className="dynamic-form-field field-select">
            <label className="field-label" htmlFor={`field-${field.id}`}>
              {label}
            </label>
            <select
              id={`field-${field.id}`}
              className="field-select-dropdown"
              value={String(val ?? field.defaultValue ?? '')}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );
      }

      case 'segmented_number': {
        const minVal = field.min ?? 1;
        const maxVal = field.max ?? 4;
        const currentCount = Number(val ?? field.defaultValue ?? 1);
        const segmentNumbers = Array.from(
          { length: maxVal - minVal + 1 },
          (_, i) => minVal + i
        );

        return (
          <div key={field.id} className="dynamic-form-field field-segmented-number">
            <label className="field-label">{label}</label>
            <div className="segmented-number-track">
              {segmentNumbers.map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`segmented-number-item ${currentCount === num ? 'active' : ''}`}
                  onClick={() => handleFieldChange(field.id, num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        );
      }

      case 'slider': {
        const numVal = typeof val === 'number' ? val : Number(val ?? field.defaultValue ?? field.min ?? 10);
        return (
          <div key={field.id} className="dynamic-form-field field-slider">
            <div className="slider-header-row">
              <label className="field-label" htmlFor={`field-${field.id}`}>
                {label}
              </label>
              <span className="slider-value-display">{numVal}</span>
            </div>
            <input
              id={`field-${field.id}`}
              type="range"
              className="field-slider-track"
              min={field.min ?? 1}
              max={field.max ?? 100}
              step={field.step ?? 1}
              value={numVal}
              onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
            />
          </div>
        );
      }

      case 'toggle': {
        const boolVal = Boolean(val ?? field.defaultValue);
        return (
          <div key={field.id} className="dynamic-form-field field-toggle">
            <span className="field-label">{label}</span>
            <button
              type="button"
              className={`field-toggle-switch ${boolVal ? 'on' : 'off'}`}
              onClick={() => handleFieldChange(field.id, !boolVal)}
              role="switch"
              aria-checked={boolVal}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        );
      }

      case 'seed': {
        const seedVal = typeof val === 'number' ? val : (val as string) || '';
        const handleRandomize = () => {
          const rand = Math.floor(Math.random() * 900000000) + 100000000;
          handleFieldChange(field.id, rand);
        };

        return (
          <div key={field.id} className="dynamic-form-field field-seed">
            <label className="field-label" htmlFor={`field-${field.id}`}>
              {label}
            </label>
            <div className="seed-input-group">
              <input
                id={`field-${field.id}`}
                type="number"
                className="seed-input"
                value={seedVal}
                placeholder={locale === 'fa' ? 'تصادفی' : 'Random'}
                onChange={(e) => handleFieldChange(field.id, e.target.value ? Number(e.target.value) : undefined)}
              />
              <button
                type="button"
                className="seed-randomize-btn"
                onClick={handleRandomize}
                title={locale === 'fa' ? 'سید تصادفی' : 'Randomize Seed'}
              >
                <Refresh01 size={14} strokeWidth={1.5} color="currentColor" />
              </button>
            </div>
          </div>
        );
      }

      default: {
        return (
          <div key={field.id} className="dynamic-form-field field-default">
            <label className="field-label" htmlFor={`field-${field.id}`}>
              {label}
            </label>
            <input
              id={`field-${field.id}`}
              type="text"
              className="field-text-input"
              value={String(val ?? field.defaultValue ?? '')}
              placeholder={placeholder}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            />
          </div>
        );
      }
    }
  };

  return (
    <div className="dynamic-tool-form-root" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. Model Selector Section if tool has models */}
      {tool.models && tool.models.length > 0 && (
        <div className="dynamic-form-field field-model-select">
          <label className="field-label">
            {locale === 'fa' ? 'مدل هوش مصنوعی' : 'Generative Model'}
          </label>
          <div className="model-select-cards-row">
            {tool.models.map((m) => {
              const isSelected = m.model_ref === currentModelRef;
              return (
                <button
                  key={m.model_ref}
                  type="button"
                  className={`model-select-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleModelChange(m.model_ref)}
                >
                  <div className="model-card-header">
                    <AiCpu size={16} strokeWidth={1.5} color="currentColor" />
                    <span className="model-name">{m.model_ref}</span>
                    {m.badge && (
                      <span className={`model-badge badge-${m.badge.toLowerCase()}`}>
                        {m.badge}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <div className="model-check-icon">
                      <Check01 size={14} strokeWidth={2} color="currentColor" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Server-Driven Input Fields */}
      <div className="dynamic-fields-stack">
        {tool.inputFields?.map((field) => renderField(field))}
      </div>
    </div>
  );
}
