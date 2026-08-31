export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function maskCPF(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function maskTelefone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function maskCEP(value: string) {
  return onlyDigits(value)
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");
}

export function currencyBR(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

function safeDate(value: string): Date | null {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateBR(value: string | Date) {
  const date = typeof value === "string" ? safeDate(value) : value;
  if (!date || Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

export function todayInputValue() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function addDays(dateInput: string, days: number) {
  const date = safeDate(dateInput);
  if (!date) return dateInput;
  date.setDate(date.getDate() + days);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function addMonths(dateInput: string, months: number) {
  const date = safeDate(dateInput);
  if (!date) return dateInput;
  date.setMonth(date.getMonth() + months);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

// Divide o total em N parcelas de 2 casas decimais, jogando os centavos que
// sobrarem do arredondamento nas primeiras parcelas — assim a soma das
// parcelas sempre bate exatamente com o total.
export function splitInstallments(total: number, parcelas: number) {
  const safeParcelas = Math.max(1, Math.floor(parcelas) || 1);
  const baseCents = Math.floor((total * 100) / safeParcelas);
  const totalCents = Math.round(total * 100);
  const remainder = totalCents - baseCents * safeParcelas;
  return Array.from({ length: safeParcelas }, (_, i) =>
    (baseCents + (i < remainder ? 1 : 0)) / 100,
  );
}

export function parseBRNumber(value: string) {
  const normalized = value
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return Number(normalized);
}

export function formatNumberInput(value: string) {
  return value.replace(/[^0-9,.\-]/g, "");
}
