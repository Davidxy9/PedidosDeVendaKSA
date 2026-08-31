# Pedido de Venda — DB Outlet dos Móveis

Aplicação React + Vite + TypeScript para cadastrar pedidos de venda e gerar PDFs em formato A4, inspirado no modelo fornecido.

## Stack

- React + Vite + TypeScript
- React Hook Form + Zod
- @react-pdf/renderer
- UUID
- CSS responsivo
- useState + useReducer

## Executar

```bash
npm install
npm run dev
```

Depois acesse a URL exibida pelo Vite.

## Build de produção

```bash
npm run build
npm run preview
```

## Regras implementadas

- Pedido inicial `31806`; o próximo número é incrementado via `localStorage`.
- Data do pedido e previsão de faturamento começam com a data atual.
- Data de pagamento é preenchida automaticamente com a data atual, pois o pedido representa uma venda já paga.
- Vendedor inicial: `AMANDA`.
- IPI e ICMS ST são fixos em R$ 0,00.
- CPF, telefone e CEP possuem máscaras.
- Quantidade e valor unitário aceitam números positivos.
- O PDF é baixado automaticamente pelo navegador.
- Os dados do formulário não são persistidos; somente o contador do número do pedido é mantido localmente para permitir a sequência.

## Observação

O PDF reproduz a estrutura visual do documento enviado: cabeçalho com marca e dados da empresa, informações do cliente/endereço em duas colunas, tabela com faixa amarela, bloco de vencimento, totais e informações adicionais.
