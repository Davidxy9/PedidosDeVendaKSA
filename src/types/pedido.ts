export interface PedidoItem {
  id: string;
  codigo: string;
  descricao: string;
  ncm: string;
  quantidade: number;
  valorUnitario: number;
}

export interface Cliente {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
}

export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Pedido {
  numero: string;
  cliente: Cliente;
  endereco: Endereco;
  itens: PedidoItem[];
  dataPedido: string;
  previsaoFaturamento: string;
  vencimento: string;
  formaPagamento: string;
  parcelas: number;
  status: string;
  dataPagamento: string;
  vendedor: string;
  observacoes: string;
  origem: string;
}

export interface PedidoTotals {
  subtotal: number;
  ipi: number;
  icmsSt: number;
  total: number;
}

export interface ItemFormData {
  codigo: string;
  descricao: string;
  ncm: string;
  quantidade: string;
  valorUnitario: string;
}

export interface PedidoFormData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  vencimento: string;
  formaPagamento: string;
  parcelas: string;
  origem: string;
  vendedor: string;
  observacoes: string;
}
