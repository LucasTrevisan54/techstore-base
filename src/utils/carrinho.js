// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function produtoDisponivelParaVenda(produto) {
  if (produto == null || produto.price == null) {
    return false
  }

  const valor = Number(produto.price)
  return Number.isFinite(valor)
}

export function produtoEsgotado(produto) {
  return Number(produto?.estoque) === 0
}

export function filtrarProdutosDisponiveis(produtos) {
  return produtos.filter((produto) => !produtoEsgotado(produto))
}

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    if (!produtoDisponivelParaVenda(produto)) {
      return total
    }

    return total + Number(produto.price)
  }, 0)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
