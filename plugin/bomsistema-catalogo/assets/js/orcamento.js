document.addEventListener("click", async function (event) {
  const botao = event.target.closest(".add-request-quote-button");

  if (!botao) {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();

  const produtoId = botao.dataset.product_id;

  if (!produtoId) {
    console.error("ID do produto não encontrado.");
    return;
  }

  const campoQuantidade = document.querySelector('input[name="quantity"]');

  const quantidade = campoQuantidade
    ? parseInt(campoQuantidade.value, 10) || 1
    : 1;

  try {
    const resposta = await fetch("/wp-json/bomsistema/v1/produtos");

    if (!resposta.ok) {
      throw new Error("Erro ao consultar produtos.");
    }

    const produtos = await resposta.json();

    const produto = produtos.find(
      (item) => String(item.id) === String(produtoId),
    );

    if (!produto) {
      console.error("Produto não encontrado na API.");
      return;
    }

    let carrinho = [];

    try {
      carrinho = JSON.parse(
        localStorage.getItem("bomsistema_carrinho") || "[]",
      );
    } catch (error) {
      console.error("Erro ao ler carrinho:", error);
      carrinho = [];
    }

    const produtoExistente = carrinho.find(
      (item) => String(item.id) === String(produto.id),
    );

    if (produtoExistente) {
      produtoExistente.quantidade =
        (produtoExistente.quantidade || 1) + quantidade;
    } else {
      carrinho.push({
        id: produto.id,
        nome: produto.nome,
        imagem: produto.imagem,
        url: produto.url,
        quantidade: quantidade,
      });
    }

    localStorage.setItem("bomsistema_carrinho", JSON.stringify(carrinho));

    window.location.href = "/orcamento/";
  } catch (error) {
    console.error("Erro ao adicionar produto ao orçamento:", error);
  }
});
