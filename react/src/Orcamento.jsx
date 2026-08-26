import { useEffect, useState } from "react";
import styles from "./Orcamento.module.css";

const CART_STORAGE_KEY = "bomsistema_carrinho";

function Orcamento() {
  const [carrinho, setCarrinho] = useState([]);

  const [formulario, setFormulario] = useState({
    nome: "",
    empresa: "",
    documento: "",
    telefone: "",
    email: "",
    atividade: "",
  });

  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem(CART_STORAGE_KEY);

    if (carrinhoSalvo) {
      try {
        setCarrinho(JSON.parse(carrinhoSalvo));
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
      }
    }
  }, []);

  const salvarCarrinho = (novoCarrinho) => {
    setCarrinho(novoCarrinho);

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(novoCarrinho));
  };

  const aumentarQuantidade = (index) => {
    const novoCarrinho = [...carrinho];

    novoCarrinho[index] = {
      ...novoCarrinho[index],
      quantidade: (novoCarrinho[index].quantidade || 1) + 1,
    };

    salvarCarrinho(novoCarrinho);
  };

  const diminuirQuantidade = (index) => {
    const novoCarrinho = [...carrinho];

    const quantidadeAtual = novoCarrinho[index].quantidade || 1;

    if (quantidadeAtual <= 1) return;

    novoCarrinho[index] = {
      ...novoCarrinho[index],
      quantidade: quantidadeAtual - 1,
    };

    salvarCarrinho(novoCarrinho);
  };

  const removerProduto = (index) => {
    const novoCarrinho = carrinho.filter((_, i) => i !== index);

    salvarCarrinho(novoCarrinho);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (carrinho.length === 0) {
      alert("Adicione pelo menos um produto ao carrinho.");
      return;
    }

    const produtosTexto = carrinho
      .map((produto) => {
        const quantidade = produto.quantidade || 1;

        return `• ${produto.nome} — Qtd.: ${quantidade}`;
      })
      .join("\n");

    const mensagem = `Olá! Vim pelo site. Gostaria de solicitar um orçamento para os seguintes produtos:

${produtosTexto}

*Dados para contato:*

Nome: ${formulario.nome}
Empresa: ${formulario.empresa || "Não informado"}
CNPJ/CPF: ${formulario.documento || "Não informado"}
Telefone: ${formulario.telefone}
E-mail: ${formulario.email}
Atividade: ${formulario.atividade}`;

    const numeroWhatsApp = "5511940591019";

    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
      mensagem,
    )}`;

    window.open(urlWhatsApp, "_blank");
  };
  const voltarParaProdutos = () => {
    window.location.href = "/produtos/";
  };

  const getImagem = (produto) => {
    if (produto.imagem) return produto.imagem;

    if (produto.image) {
      if (typeof produto.image === "string") {
        return produto.image;
      }

      return produto.image.src || produto.image.url || "";
    }

    if (produto.images?.length) {
      return produto.images[0]?.src || "";
    }

    return "";
  };

  return (
    <div className={styles.orcamento}>
      <p className={styles.intro}>
        Nos envie um pedido de orçamento para nossa equipe te atender!
      </p>

      <div className={styles.layout}>
        {/* =========================
            CARRINHO
        ========================= */}

        <section className={styles.carrinhoSection}>
          <h2 className={styles.tituloSecao}>Meu carrinho</h2>

          {carrinho.length === 0 ? (
            <div className={styles.carrinhoVazio}>
              <p>Seu carrinho está vazio.</p>

              <button
                type="button"
                className={styles.botaoProdutos}
                onClick={voltarParaProdutos}
              >
                Escolher produtos
              </button>
            </div>
          ) : (
            <div className={styles.listaProdutos}>
              {carrinho.map((produto, index) => {
                const imagem = getImagem(produto);
                const quantidade = produto.quantidade || 1;

                return (
                  <article
                    className={styles.produto}
                    key={produto.id || produto.sku || index}
                  >
                    {/* IMAGEM */}

                    <div className={styles.produtoImagem}>
                      {imagem ? (
                        <img
                          src={imagem}
                          alt={produto.name || produto.nome || "Produto"}
                        />
                      ) : (
                        <div className={styles.semImagem}>Sem imagem</div>
                      )}
                    </div>

                    {/* INFORMAÇÕES */}

                    <div className={styles.produtoInformacoes}>
                      <h3 className={styles.produtoTitulo}>
                        {produto.name || produto.nome || "Produto"}
                      </h3>

                      <p className={styles.codigo}>
                        CÓDIGO: {produto.sku || produto.codigo || "—"}
                      </p>

                      <p className={styles.descricao}>
                        {produto.short_description ||
                          produto.description ||
                          produto.descricao ||
                          ""}
                      </p>

                      <div className={styles.quantidade}>
                        <span>Quantidade:</span>

                        <button
                          type="button"
                          className={styles.botaoQuantidade}
                          onClick={() => diminuirQuantidade(index)}
                          aria-label="Diminuir quantidade"
                        >
                          −
                        </button>

                        <span className={styles.numeroQuantidade}>
                          {quantidade}
                        </span>

                        <button
                          type="button"
                          className={styles.botaoQuantidade}
                          onClick={() => aumentarQuantidade(index)}
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* LIXEIRA */}

                    <button
                      type="button"
                      className={styles.botaoRemover}
                      onClick={() => removerProduto(index)}
                      aria-label="Remover produto"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 7H20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        <path
                          d="M10 11V17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        <path
                          d="M14 11V17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        <path
                          d="M6 7L7 20H17L18 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />

                        <path
                          d="M9 7V4H15V7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================
            FORMULÁRIO
        ========================= */}

        <section className={styles.formularioSection}>
          <h2 className={styles.tituloSecao}>Pedir orçamento</h2>

          <form className={styles.formulario} onSubmit={handleSubmit}>
            <div className={styles.campo}>
              <label htmlFor="nome">Nome:</label>

              <input
                id="nome"
                name="nome"
                type="text"
                placeholder="Seu nome aqui..."
                value={formulario.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="empresa">Empresa:</label>

              <input
                id="empresa"
                name="empresa"
                type="text"
                placeholder="Nome completo da empresa..."
                value={formulario.empresa}
                onChange={handleChange}
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="documento">CNPJ / CPF:</label>

              <input
                id="documento"
                name="documento"
                type="text"
                placeholder="CNPJ / CPF"
                value={formulario.documento}
                onChange={handleChange}
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="telefone">Telefone:</label>

              <input
                id="telefone"
                name="telefone"
                type="tel"
                placeholder="( )     -"
                value={formulario.telefone}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="email">E-mail:</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="E-mail para envio de orçamento..."
                value={formulario.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="atividade">O que você faz?</label>

              <select
                id="atividade"
                name="atividade"
                value={formulario.atividade}
                onChange={handleChange}
                required
              >
                <option value="">Selecione sua atividade</option>

                <option value="Agricultor">Agricultor</option>

                <option value="Usina">Usina</option>

                <option value="Revenda">Revenda</option>

                <option value="Fabricante de máquinas">
                  Fabricante de máquinas
                </option>

                <option value="Prestador de serviços">
                  Prestador de serviços
                </option>

                <option value="Indústria">Indústria</option>

                <option value="Outro">Outro</option>
              </select>
            </div>

            <button type="submit" className={styles.botaoEnviar}>
              Enviar pedido de orçamento
              <span>›</span>
            </button>

            <button
              type="button"
              className={styles.botaoEscolher}
              onClick={voltarParaProdutos}
            >
              Escolher mais produtos
            </button>
          </form>

          <div className={styles.informacoesSeguras}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 9H7V7C7 4.79 8.79 3 11 3H13C15.21 3 17 4.79 17 7V9ZM15 9V7C15 5.9 14.1 5 13 5H11C9.9 5 9 5.9 9 7V9H15ZM5 9H19C20.1 9 21 9.9 21 11V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V11C3 9.9 3.9 9 5 9Z" />
            </svg>
            INFORMAÇÕES SEGURAS
          </div>
        </section>
      </div>
    </div>
  );
}

export default Orcamento;
