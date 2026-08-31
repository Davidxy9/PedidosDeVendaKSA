import type { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import type { PedidoFormData } from "../types/pedido";
import { maskCEP } from "../utils/mascaras";

interface Props {
  register: UseFormRegister<PedidoFormData>;
  setValue: UseFormSetValue<PedidoFormData>;
  errors: FieldErrors<PedidoFormData>;
}

export default function EnderecoForm({ register, setValue, errors }: Props) {
  return (
    <section className="form-section">
      <div className="section-heading"><span>02</span><div><h2>Endereço de Entrega</h2><p>Localização completa do cliente.</p></div></div>
      <div className="form-grid">
        <label className="field field-span-2"><span>Rua *</span><input {...register("rua")} placeholder="Rua, avenida ou logradouro" />{errors.rua && <small>{errors.rua.message}</small>}</label>
        <label className="field"><span>Número *</span><input {...register("numero")} placeholder="108" />{errors.numero && <small>{errors.numero.message}</small>}</label>
        <label className="field"><span>Bairro *</span><input {...register("bairro")} placeholder="Bairro" />{errors.bairro && <small>{errors.bairro.message}</small>}</label>
        <label className="field"><span>Cidade *</span><input {...register("cidade")} placeholder="João Pessoa" />{errors.cidade && <small>{errors.cidade.message}</small>}</label>
        <label className="field"><span>Estado *</span><select {...register("estado")}><option value="">Selecione</option>{["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => <option key={uf} value={uf}>{uf}</option>)}</select>{errors.estado && <small>{errors.estado.message}</small>}</label>
        <label className="field"><span>CEP *</span><input {...register("cep", { onChange: (e) => setValue("cep", maskCEP(e.target.value)) })} inputMode="numeric" placeholder="58000-000" />{errors.cep && <small>{errors.cep.message}</small>}</label>
      </div>
    </section>
  );
}
