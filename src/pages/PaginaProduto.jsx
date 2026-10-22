import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'
import { produtoDisponivelParaVenda, produtoEsgotado } from '../utils/carrinho'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagemEspera, setMensagemEspera] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = produtos
    .filter((item) => item.category === produto.category && item.id !== produto.id && !produtoEsgotado(item))
    .slice(0, 4)

  function enviarAviso(evento) {
    evento.preventDefault()

    if (!nome.trim() || !email.trim() || !onRegistrarEspera) {
      return
    }

    onRegistrarEspera(produto.id, { nome: nome.trim(), email: email.trim() })
    setNome('')
    setEmail('')
    setMensagemEspera('Você foi adicionado à lista de espera. Vamos avisar quando o produto voltar.')
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">R$ {produto.price.toFixed(2).replace('.', ',')}</p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">
            {produtoEsgotado(produto) ? 'Produto esgotado' : `${produto.estoque} unidades disponíveis`}
          </p>

          {!produtoEsgotado(produto) && (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={!produtoDisponivelParaVenda(produto)}
            >
              {produtoDisponivelParaVenda(produto) ? 'Adicionar ao carrinho' : 'Indisponível'}
            </button>
          )}

          {produtoEsgotado(produto) && (
            <form onSubmit={enviarAviso} className="lista-espera-form">
              <h3>Avise-me quando voltar</h3>
              <input
                type="text"
                value={nome}
                placeholder="Seu nome"
                onChange={(evento) => setNome(evento.target.value)}
              />
              <input
                type="email"
                value={email}
                placeholder="Seu e-mail"
                onChange={(evento) => setEmail(evento.target.value)}
              />
              <button type="submit" className="botao botao-grande">
                Quero receber aviso
              </button>
              {mensagemEspera && <p className="mensagem-cupom">{mensagemEspera}</p>}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}
