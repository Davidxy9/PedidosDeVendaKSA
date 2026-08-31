import type { PedidoTotals } from "../types/pedido";
import { currencyBR } from "../utils/mascaras";

export default function Totais({ totals }: { totals: PedidoTotals }) {
  return (
    <div className="totals-card">
      <div><span>Subtotal</span><strong>{currencyBR(totals.subtotal)}</strong></div>
      {/* <div><span>IPI</span><strong>{currencyBR(totals.ipi)}</strong></div>
      <div><span>ICMS ST</span><strong>{currencyBR(totals.icmsSt)}</strong></div> */}
      <div className="total-highlight"><span>Total geral</span><strong>{currencyBR(totals.total)}</strong></div>
    </div>
  );
}
