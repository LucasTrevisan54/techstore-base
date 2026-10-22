import {
    calcularClientesEsperando,
    calcularLucroPotencialPorCategoria,
    calcularProdutosSemPreco,
    calcularValorEstoquePorCategoria,
    CATEGORIAS_LOJISTA,
    formatarNumero,
} from '../utils/lojista'

export default function PainelLojista({ produtos, listaEspera = {} }) {
    const valorEstoquePorCategoria = calcularValorEstoquePorCategoria(produtos)
    const lucroPotencialPorCategoria = calcularLucroPotencialPorCategoria(produtos)
    const produtosSemPreco = calcularProdutosSemPreco(produtos)
    const clientesEsperando = calcularClientesEsperando(listaEspera)
    const totalEstoque = valorEstoquePorCategoria.reduce((total, item) => total + item.valor, 0)

    return (
        <section className="painel-lojista">
            <p className="sobretitulo">Dashboard</p>
            <h1>Painel do lojista</h1>

            <div className="painel-kpis">
                <div className="painel-card">
                    <span className="painel-label">Valor em estoque</span>
                    <strong>R$ {formatarNumero(totalEstoque)}</strong>
                </div>
                <div className="painel-card">
                    <span className="painel-label">Produtos sem preço</span>
                    <strong>{produtosSemPreco.length}</strong>
                </div>
                <div className="painel-card">
                    <span className="painel-label">Clientes na fila</span>
                    <strong>{clientesEsperando}</strong>
                </div>
            </div>

            <div className="painel-grupo">
                <h2>Valor parado em estoque por categoria</h2>
                <div className="tabela-moldura">
                    <table className="tabela">
                        <thead>
                            <tr>
                                <th>Categoria</th>
                                <th>Valor em estoque</th>
                                <th>Unidades</th>
                            </tr>
                        </thead>
                        <tbody>
                            {CATEGORIAS_LOJISTA.map((categoria) => {
                                const item = valorEstoquePorCategoria.find((linha) => linha.categoria === categoria)

                                return (
                                    <tr key={categoria}>
                                        <td>{categoria}</td>
                                        <td>R$ {formatarNumero(item?.valor ?? 0)}</td>
                                        <td>{item?.quantidade ?? 0}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="painel-grupo">
                <h2>Lucro potencial estimado por categoria</h2>
                <div className="tabela-moldura">
                    <table className="tabela">
                        <thead>
                            <tr>
                                <th>Categoria</th>
                                <th>Lucro potencial</th>
                            </tr>
                        </thead>
                        <tbody>
                            {CATEGORIAS_LOJISTA.map((categoria) => {
                                const item = lucroPotencialPorCategoria.find((linha) => linha.categoria === categoria)

                                return (
                                    <tr key={categoria}>
                                        <td>{categoria}</td>
                                        <td>R$ {formatarNumero(item?.lucro ?? 0)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="painel-grupo painel-duplo">
                <div>
                    <h2>Produtos esperando a definição de preço</h2>
                    {produtosSemPreco.length === 0 ? (
                        <p className="estado-vazio compacta">Nenhum produto está parado sem preço.</p>
                    ) : (
                        <ul className="lista-simples">
                            {produtosSemPreco.map((produto) => (
                                <li key={produto.id}>
                                    {produto.title} <span>({produto.category})</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <h2>Quem está esperando a volta</h2>
                    {clientesEsperando === 0 ? (
                        <p className="estado-vazio compacta">Nenhum cliente está esperando retorno de um produto esgotado.</p>
                    ) : (
                        <ul className="lista-simples">
                            {Object.entries(listaEspera).flatMap(([produtoId, clientes]) =>
                                clientes.map((cliente, index) => {
                                    const produto = produtos.find((item) => item.id === produtoId)

                                    return (
                                        <li key={`${produtoId}-${cliente.email}-${index}`}>
                                            {produto?.title ?? 'Produto'} — {cliente.nome} ({cliente.email})
                                        </li>
                                    )
                                })
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    )
}
