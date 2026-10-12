/**
 * Dynamic Tool Form State Resolver
 *
 * Implements pure function resolveFormState per ADR-021.
 * Dynamically reconciles field values and overrides when switching models.
 */

import type { ToolManifest } from '@/sdk/types';

export function resolveFormState(
  tool: ToolManifest | null | undefined,
  selectedModel: string,
  currentValues: Record<string, unknown>
): Record<string, unknown> {
  const nextValues: Record<string, unknown> = {
    ...currentValues,
    model: selectedModel,
    model_ref: selectedModel,
  };

  if (!tool) {
    return nextValues;
  }

  // Find target model option and overrides
  const modelOption = tool.models?.find((m) => m.model_ref === selectedModel);
  const overrides = (modelOption?.field_overrides as Record<string, unknown>) || {};

  for (const field of tool.inputFields || []) {
    const fieldId = field.id;
    const currentVal = nextValues[fieldId];
    const fieldOverride = (overrides[fieldId] as Record<string, unknown>) || {};

    const effectiveMin = typeof fieldOverride.min === 'number' ? fieldOverride.min : field.min;
    const effectiveMax = typeof fieldOverride.max === 'number' ? fieldOverride.max : field.max;
    const effectiveDefault = fieldOverride.defaultValue !== undefined ? fieldOverride.defaultValue : field.defaultValue;
    const allowedOptions = (fieldOverride.options as Array<{ value: string; label?: string }>) || field.options;

    if (field.type === 'slider' || field.type === 'segmented_number') {
      let numVal = typeof currentVal === 'number' ? currentVal : Number(currentVal);
      if (Number.isNaN(numVal)) {
        numVal = typeof effectiveDefault === 'number' ? effectiveDefault : (effectiveMin ?? 1);
      }
      if (effectiveMin !== undefined && numVal < effectiveMin) {
        numVal = effectiveMin;
      }
      if (effectiveMax !== undefined && numVal > effectiveMax) {
        numVal = effectiveMax;
      }
      nextValues[fieldId] = numVal;
    } else if (field.type === 'select' || field.type === 'aspect_ratio') {
      if (allowedOptions && allowedOptions.length > 0) {
        const optionValues = allowedOptions.map((opt) => (typeof opt === 'string' ? opt : opt.value));
        if (currentVal && !optionValues.includes(String(currentVal))) {
          nextValues[fieldId] = effectiveDefault ?? optionValues[0];
        } else if (!currentVal && effectiveDefault !== undefined) {
          nextValues[fieldId] = effectiveDefault;
        }
      }
    } else if (currentVal === undefined && effectiveDefault !== undefined) {
      nextValues[fieldId] = effectiveDefault;
    }
  }

  return nextValues;
}
