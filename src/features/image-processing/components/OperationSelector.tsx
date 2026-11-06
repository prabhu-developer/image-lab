import React from 'react';
import { Minimize2, Maximize2, RefreshCw } from 'lucide-react';
import { OperationType } from '../types';

interface OperationSelectorProps {
  currentOperation: OperationType;
  onSelectOperation: (op: OperationType) => void;
  disabled?: boolean;
}

export const OperationSelector: React.FC<OperationSelectorProps> = ({
  currentOperation,
  onSelectOperation,
  disabled = false,
}) => {
  const operations: Array<{
    id: OperationType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }> = [
    {
      id: 'compress',
      label: 'Compress',
      icon: Minimize2,
      description: 'Optimize file size while retaining visual quality',
    },
    {
      id: 'resize',
      label: 'Resize',
      icon: Maximize2,
      description: 'Scale pixel dimensions or choose standard presets',
    },
    {
      id: 'convert',
      label: 'Convert',
      icon: RefreshCw,
      description: 'Change formats between JPEG, PNG, and WebP',
    },
  ];

  return (
    <div className="grid grid-cols-3 p-1 bg-surface-subtle border border-border-subtle rounded-lg gap-1">
      {operations.map((op) => {
        const Icon = op.icon;
        const isActive = currentOperation === op.id;

        return (
          <button
            key={op.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectOperation(op.id)}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-md text-xs font-medium transition-all select-none ${
              isActive
                ? 'bg-surface text-foreground shadow-subtle border border-border/80'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface/50 border border-transparent'
            } disabled:opacity-50 disabled:pointer-events-none`}
            title={op.description}
          >
            <Icon
              className={`w-3.5 h-3.5 shrink-0 ${
                isActive ? 'text-primary' : 'text-foreground-muted'
              }`}
            />
            <span>{op.label}</span>
          </button>
        );
      })}
    </div>
  );
};
