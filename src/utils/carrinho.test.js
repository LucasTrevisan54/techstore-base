import test from 'node:test'
import assert from 'node:assert/strict'

import {
    calcularTotal,
    filtrarProdutosDisponiveis,
    produtoDisponivelParaVenda,
    produtoEsgotado,
} from './carrinho.js'
import { normalizarClienteId } from './clientes.js'
import { validarCupom } from './cupons.js'

test('calcularTotal soma corretamente os itens válidos do carrinho', () => {
    const carrinho = [
        { id: 'p1', price: 129.9 },
        { id: 'p2', price: 59.9 },
        { id: 'p3', price: 19.9 },
    ]

    assert.ok(Math.abs(calcularTotal(carrinho) - 209.7) < 0.0000001)
})

test('calcularTotal ignora produtos sem preço informado', () => {
    const carrinho = [
        { id: 'p1', price: 129.9 },
        { id: 'p2', price: null },
        { id: 'p3', price: undefined },
    ]

    assert.ok(Math.abs(calcularTotal(carrinho) - 129.9) < 0.0000001)
})

test('produtoDisponivelParaVenda retorna false para preços inexistentes', () => {
    assert.equal(produtoDisponivelParaVenda({ id: 'p1', price: null }), false)
    assert.equal(produtoDisponivelParaVenda({ id: 'p2', price: undefined }), false)
    assert.equal(produtoDisponivelParaVenda({ id: 'p3', price: Number.NaN }), false)
    assert.equal(produtoDisponivelParaVenda({ id: 'p4', price: 79.9 }), true)
})

test('produtoEsgotado e filtrarProdutosDisponiveis respeitam a regra de esgotados', () => {
    const produtos = [
        { id: 'p1', estoque: 0 },
        { id: 'p2', estoque: 2 },
        { id: 'p3', estoque: 5 },
    ]

    assert.equal(produtoEsgotado(produtos[0]), true)
    assert.equal(produtoEsgotado(produtos[1]), false)
    assert.deepEqual(
        filtrarProdutosDisponiveis(produtos).map((produto) => produto.id),
        ['p2', 'p3']
    )
})

test('PRIMEIRACOMPRA aplica 10% sobre o valor total da compra', () => {
    const resultado = validarCupom('PRIMEIRACOMPRA', { pedidosAnteriores: 0 })
    assert.deepEqual(resultado, { valido: true, desconto: 0.1 })

    const clienteRepetido = validarCupom('PRIMEIRACOMPRA', { pedidosAnteriores: 2 })
    assert.equal(clienteRepetido.valido, false)
})

test('normalizarClienteId converte valores vindos do select em número', () => {
    assert.equal(normalizarClienteId('1'), 1)
    assert.equal(normalizarClienteId(2), 2)
    assert.equal(normalizarClienteId('cliente-3'), null)
    assert.equal(normalizarClienteId(null), null)
})
