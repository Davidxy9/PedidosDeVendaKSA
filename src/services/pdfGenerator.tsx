import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { Pedido, PedidoTotals } from "../types/pedido";
import { currencyBR, formatDateBR, addMonths, splitInstallments } from "../utils/mascaras";
import logoLacerda from "../assets/logoLacerda.jpeg";


const C = {
  navy: "#173B63",
  blue: "#1D4E7A",
  yellow: "#E5B43C",
  yellowLight: "#FFF4C9",
  border: "#D5D9DE",
  text: "#1D2733",
  muted: "#5B6673",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingHorizontal: 34,
    paddingBottom: 30,
    fontFamily: "Helvetica",
    fontSize: 8.2,
    color: C.text,
    backgroundColor: C.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 12,
    marginBottom: 14,
  },
  brandWrap: { width: "28%" },
  logoImage: {
    width: 90,
    height: 75,
    objectFit: "contain",
  },
  company: { width: "69%", alignItems: "flex-end" },
  companyName: { fontSize: 11, fontWeight: 700, marginBottom: 8, color: C.text },
  companyLine: { fontSize: 7.2, color: C.muted, marginBottom: 2 },
  title: { fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 18 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: C.text,
    marginBottom: 7,
  },
  twoCol: { flexDirection: "row", gap: 20, marginBottom: 16 },
  col: { width: "50%" },
  fieldLine: { flexDirection: "row", marginBottom: 4 },
  label: { fontWeight: 700, width: 50, color: C.text },
  value: { flex: 1, color: C.text },
  table: { borderWidth: 1, borderColor: C.border, marginTop: 5 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: C.yellow,
    color: C.text,
    minHeight: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#C79C20",
  },
  row: {
    flexDirection: "row",
    minHeight: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EBEE",
  },
  cell: { paddingHorizontal: 5, paddingVertical: 4 },
  code: { width: "12%" },
  description: { width: "37%" },
  ncm: { width: "13%" },
  qty: { width: "12%", textAlign: "right" },
  unit: { width: "13%", textAlign: "right" },
  total: { width: "13%", textAlign: "right" },
  totalsWrap: { alignItems: "flex-end", marginTop: 5, marginBottom: 18 },
  totalLine: { flexDirection: "row", width: 170, justifyContent: "space-between", paddingVertical: 3 },
  totalLabel: { fontWeight: 700 },
  grand: {
    borderTopWidth: 1,
    borderTopColor: C.navy,
    marginTop: 2,
    paddingTop: 5,
    fontSize: 9.5,
    color: C.navy,
  },
  vencimentos: { marginBottom: 18 },
  miniTable: { width: 230, borderWidth: 1, borderColor: C.border },
  miniHead: { flexDirection: "row", backgroundColor: C.yellowLight },
  miniRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: C.border },
  miniCell: { width: "33.333%", padding: 5, textAlign: "center" },
  infoTitle: { fontSize: 10, fontWeight: 700, marginBottom: 7 },
  infoGrid: { flexDirection: "row", gap: 30 },
  infoCol: { width: "50%" },
  infoLine: { marginBottom: 5, flexDirection: "row" },
  infoLabel: { fontWeight: 700, width: 105 },
  paid: {
    color: "#137333",
    fontWeight: 700,
    borderWidth: 1,
    borderColor: "#7BC58A",
    backgroundColor: "#EAF7ED",
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  noteBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: C.border,
    padding: 7,
    minHeight: 25,
  },
  footer: {
    position: "absolute",
    bottom: 14,
    left: 34,
    right: 34,
    textAlign: "center",
    color: "#8A929B",
    fontSize: 6.5,
  },
});

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldLine}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value || "—"}</Text>
    </View>
  );
}

