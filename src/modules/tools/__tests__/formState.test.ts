import { describe, it, expect } from 'vitest';
import { resolveFormState } from '../utils/formState';
import type { ToolManifest } from '@/sdk/types';

describe('resolveFormState', () => {
  const mockTool: ToolManifest = {
    id: 'text-to-image',
    name: 'Text to Image',
    nameFa: 'تولید تصویر',
    description: 'Generate image from prompt',
    descriptionFa: 'تولید تصویر از متن',
    version: 3,
    type: 'ai_generator',
    category: 'generation',
    outputType: 'image',
    inputFields: [
      {
        id: 'prompt',
        type: 'textarea',
        label: 'Prompt',
        labelFa: 'پرامپت',
        required: true,
      },
      {
        id: 'num_outputs',
        type: 'segmented_number',
        label: 'Number of Images',
        labelFa: 'تعداد تصاویر',
        defaultValue: 1,
        min: 1,
        max: 4,
      },
      {
        id: 'steps',
        type: 'slider',
        label: 'Steps',
        labelFa: 'تعداد مراحل',
        defaultValue: 28,
        min: 10,
        max: 50,
      },
      {
        id: 'aspect_ratio',
        type: 'aspect_ratio',
        label: 'Aspect Ratio',
        labelFa: 'نسبت تصویر',
        defaultValue: '1:1',
        options: [
          { label: '1:1', value: '1:1' },
          { label: '16:9', value: '16:9' },
          { label: '9:16', value: '9:16' },
        ],
      },
    ],
    models: [
      {
        model_ref: 'gpt-image-2',
        default: true,
        order: 1,
        badge: 'Live',
      },
      {
        model_ref: 'fal-ai/flux-dev',
        order: 2,
        badge: 'Flagship',
        field_overrides: {
          steps: { max: 35, defaultValue: 28 },
          num_outputs: { max: 2 },
        },
      },
    ],
  };

  it('sets initial model and applies default values', () => {
    const state = resolveFormState(mockTool, 'gpt-image-2', {});
    expect(state.model).toBe('gpt-image-2');
    expect(state.model_ref).toBe('gpt-image-2');
    expect(state.num_outputs).toBe(1);
    expect(state.steps).toBe(28);
    expect(state.aspect_ratio).toBe('1:1');
  });

  it('clamps values when switching to a model with stricter overrides', () => {
    const currentState = {
      model: 'gpt-image-2',
      num_outputs: 4,
      steps: 45,
      aspect_ratio: '16:9',
    };

    const nextState = resolveFormState(mockTool, 'fal-ai/flux-dev', currentState);
    expect(nextState.model).toBe('fal-ai/flux-dev');
    // flux-dev overrides num_outputs max to 2 and steps max to 35
    expect(nextState.num_outputs).toBe(2);
    expect(nextState.steps).toBe(35);
    expect(nextState.aspect_ratio).toBe('16:9');
  });

  it('handles null or undefined tool gracefully', () => {
    const state = resolveFormState(null, 'gpt-image-2', { foo: 'bar' });
    expect(state.model).toBe('gpt-image-2');
    expect(state.foo).toBe('bar');
  });
});
