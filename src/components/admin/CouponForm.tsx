import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import type { Coupon, CouponInput } from '../../types';
import { FormField } from './FormField';
import { FormSection } from './FormSection';
import { SwitchField } from './SwitchField';

interface FormValues {
  code: string;
  discountType: Coupon['discountType'];
  discountValue: string;
  minPurchase: string;
  maxDiscount: string;
  maxUses: string;
  /** yyyy-mm-dd, the value of a date input */
  validUntil: string;
  active: boolean;
}

type FieldName = 'code' | 'discountValue' | 'minPurchase' | 'maxDiscount' | 'maxUses';
type Errors = Partial<Record<FieldName, string>>;

// Top to bottom as they appear, so the first one with an error is the one to focus
const FIELD_ORDER: FieldName[] = ['code', 'discountValue', 'minPurchase', 'maxDiscount', 'maxUses'];

const MAX_CODE_LENGTH = 50;
// The backend field is a Java int; a larger number fails to parse there
const MAX_USES_LIMIT = 1_000_000;

const toValues = (coupon: Coupon | null): FormValues => ({
  code: coupon?.code ?? '',
  discountType: coupon?.discountType ?? 'percentage',
  discountValue: coupon ? String(coupon.discountValue) : '',
  minPurchase: coupon?.minPurchase != null ? String(coupon.minPurchase) : '',
  maxDiscount: coupon?.maxDiscount != null ? String(coupon.maxDiscount) : '',
  maxUses: String(coupon?.maxUses ?? 100),
  validUntil: coupon?.validUntil ? coupon.validUntil.slice(0, 10) : '',
  active: coupon?.active ?? true,
});

// An empty optional field is null; anything that is not a number comes out as NaN and fails validation
const parseOptional = (text: string) => (text.trim() === '' ? null : Number(text));

// Mirrors what the server accepts, so the admin hears about it before sending
function validate(values: FormValues): Errors {
  const errors: Errors = {};
  const isPercentage = values.discountType === 'percentage';

  if (!values.code.trim()) errors.code = 'Ingresá un código.';
  else if (values.code.trim().length > MAX_CODE_LENGTH) errors.code = `El código admite hasta ${MAX_CODE_LENGTH} caracteres.`;

  const value = parseOptional(values.discountValue);
  if (value === null) errors.discountValue = isPercentage ? 'Ingresá el porcentaje.' : 'Ingresá el monto.';
  else if (Number.isNaN(value) || value <= 0 || (isPercentage && value > 100)) {
    errors.discountValue = isPercentage ? 'El porcentaje tiene que ser mayor a 0 y hasta 100.' : 'El monto tiene que ser mayor a 0.';
  }

  const minPurchase = parseOptional(values.minPurchase);
  if (minPurchase !== null && (Number.isNaN(minPurchase) || minPurchase < 0)) errors.minPurchase = 'La compra mínima no puede ser negativa.';

  const maxDiscount = parseOptional(values.maxDiscount);
  if (isPercentage && maxDiscount !== null && !(maxDiscount > 0)) errors.maxDiscount = 'El tope tiene que ser mayor a 0';

  // Required: the server has no unlimited coupon
  const maxUses = parseOptional(values.maxUses);
  if (maxUses === null) errors.maxUses = 'Indicá cuántas veces se puede usar.';
  else if (!(Number.isInteger(maxUses) && maxUses >= 1 && maxUses <= MAX_USES_LIMIT)) errors.maxUses = 'Poné un número entre 1 y 1.000.000';

  return errors;
}

function toInput(values: FormValues, original: Coupon | null): CouponInput {
  const isPercentage = values.discountType === 'percentage';
  // Untouched date keeps the exact moment the server stored; a new one is valid until the end of that day
  const validUntil = !values.validUntil
    ? null
    : original?.validUntil?.startsWith(values.validUntil)
      ? original.validUntil
      : `${values.validUntil}T23:59:59`;

  return {
    code: values.code.trim().toUpperCase(),
    discountType: values.discountType,
    discountValue: Number(values.discountValue),
    validUntil,
    maxUses: Number(values.maxUses),
    minPurchase: parseOptional(values.minPurchase),
    maxDiscount: isPercentage ? parseOptional(values.maxDiscount) : null,
    active: values.active,
  };
}

// The error replaces the hint under the field, and FormField already ties that line to the control
const withError = (error: string | undefined, hint: string) =>
  error ? <span role="alert" className="text-rose-700">{error}</span> : hint;

interface CouponFormProps {
  /** The coupon being edited; null creates a new one */
  coupon: Coupon | null;
  /** The save request of this form is running */
  saving: boolean;
  /** Any request of the page is running */
  disabled: boolean;
  onSubmit: (input: CouponInput) => void;
  onCancel: () => void;
}

