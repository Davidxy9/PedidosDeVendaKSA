import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import type { ItemFormData, PedidoItem } from "../types/pedido";
import { formatNumberInput, parseBRNumber } from "../utils/mascaras";

const itemSchema = z.object({
  codigo: z.string().trim().min(1, "Informe o código."),
  descricao: z.string().trim().min(1, "Informe a descrição."),
  ncm: z.string().trim().min(1, "Informe o NCM."),
  quantidade: z.string().trim().min(1, "Informe a quantidade.").refine(v => parseBRNumber(v) > 0, "Quantidade deve ser positiva."),
  valorUnitario: z.string().trim().min(1, "Informe o valor.").refine(v => parseBRNumber(v) > 0, "Valor deve ser positivo."),
});

interface Props { onAdd: (item: PedidoItem) => void; }

export default function ItemForm({ onAdd }: Props) {
  const [added, setAdded] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: { codigo: "", descricao: "", ncm: "", quantidade: "1,00", valorUnitario: "" },
  });

  const submit = (data: ItemFormData) => {
    onAdd({
      id: uuidv4(), codigo: data.codigo.trim(), descricao: data.descricao.trim(), ncm: data.ncm.trim(),
      quantidade: parseBRNumber(data.quantidade), valorUnitario: parseBRNumber(data.valorUnitario),
    });
    reset({ codigo: "", descricao: "", ncm: "", quantidade: "1,00", valorUnitario: "" });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="item-form">
      <div className="item-form-title">
        <div><strong>Adicionar produto</strong><span>Inclua quantos produtos quiser. Eles permanecem na lista até você remover ou gerar o PDF.</span></div>
        <span className="item-counter-hint">+ item</span>
      </div>
      <div className="item-grid">
        <label className="field"><span>Código *</span><input {...register("codigo")} placeholder="19855.193" autoComplete="off" />{errors.codigo && <small>{errors.codigo.message}</small>}</label>
        <label className="field field-span-2"><span>Descrição *</span><input {...register("descricao")} placeholder="COMODA DUBAI C/ SAP PRIME - CINAMOFF" autoComplete="off" />{errors.descricao && <small>{errors.descricao.message}</small>}</label>
        <label className="field"><span>NCM *</span><input {...register("ncm")} inputMode="numeric" placeholder="9403.50.00" autoComplete="off" />{errors.ncm && <small>{errors.ncm.message}</small>}</label>
        <label className="field"><span>Quantidade *</span><input {...register("quantidade", { onChange: e => { e.target.value = formatNumberInput(e.target.value); } })} inputMode="decimal" placeholder="1,00" />{errors.quantidade && <small>{errors.quantidade.message}</small>}</label>
        <label className="field"><span>Valor unitário (R$) *</span><input {...register("valorUnitario", { onChange: e => { e.target.value = formatNumberInput(e.target.value); } })} inputMode="decimal" placeholder="499,00" />{errors.valorUnitario && <small>{errors.valorUnitario.message}</small>}</label>
        <button className="button button-primary add-item" type="button" onClick={() => void handleSubmit(submit)()}><span>＋</span> ADICIONAR ITEM</button>
      </div>
      {added && <div className="inline-success">✓ Item adicionado. Você pode adicionar outro produto.</div>}
    </div>
  );
}