function OrderPdf({ pedido, totals }: { pedido: Pedido; totals: PedidoTotals }) {
  return (
    <Document title={`Pedido de Venda Nº ${pedido.numero}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandWrap}>
            <Image src={logoLacerda} style={styles.logoImage} />
          </View>
          <View style={styles.company}>
            <Text style={styles.companyName}>ELIONALDO LACERDA AVELINO JÚNIOR</Text>
            <Text style={styles.companyLine}>CNPJ: 40.472.534.0001-35</Text>
            <Text style={styles.companyLine}>Inscrição Estadual: 163872457</Text>
            <Text style={styles.companyLine}>RUA COMERCIANTE JOSÉ DE SANTANA, 1</Text>
            <Text style={styles.companyLine}>VALENTINA DE FIGUEIREDO</Text>
            <Text style={styles.companyLine}>João Pessoa - PB · CEP: 58063-450</Text>
            <Text style={styles.companyLine}>Telefone: (83) 98104-1997</Text>
          </View>
        </View>

        <Text style={styles.title}>Pedido de Venda N° {pedido.numero}</Text>

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Informações do Cliente</Text>
            <Field label="Nome" value={pedido.cliente.nome} />
            <Field label="CPF" value={pedido.cliente.cpf} />
            <Field label="Telefone" value={pedido.cliente.telefone} />
            <Field label="Email" value={pedido.cliente.email} />
          </View>
          <View style={styles.col}>
            <Field label="Endereço" value={`${pedido.endereco.rua}, ${pedido.endereco.numero}`} />
            <Field label="Bairro" value={pedido.endereco.bairro} />
            <Field label="Cidade" value={`${pedido.endereco.cidade} - ${pedido.endereco.estado}`} />
            <Field label="CEP" value={pedido.endereco.cep} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Itens do Pedido de Venda</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.code]}>Código</Text>
            <Text style={[styles.cell, styles.description]}>Descrição</Text>
            <Text style={[styles.cell, styles.ncm]}>NCM</Text>
            <Text style={[styles.cell, styles.qty]}>Quant.</Text>
            <Text style={[styles.cell, styles.unit]}>Unit.</Text>
            <Text style={[styles.cell, styles.total]}>Valor Total</Text>
          </View>
          {pedido.itens.map((item) => (
            <View style={styles.row} key={item.id}>
              <Text style={[styles.cell, styles.code]}>{item.codigo}</Text>
              <Text style={[styles.cell, styles.description]}>{item.descricao}</Text>
              <Text style={[styles.cell, styles.ncm]}>{item.ncm}</Text>
              <Text style={[styles.cell, styles.qty]}>{item.quantidade.toFixed(2).replace(".", ",")}</Text>
              <Text style={[styles.cell, styles.unit]}>{currencyBR(item.valorUnitario)}</Text>
              <Text style={[styles.cell, styles.total]}>{currencyBR(item.quantidade * item.valorUnitario)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsWrap}>
          <View style={styles.totalLine}><Text style={styles.totalLabel}>Subtotal:</Text><Text>{currencyBR(totals.subtotal)}</Text></View>
          {/* <View style={styles.totalLine}><Text style={styles.totalLabel}>IPI:</Text><Text>{currencyBR(totals.ipi)}</Text></View>
          <View style={styles.totalLine}><Text style={styles.totalLabel}>ICMS ST:</Text><Text>{currencyBR(totals.icmsSt)}</Text></View> */}
          <View style={[styles.totalLine, styles.grand]}><Text style={styles.totalLabel}>Total:</Text><Text>{currencyBR(totals.total)}</Text></View>
        </View>

        <View style={styles.vencimentos}>
          <Text style={styles.sectionTitle}>Vencimentos · {pedido.parcelas > 1 ? "Parcelamento" : "À Vista"}</Text>
          <View style={styles.miniTable}>
            <View style={styles.miniHead}>
              <Text style={[styles.miniCell, { fontWeight: 700 }]}>Parcela</Text>
              <Text style={[styles.miniCell, { fontWeight: 700 }]}>Vencimento</Text>
              <Text style={[styles.miniCell, { fontWeight: 700 }]}>Valor</Text>
            </View>
            {splitInstallments(totals.total, pedido.parcelas).map((valor, i) => (
              <View style={styles.miniRow} key={i}>
                <Text style={styles.miniCell}>{i + 1}</Text>
                <Text style={styles.miniCell}>{formatDateBR(addMonths(pedido.vencimento, i))}</Text>
                <Text style={styles.miniCell}>{currencyBR(valor)}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.infoTitle}>Outras Informações</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <View style={styles.infoLine}><Text style={styles.infoLabel}>Pedido de Venda - incluído em:</Text><Text>{formatDateBR(pedido.dataPedido)} às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</Text></View>
            <View style={styles.infoLine}><Text style={styles.infoLabel}>Previsão de Faturamento:</Text><Text>{formatDateBR(pedido.previsaoFaturamento)}</Text></View>
            <View style={styles.infoLine}><Text style={styles.infoLabel}>Origem:</Text><Text>{pedido.origem}</Text></View>
            <View style={styles.infoLine}><Text style={styles.infoLabel}>Vendedor:</Text><Text>{pedido.vendedor}</Text></View>
            <View style={styles.infoLine}><Text style={styles.infoLabel}>Forma de Pagamento:</Text><Text>{pedido.formaPagamento}</Text></View>
          </View>
          <View style={styles.infoCol}>
            <View style={styles.infoLine}><Text style={styles.infoLabel}>Status:</Text><Text style={styles.paid}>{pedido.status}</Text></View>
            <View style={styles.infoLine}><Text style={styles.infoLabel}>Data de pagamento:</Text><Text>{formatDateBR(pedido.dataPagamento)}</Text></View>
            <View style={styles.noteBox}><Text>{pedido.observacoes || "Sem observações."}</Text></View>
          </View>
        </View>

        <Text style={styles.footer}>KSA LACERDA · Pedido de Venda · Documento gerado pelo sistema interno</Text>
      </Page>
    </Document>
  );
}

export async function generatePedidoPdf(pedido: Pedido, totals: PedidoTotals) {
  const blob = await pdf(<OrderPdf pedido={pedido} totals={totals} />).toBlob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `Pedido-Venda-${pedido.numero}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
