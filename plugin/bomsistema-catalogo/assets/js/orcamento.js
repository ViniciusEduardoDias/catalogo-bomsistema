document.addEventListener("click", function (event) {
  const botao = event.target.closest(".add-request-quote-button");

  if (!botao) {
    return;
  }

  event.preventDefault();

  const produtoId = botao.dataset.product_id;

  const campoQuantidade = document.querySelector('input[name="quantity"]');

  const quantidade = campoQuantidade
    ? parseInt(campoQuantidade.value, 10) || 1
    : 1;

  let orcamento = JSON.parse(
    localStorage.getItem("bomsistema_orcamento") || "[]",
  );

  const produtoExistente = orcamento.find(
    (produto) => produto.id === produtoId,
  );

  if (produtoExistente) {
    produtoExistente.quantidade += quantidade;
  } else {
    orcamento.push({
      id: produtoId,
      quantidade: quantidade,
    });
  }

  localStorage.setItem("bomsistema_orcamento", JSON.stringify(orcamento));

  console.log("Produto adicionado ao orçamento:", {
    id: produtoId,
    quantidade: quantidade,
  });
});
