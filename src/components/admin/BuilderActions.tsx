import { Loader2, Save } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BuilderActionsProps {
  saving: boolean;
  /** Text of the save button, already including the "Guardando..." state */
  saveLabel: string;
  onSave: () => void;
  onCancel: () => void;
  /** 'stack' puts save over cancel (sidebar card); 'row' puts them side by side (bottom bar) */
  layout?: 'stack' | 'row';
  className?: string;
}

/** Save (ink, with its loading state) and cancel (ghost) of a builder page */
export function BuilderActions({ saving, saveLabel, onSave, onCancel, layout = 'row', className }: BuilderActionsProps) {
  const isRow = layout === 'row';

  return (
    <div className={cn('flex gap-3', isRow ? 'flex-row-reverse' : 'flex-col', className)}>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        aria-busy={saving}
        className={cn('btn btn-primary', isRow ? 'flex-1' : 'w-full')}
      >
        {saving ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="size-5" aria-hidden="true" />
        )}
        {saveLabel}
      </button>
      <button type="button" onClick={onCancel} className={cn('btn btn-ghost', !isRow && 'w-full')}>
        Cancelar
      </button>
    </div>
  );
}
