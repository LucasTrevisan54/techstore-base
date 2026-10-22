export const CATEGORIAS_LOJISTA = ['roupas', 'eletronicos', 'acessorios', 'casa']

export function formatarNumero(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export function calcularValorEstoquePorCategoria(produtos) {
    return CATEGORIAS_LOJISTA.map((categoria) => {
        const itens = produtos.filter((produto) => produto.category === categoria)
        const valor = itens.reduce((total, produto) => {
            const preco = Number(produto.price)
            if (!Number.isFinite(preco)) {
                return total
            }

            return total + preco * Number(produto.estoque || 0)
        }, 0)

        return {
            categoria,
            valor,
            quantidade: itens.reduce((total, produto) => total + Number(produto.estoque || 0), 0),
        }
    })
}

export function calcularLucroPotencialPorCategoria(produtos) {
    return calcularValorEstoquePorCategoria(produtos).map((item) => ({
        ...item,
        lucro: item.valor,
    }))
}

export function produtoSemPreco(produto) {
    if (produto == null || produto.price == null) {
        return true
    }

    return !Number.isFinite(Number(produto.price))
}

export function calcularProdutosSemPreco(produtos) {
    return produtos.filter((produto) => produtoSemPreco(produto))
}

export function calcularClientesEsperando(listaEspera = {}) {
    return Object.values(listaEspera).reduce((total, clientes) => total + clientes.length, 0)
}
