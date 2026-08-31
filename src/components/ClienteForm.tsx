import type { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import type { PedidoFormData } from "../types/pedido";
import { maskCPF, maskTelefone } from "../utils/mascaras";

interface Props {
  register: UseFormRegister<PedidoFormData>;
  setValue: UseFormSetValue<PedidoFormData>;
  errors: FieldErrors<PedidoFormData>;
}

export default function ClienteForm({ register, setValue, errors }: Props) {
  return (
    <section className="form-section">
      <div className="section-heading"><span>01</span><div><h2>Informações do Cliente</h2><p>Dados básicos do comprador.</p></div></div>
      <div className="form-grid">
        <label className="field field-span-2">
          <span>Nome completo *</span>
          <input {...register("nome")} placeholder="Ex.: Ingryd Kecia de Lima Alves" />
          {errors.nome && <small>{errors.nome.message}</small>}
        </label>
        <label className="field">
          <span>CPF *</span>
          <input {...register("cpf", { onChange: (e) => setValue("cpf", maskCPF(e.target.value)) })} inputMode="numeric" placeholder="000.000.000-00" />
          {errors.cpf && <small>{errors.cpf.message}</small>}
        </label>
        <label className="field">
          <span>Telefone *</span>
          <input {...register("telefone", { onChange: (e) => setValue("telefone", maskTelefone(e.target.value)) })} inputMode="tel" placeholder="(83) 99999-9999" />
          {errors.telefone && <small>{errors.telefone.message}</small>}
        </label>
        <label className="field field-span-2">
          <span>Email *</span>
          <input {...register("email")} type="email" placeholder="cliente@email.com" />
          {errors.email && <small>{errors.email.message}</small>}
        </label>
      </div>
    </section>
  );
}