export function CouponForm({ coupon, saving, disabled, onSubmit, onCancel }: CouponFormProps) {
  const [values, setValues] = useState(() => toValues(coupon));
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputs = useRef<Partial<Record<FieldName, HTMLInputElement | null>>>({});

  // Errors are derived from the values, so after the first attempt they follow what the admin types
  const errors = validate(values);
  const shown: Errors = submitted ? errors : {};
  const isPercentage = values.discountType === 'percentage';

  // Callback ref that remembers each input, so a failed submit can focus the first invalid one
  const track = (name: FieldName) => (el: HTMLInputElement | null) => {
    inputs.current[name] = el;
  };

  // A form that opens far from the top (editing a row of a long list) has to bring itself into view
  useEffect(() => {
    formRef.current?.scrollIntoView({ block: 'start' });
    inputs.current.code?.focus({ preventScroll: true });
  }, []);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
    if (firstInvalid) {
      inputs.current[firstInvalid]?.focus();
      return;
    }
    onSubmit(toInput(values, coupon));
  };

  return (
    <form ref={formRef} id="coupon-form" noValidate onSubmit={handleSubmit} className="scroll-mt-24">
      <FormSection
        title={coupon ? `Editar cupón ${coupon.code}` : 'Nuevo cupón'}
        description="El descuento se calcula sobre el subtotal de los productos y cursos, sin el envío."
        className="animate-fade-in"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Código" required hint={withError(shown.code, 'Se guarda en mayúsculas.')}>
            {(control) => (
              <input
                {...control}
                ref={track('code')}
                value={values.code}
                onChange={(e) => set('code', e.target.value.toUpperCase())}
                placeholder="Ej: BIENVENIDA10"
                maxLength={MAX_CODE_LENGTH}
                autoComplete="off"
                aria-invalid={shown.code ? true : undefined}
                className="field scroll-mt-24"
              />
            )}
          </FormField>

          <FormField label="Tipo de descuento" hint="Porcentaje del subtotal o un monto fijo en pesos.">
            {(control) => (
              <select
                {...control}
                value={values.discountType}
                onChange={(e) => set('discountType', e.target.value as Coupon['discountType'])}
                className="field"
              >
                <option value="percentage">Porcentaje</option>
                <option value="fixed">Monto fijo</option>
              </select>
            )}
          </FormField>

          <FormField
            label={isPercentage ? 'Porcentaje' : 'Monto'}
            required
            hint={withError(shown.discountValue, isPercentage ? 'De 0 a 100.' : 'En pesos, sin puntos: 12000.')}
          >
            {(control) => (
              <input
                {...control}
                ref={track('discountValue')}
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={values.discountValue}
                onChange={(e) => set('discountValue', e.target.value)}
                aria-invalid={shown.discountValue ? true : undefined}
                className="field scroll-mt-24"
              />
            )}
          </FormField>

          <FormField
            label="Compra mínima (opcional)"
            hint={withError(shown.minPurchase, 'Subtotal mínimo, en pesos y sin puntos: 12000. Vacío: sin mínimo.')}
          >
            {(control) => (
              <input
                {...control}
                ref={track('minPurchase')}
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={values.minPurchase}
                onChange={(e) => set('minPurchase', e.target.value)}
                aria-invalid={shown.minPurchase ? true : undefined}
                className="field scroll-mt-24"
              />
            )}
          </FormField>

          {isPercentage && (
            <FormField
              label="Tope del descuento (opcional)"
              hint={withError(shown.maxDiscount, 'Máximo a descontar, en pesos y sin puntos: 12000. Vacío: sin tope.')}
            >
              {(control) => (
                <input
                  {...control}
                  ref={track('maxDiscount')}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={values.maxDiscount}
                  onChange={(e) => set('maxDiscount', e.target.value)}
                  aria-invalid={shown.maxDiscount ? true : undefined}
                  className="field scroll-mt-24"
                />
              )}
            </FormField>
          )}

          <FormField
            label="Usos máximos"
            required
            hint={withError(shown.maxUses, 'Si no querés limitarlo, poné un número alto.')}
          >
            {(control) => (
              <input
                {...control}
                ref={track('maxUses')}
                type="number"
                inputMode="numeric"
                min="1"
                max={MAX_USES_LIMIT}
                step="1"
                value={values.maxUses}
                onChange={(e) => set('maxUses', e.target.value)}
                aria-invalid={shown.maxUses ? true : undefined}
                className="field scroll-mt-24"
              />
            )}
          </FormField>

          <FormField label="Vence el (opcional)" hint="Vale hasta el final de ese día. Vacío: no vence.">
            {(control) => (
              <input
                {...control}
                type="date"
                value={values.validUntil}
                onChange={(e) => set('validUntil', e.target.value)}
                className="field"
              />
            )}
          </FormField>
        </div>

        <SwitchField
          label="Cupón activo"
          description="Si lo desactivás, nadie puede usarlo."
          checked={values.active}
          onChange={(checked) => set('active', checked)}
        />

        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <button type="submit" disabled={disabled} aria-busy={saving} className="btn btn-primary">
            {saving ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Guardando...
              </>
            ) : coupon ? (
              'Guardar cambios'
            ) : (
              'Crear cupón'
            )}
          </button>
          <button type="button" onClick={onCancel} disabled={saving} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </FormSection>
    </form>
  );
}
