import { Fragment } from "react";
import type { Pedido, PedidoTotals } from "../types/pedido";
import { currencyBR, formatDateBR, addMonths, splitInstallments } from "../utils/mascaras";
// import logoLacerda from "../../dist/assets/logoLacerda.jpeg";
import logoLacerda from "../assets/logoLacerda.jpeg";

export default function PedidoPreview({ pedido, totals }: { pedido: Pedido; totals: PedidoTotals }) {
  return (
    <div className="preview-paper">
      <div className="preview-header">
        <img src={logoLacerda} alt="Logo Lacerda" width={60} height={50}/>
        {/* <div className="preview-logo"><b>db</b><span>OUTLET<br />DOS MÓVEIS</span></div> */}
        <div className="preview-company"><b>ELIONALDO LACERDA AVELINO JÚNIOR</b><span>CNPJ: 40.472.534.0001-35</span><span>Inscrição Estadual: 163872457</span><span>RUA COMERCIANTE JOSÉ DE SANTANA, 1</span><span>VALENTINA DE FIGUEIREDO</span><span>João Pessoa - PB · CEP: 58063-450</span><span>Telefone: (83) 98104-1997</span></div>
      </div>
      <h3>Pedido de Venda N° {pedido.numero}</h3>
      <div className="preview-two-col">
        <div><b>Informações do Cliente</b><p><strong>Nome:</strong> {pedido.cliente.nome || "—"}</p><p><strong>CPF:</strong> {pedido.cliente.cpf || "—"}</p><p><strong>Telefone:</strong> {pedido.cliente.telefone || "—"}</p><p><strong>Email:</strong> {pedido.cliente.email || "—"}</p></div>
        <div><p><strong>Endereço:</strong> {pedido.endereco.rua || "—"}, {pedido.endereco.numero || "—"}</p><p><strong>Bairro:</strong> {pedido.endereco.bairro || "—"}</p><p><strong>Cidade:</strong> {pedido.endereco.cidade || "—"} - {pedido.endereco.estado || "—"}</p><p><strong>CEP:</strong> {pedido.endereco.cep || "—"}</p></div>
      </div>
      <b>Itens do Pedido de Venda</b>
      <div className="preview-items"><div className="preview-item head"><span>Código</span><span>Descrição</span><span>NCM</span><span>Quant.</span><span>Unit.</span><span>Valor Total</span></div>
      {pedido.itens.length ? pedido.itens.map(i => <div className="preview-item" key={i.id}><span>{i.codigo}</span><span>{i.descricao}</span><span>{i.ncm}</span><span>{i.quantidade.toFixed(2).replace(".", ",")}</span><span>{currencyBR(i.valorUnitario)}</span><span>{currencyBR(i.quantidade*i.valorUnitario)}</span></div>) : <div className="preview-empty">Adicione itens para visualizar a tabela.</div>}</div>
      {/* <div className="preview-totals"><span>Subtotal: {currencyBR(totals.subtotal)}</span><span>IPI: {currencyBR(totals.ipi)}</span><span>ICMS ST: {currencyBR(totals.icmsSt)}</span><strong>Total: {currencyBR(totals.total)}</strong></div> */}
      <b>Vencimentos · {pedido.parcelas > 1 ? "Parcelamento" : "À Vista"}</b>
      <div className="preview-due">
        {splitInstallments(totals.total, pedido.parcelas).map((valor, i) => (
          <Fragment key={i}>
            <span>Parcela <b>{i + 1}</b></span>
            <span>Vencimento <b>{pedido.vencimento ? formatDateBR(addMonths(pedido.vencimento, i)) : "—"}</b></span>
            <span>Valor <b>{currencyBR(valor)}</b></span>
          </Fragment>
        ))}
      </div>
      <b>Outras Informações</b>
      <div className="preview-info"><div><p><strong>Pedido de Venda - incluído em:</strong> {formatDateBR(pedido.dataPedido)}</p><p><strong>Previsão de Faturamento:</strong> {formatDateBR(pedido.previsaoFaturamento)}</p><p><strong>Origem:</strong> {pedido.origem}</p><p><strong>Vendedor:</strong> {pedido.vendedor}</p><p><strong>Forma de Pagamento:</strong> {pedido.formaPagamento || "—"}</p></div><div><p><strong>Status:</strong> <em>{pedido.status}</em></p><p><strong>Data de pagamento:</strong> {formatDateBR(pedido.dataPagamento)}</p><p><strong>Observações:</strong> {pedido.observacoes || "—"}</p></div></div>
    </div>
  );
}
