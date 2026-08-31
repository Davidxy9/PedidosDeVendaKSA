import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ClienteForm from "../components/ClienteForm";
import EnderecoForm from "../components/EnderecoForm";
import ItemForm from "../components/ItemForm";
import ItensList from "../components/ItensList";
import Totais from "../components/Totais";
import PedidoPreview from "../components/PedidoPreview";
import { usePedido } from "../hooks/usePedido";
import { generatePedidoPdf } from "../services/pdfGenerator";
import { generatePedidoNumber } from "../services/pedidoNumber";
import { formatDateBR, todayInputValue } from "../utils/mascaras"
import type { Pedido, PedidoFormData } from "../types/pedido";

const schema = z.object({
  nome: z.string().trim().min(3, "Informe o nome completo."),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido."),
  telefone: z.string().min(14, "Telefone inválido."),
  email: z.string().email("Email inválido."),
  rua: z.string().trim().min(1, "Informe a rua."),
  numero: z.string().trim().min(1, "Informe o número."),
  bairro: z.string().trim().min(1, "Informe o bairro."),
  cidade: z.string().trim().min(2, "Informe a cidade."),
  estado: z.string().length(2, "Selecione o estado."),
  cep: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido."),
  vencimento: z.string().min(1, "Informe a data de vencimento."),
  formaPagamento: z.string().min(1, "Selecione a forma de pagamento."),
  parcelas: z.string().trim().min(1, "Informe as parcelas.").refine(v => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 1 && n <= 12;
  }, "Parcelas deve ser um número inteiro entre 1 e 12."),
  origem: z.string().min(1, "Selecione a origem."),
  vendedor: z.string().trim().min(2, "Informe o vendedor."),
  observacoes: z.string().max(300, "Máximo de 300 caracteres."),
});

const defaultFormValues = {
  estado: "",
  vencimento: "",
  formaPagamento: "",
  parcelas: "1",
  origem: "VENDA ONLINE",
  vendedor: "",
  observacoes: "",
};

