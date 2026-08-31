// Não há backend, e o sistema pode ser usado por várias vendedoras em
// aparelhos diferentes ao mesmo tempo — por isso o número do pedido não é
// mais sequencial (isso exigiria um contador centralizado). Em vez disso,
// geramos um código curto e praticamente único a partir de um UUID real
// (4+ bilhões de combinações possíveis, risco de colisão é irrelevante
// para o volume de pedidos desse negócio).
export function generatePedidoNumber(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}
