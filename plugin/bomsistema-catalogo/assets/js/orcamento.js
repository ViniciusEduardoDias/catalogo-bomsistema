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

  // Localiza o formulário do produto e sua variação selecionada.
  const formulario =
    botao.closest("form.variations_form") ||
    document.querySelector("form.variations_form");

  const campoVariacao = formulario?.querySelector('input[name="variation_id"]');

  const variacaoId = campoVariacao ? campoVariacao.value : "";

  // Captura a quantidade escolhida.
  const campoQuantidade =
    formulario?.querySelector('input[name="quantity"]') ||
    document.querySelector('input[name="quantity"]');

  const quantidade = Math.max(1, parseInt(campoQuantidade?.value, 10) || 1);

  // Impede adicionar um produto variável sem selecionar todas as opções.
  if (formulario && (!variacaoId || variacaoId === "0")) {
    alert(
      "Selecione todas as opções do produto antes de adicionar ao orçamento.",
    );
    return;
  }

  // Captura os atributos selecionados, como lado e tubulação.
  const atributos = {};

  if (formulario) {
    formulario
      .querySelectorAll('select[name^="attribute_"]')
      .forEach((campo) => {
        if (campo.value) {
          atributos[campo.name] =
            campo.options[campo.selectedIndex]?.text || campo.value;
        }
      });
  }

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

    // Obtém o SKU da variação a partir dos dados do formulário WooCommerce.
    let sku = produto.sku || produto.codigo || "";

    if (formulario && variacaoId) {
      try {
        const variacoes = JSON.parse(
          formulario.dataset.product_variations || "[]",
        );

        const variacao = variacoes.find(
          (item) => String(item.variation_id) === String(variacaoId),
        );

        if (variacao?.sku) {
          sku = variacao.sku;
        }
      } catch (erro) {
        console.warn("Não foi possível ler os dados das variações.", erro);
      }
    }

    let carrinho = [];

    try {
      carrinho = JSON.parse(
        localStorage.getItem("bomsistema_carrinho") || "[]",
      );

      if (!Array.isArray(carrinho)) {
        carrinho = [];
      }
    } catch (erro) {
      console.error("Erro ao ler carrinho:", erro);
      carrinho = [];
    }

    // Cada variação é um item independente no orçamento.
    const chaveVariacao = variacaoId || "";
    const produtoExistente = carrinho.find(
      (item) =>
        String(item.id) === String(produto.id) &&
        String(item.variation_id || "") === chaveVariacao,
    );

    if (produtoExistente) {
      produtoExistente.quantidade =
        (parseInt(produtoExistente.quantidade, 10) || 1) + quantidade;
    } else {
      carrinho.push({
        id: produto.id,
        variation_id: chaveVariacao || null,
        sku: sku,
        codigo: sku,
        atributos: atributos,
        nome: produto.nome,
        imagem: produto.imagem,
        url: produto.url,
        quantidade: quantidade,
      });
    }

    localStorage.setItem("bomsistema_carrinho", JSON.stringify(carrinho));

    window.location.href = "/orcamento/";
  } catch (erro) {
    console.error("Erro ao adicionar produto ao orçamento:", erro);
  }
});