export default function Home() {
  const today = useMemo(todayInputValue, []);
  const [pedidoNumber, setPedidoNumber] = useState(generatePedidoNumber);
  const dataPagamento = today;
  const [status] = useState("PAGO");
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"cadastro" | "preview">("cadastro");
  const { items, totals, addItem, removeItem, clearItems } = usePedido();

  const { register, setValue, watch, handleSubmit, reset, formState: { errors } } = useForm<PedidoFormData>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultFormValues, vencimento: today },
  });

  const form = watch();

  const pedido: Pedido = {
    numero: pedidoNumber,
    cliente: { nome: form.nome || "", cpf: form.cpf || "", telefone: form.telefone || "", email: form.email || "" },
    endereco: { rua: form.rua || "", numero: form.numero || "", bairro: form.bairro || "", cidade: form.cidade || "", estado: form.estado || "", cep: form.cep || "" },
    itens: items,
    dataPedido: today,
    previsaoFaturamento: today,
    vencimento: form.vencimento || today,
    formaPagamento: form.formaPagamento || "",
    parcelas: Number(form.parcelas) || 1,
    status,
    dataPagamento,
    vendedor: form.vendedor || "",
    observacoes: form.observacoes || "",
    origem: form.origem || "VENDA ONLINE",
  };

  const submit = async (data: PedidoFormData) => {
    if (!items.length) {
      setSuccess("");
      alert("Adicione pelo menos um item ao pedido antes de gerar o PDF.");
      return;
    }
    const finalPedido = { ...pedido, vencimento: data.vencimento, observacoes: data.observacoes };
    try {
      setIsGenerating(true);
      setSuccess("");
      await generatePedidoPdf(finalPedido, totals);
      setSuccess(`Pedido ${pedidoNumber} gerado e baixado com sucesso.`);
      setPedidoNumber(generatePedidoNumber());
      clearItems();
      reset({ ...defaultFormValues, vencimento: today });
    } catch (error) {
      console.error(error);
      setSuccess("");
      alert("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand"><div className="brand-mark">K</div><div><strong>KSA LACERDA</strong><span>Pedidos de Venda</span></div></div>
          <div className="order-chip"><span>Pedido atual</span><strong>#{pedidoNumber}</strong></div>
        </div>
      </header>

      <div className="page-container">
        <div className="hero">
          <div><span className="eyebrow">SISTEMA INTERNO</span><h1>Gerar Pedido de Venda</h1><p>Preencha os dados, confira a prévia e gere um PDF pronto para impressão ou envio.</p></div>
          <div className="hero-date"><span>Data do pedido</span><strong>{formatDateBR(today)}</strong><small>Pagamento: {formatDateBR(dataPagamento)} · venda paga</small></div>
        </div>

        <div className="mobile-tabs">
          <button className={activeTab === "cadastro" ? "active" : ""} onClick={() => setActiveTab("cadastro")}>Cadastro</button>
          <button className={activeTab === "preview" ? "active" : ""} onClick={() => setActiveTab("preview")}>Prévia do PDF</button>
        </div>

        <div className="workspace">
          <div className={`editor ${activeTab === "preview" ? "mobile-hidden" : ""}`}>
            <form onSubmit={handleSubmit(submit)} id="pedido-form">
              <ClienteForm register={register} setValue={setValue} errors={errors} />
              <EnderecoForm register={register} setValue={setValue} errors={errors} />

              <section className="form-section">
                <div className="section-heading"><span>03</span><div><h2>Itens do Pedido</h2><p>Adicione um ou mais produtos.</p></div></div>
                <ItemForm onAdd={addItem} />
                <ItensList items={items} onRemove={removeItem} />
              </section>

              <section className="form-section">
                <div className="section-heading"><span>04</span><div><h2>Pagamento e Informações</h2><p>Dados automáticos e complementares.</p></div></div>
                <div className="form-grid">
                  <label className="field"><span>Vencimento *</span><input {...register("vencimento")} type="date" />{errors.vencimento && <small>{errors.vencimento.message}</small>}</label>
                  <label className="field">
                    <span>Forma de Pagamento *</span>
                    <select {...register("formaPagamento")} defaultValue="">
                      <option value="" disabled>Selecione</option>
                      <option value="Pix">Pix</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Cartão de Crédito">Cartão de Crédito</option>
                      <option value="Cartão de Débito">Cartão de Débito</option>
                      <option value="Boleto">Boleto</option>
                    </select>
                    {errors.formaPagamento && <small>{errors.formaPagamento.message}</small>}
                  </label>
                  <label className="field">
                    <span>Parcelas *</span>
                    <input
                      {...register("parcelas", {
                        onChange: (e) => {
                          const digits = e.target.value.replace(/\D/g, "");
                          const clamped = digits ? String(Math.min(12, Math.max(1, Number(digits)))) : "";
                          setValue("parcelas", clamped, { shouldValidate: true });
                        },
                      })}
                      type="number"
                      min={1}
                      max={12}
                      step={1}
                      placeholder="1"
                    />
                    {errors.parcelas && <small>{errors.parcelas.message}</small>}
                  </label>
                  <label className="field">
                    <span>Origem *</span>
                    <select {...register("origem")} defaultValue="VENDA ONLINE">
                      <option value="VENDA ONLINE">Venda online</option>
                      <option value="VENDA PRESENCIAL">Venda presencial</option>
                    </select>
                    {errors.origem && <small>{errors.origem.message}</small>}
                  </label>
                  <label className="field"><span>Status</span><input value={status} readOnly /></label>
                  <label className="field"><span>Data de pagamento</span><input value={dataPagamento} readOnly /></label>
                  <label className="field"><span>Vendedor *</span><input {...register("vendedor")} placeholder="Nome do vendedor" />{errors.vendedor && <small>{errors.vendedor.message}</small>}</label>
                  <label className="field field-span-2"><span>Observações</span><textarea {...register("observacoes")} rows={3} placeholder="Opcional — aparecerá no PDF." />{errors.observacoes && <small>{errors.observacoes.message}</small>}</label>
                </div>
              </section>

              <div className="action-area">
                <Totais totals={totals} />
                <button className="button button-generate" type="submit" disabled={isGenerating}>
                  {isGenerating ? <><span className="spinner" /> Gerando PDF...</> : <>↓ &nbsp; GERAR PDF</>}
                </button>
                {success && <div className="success-message">✓ {success}</div>}
              </div>
            </form>
          </div>

          <aside className={`preview-panel ${activeTab === "cadastro" ? "mobile-hidden" : ""}`}>
            <div className="preview-heading"><div><span className="eyebrow">VISUALIZAÇÃO</span><h2>Prévia do documento</h2></div><span className="a4-badge">A4 · PDF</span></div>
            <PedidoPreview pedido={pedido} totals={totals} />
          </aside>
        </div>
      </div>
    </main>
  );
}
