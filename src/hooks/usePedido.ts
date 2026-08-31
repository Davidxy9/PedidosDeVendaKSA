import { useMemo, useReducer } from "react";
import type { PedidoItem, PedidoTotals } from "../types/pedido";

type Action =
  | { type: "ADD_ITEM"; item: PedidoItem }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "CLEAR_ITEMS" };

function reducer(items: PedidoItem[], action: Action): PedidoItem[] {
  switch (action.type) {
    case "ADD_ITEM":
      return [...items, action.item];
    case "REMOVE_ITEM":
      return items.filter((item) => item.id !== action.id);
    case "CLEAR_ITEMS":
      return [];
    default:
      return items;
  }
}

export function usePedido(initialItems: PedidoItem[] = []) {
  const [items, dispatch] = useReducer(reducer, initialItems);

  const totals = useMemo<PedidoTotals>(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantidade * item.valorUnitario,
      0,
    );
    const ipi = 0;
    const icmsSt = 0;
    return {
      subtotal,
      ipi,
      icmsSt,
      total: subtotal + ipi + icmsSt,
    };
  }, [items]);

  return {
    items,
    totals,
    addItem: (item: PedidoItem) => dispatch({ type: "ADD_ITEM", item }),
    removeItem: (id: string) => dispatch({ type: "REMOVE_ITEM", id }),
    clearItems: () => dispatch({ type: "CLEAR_ITEMS" }),
  };
}
