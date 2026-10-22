import test from 'node:test'
import assert from 'node:assert/strict'

import {
    calcularClientesEsperando,
    calcularProdutosSemPreco,
    calcularValorEstoquePorCategoria,
} from './lojista.js'

test('calcularValorEstoquePorCategoria soma o valor em estoque por categoria', () => {
    const produtos = [
        { category: 'roupas', price: 50, estoque: 2 },
        { category: 'roupas', price: 100, estoque: 1 },
        { category: 'eletronicos', price: 200, estoque: 3 },
        { category: 'acessorios', price: null, estoque: 5 },
    ]

    const resultado = calcularValorEstoquePorCategoria(produtos)

    assert.equal(resultado.find((linha) => linha.categoria === 'roupas')?.valor, 200)
    assert.equal(resultado.find((linha) => linha.categoria === 'eletronicos')?.valor, 600)
    assert.equal(resultado.find((linha) => linha.categoria === 'acessorios')?.valor, 0)
})

test('calcularProdutosSemPreco e calcularClientesEsperando refletem o painel', () => {
    const produtos = [
        { id: 'p1', title: 'A', price: null, category: 'roupas' },
        { id: 'p2', title: 'B', price: 40, category: 'casa' },
    ]

    const listaEspera = {
        p1: [{ nome: 'Ana', email: 'ana@teste.com' }, { nome: 'Bia', email: 'bia@teste.com' }],
        p2: [{ nome: 'Carlos', email: 'carlos@teste.com' }],
    }

    assert.equal(calcularProdutosSemPreco(produtos).length, 1)
    assert.equal(calcularClientesEsperando(listaEspera), 3)
})
