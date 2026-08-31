import type { PedidoItem } from "../types/pedido";
import { currencyBR } from "../utils/mascaras";

interface Props { items: PedidoItem[]; onRemove: (id: string) => void; }

export default function ItensList({ items, onRemove }: Props) {
  if (!items.length) return <div className="empty-items"><div className="empty-items-icon">＋</div><strong>Nenhum produto no pedido</strong><span>Os produtos adicionados aparecerão aqui. Você pode incluir vários e remover qualquer um antes de gerar o PDF.</span></div>;
  return <div className="items-area">
    <div className="items-list-heading"><div><strong>{items.length} {items.length === 1 ? "item adicionado" : "itens adicionados"}</strong><span>Confira os produtos antes de gerar o comprovante.</span></div></div>
    <div className="items-table-wrap"><table className="items-table"><thead><tr><th>Código</th><th>Descrição</th><th>NCM</th><th>Qtd.</th><th>Unit.</th><th>Total</th><th></th></tr></thead><tbody>
      {items.map(item => <tr key={item.id}><td>{item.codigo}</td><td className="description-cell">{item.descricao}</td><td>{item.ncm}</td><td>{item.quantidade.toFixed(2).replace(".", ",")}</td><td>{currencyBR(item.valorUnitario)}</td><td><strong>{currencyBR(item.quantidade * item.valorUnitario)}</strong></td><td><button className="remove-button" type="button" onClick={() => onRemove(item.id)} aria-label={`Remover ${item.descricao}`} title="Remover item">×</button></td></tr>)}
    </tbody></table></div>
  </div>;
}
