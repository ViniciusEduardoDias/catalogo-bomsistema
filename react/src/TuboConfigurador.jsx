import { useState } from "react";
import styles from "./TuboConfigurador.module.css";

function TuboConfigurador() {
  const [material, setMaterial] = useState("PP");
  const [diametro, setDiametro] = useState("33.4mm");
  const [espacamento, setEspacamento] = useState("500");
  const [customizacao, setCustomizacao] = useState("1x1");
  const [quantidade, setQuantidade] = useState("1");
  const [listaTubos, setListaTubos] = useState([]);
  const [mensagem, setMensagem] = useState("");

  const gerarCodigo = (mat, esp, config) => {
    const prefixo = "SPF-QF";

    if (["1", "2", "3", "4", "5", "6"].includes(config)) {
      const matCode = mat === "PP" ? "PS" : "P";
      return `${prefixo}-${matCode}-${esp}-${config}`;
    }

    const matCode = mat === "PP" ? "T" : "TS";
    return `${prefixo}-${matCode}-${esp}-${config}`;
  };

  const adicionarNaLista = (event) => {
    event.preventDefault();

    const quantidadeFinal = Math.max(1, parseInt(quantidade, 10) || 1);

    const codigo = gerarCodigo(material, espacamento, customizacao);

    const novoTubo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      tipo: "tubo-configurado",
      nome: "Tubo QuickFit configurado",
      codigo,
      material,
      diametro,
      espacamento,
      customizacao,
      quantidade: quantidadeFinal,
      imagem: "",
      url: "",
    };

    setListaTubos((listaAtual) => {
      const existente = listaAtual.find(
        (tubo) =>
          tubo.codigo === novoTubo.codigo &&
          tubo.material === novoTubo.material &&
          tubo.diametro === novoTubo.diametro &&
          tubo.espacamento === novoTubo.espacamento &&
          tubo.customizacao === novoTubo.customizacao,
      );

      if (existente) {
        return listaAtual.map((tubo) =>
          tubo.id === existente.id
            ? {
                ...tubo,
                quantidade: tubo.quantidade + quantidadeFinal,
              }
            : tubo,
        );
      }

      return [...listaAtual, novoTubo];
    });

    setMensagem("Configuração adicionada à sua lista.");

    // Prepara o formulário para uma nova configuração.
    setQuantidade("1");
  };

  const removerDaLista = (id) => {
    setListaTubos((listaAtual) => listaAtual.filter((tubo) => tubo.id !== id));

    setMensagem("Configuração removida da lista.");
  };

  const alterarQuantidade = (id, valor) => {
    const novaQuantidade = Math.max(1, parseInt(valor, 10) || 1);

    setListaTubos((listaAtual) =>
      listaAtual.map((tubo) =>
        tubo.id === id ? { ...tubo, quantidade: novaQuantidade } : tubo,
      ),
    );
  };

  const adicionarAoOrcamento = () => {
    if (listaTubos.length === 0) {
      setMensagem("Adicione pelo menos uma configuração à lista.");
      return;
    }

    let carrinho = [];

    try {
      carrinho = JSON.parse(
        localStorage.getItem("bomsistema_carrinho") || "[]",
      );

      if (!Array.isArray(carrinho)) {
        carrinho = [];
      }
    } catch (error) {
      console.error("Erro ao carregar orçamento:", error);
      setMensagem("Não foi possível carregar o orçamento. Tente novamente.");
      return;
    }

    // Mantém os produtos que já estavam no orçamento.
    const carrinhoAtualizado = [...carrinho];

    listaTubos.forEach((tubo) => {
      const produtoExistente = carrinhoAtualizado.find(
        (produto) =>
          produto.tipo === "tubo-configurado" &&
          produto.codigo === tubo.codigo &&
          produto.material === tubo.material &&
          produto.diametro === tubo.diametro &&
          produto.espacamento === tubo.espacamento &&
          produto.customizacao === tubo.customizacao,
      );

      if (produtoExistente) {
        produtoExistente.quantidade =
          (Number(produtoExistente.quantidade) || 0) + tubo.quantidade;
      } else {
        carrinhoAtualizado.push({
          ...tubo,
          id: `tubo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        });
      }
    });

    try {
      localStorage.setItem(
        "bomsistema_carrinho",
        JSON.stringify(carrinhoAtualizado),
      );

      window.location.href = "/orcamento/";
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error);
      setMensagem(
        "Não foi possível salvar os itens. Verifique o navegador e tente novamente.",
      );
    }
  };

  const codigoAtual = gerarCodigo(material, espacamento, customizacao);

  const totalUnidades = listaTubos.reduce(
    (total, tubo) => total + tubo.quantidade,
    0,
  );

  return (
    <section className={styles.configurador}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Monte sua configuração</h2>
          <p>
            Configure seus tubos, escolha mais opções e confira sua lista antes
            de enviar tudo para o orçamento.
          </p>
        </div>

        <form className={styles.form} onSubmit={adicionarNaLista}>
          <div className={styles.field}>
            <label htmlFor="material">Material</label>
            <select
              id="material"
              value={material}
              onChange={(event) => setMaterial(event.target.value)}
            >
              <option value="PP">Polipropileno (PP)</option>
              <option value="INOX">Inox</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="diametro">Diâmetro</label>
            <select
              id="diametro"
              value={diametro}
              onChange={(event) => setDiametro(event.target.value)}
            >
              <option value="33.4mm">33,4 mm</option>
              <option value="25mm">25 mm</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="espacamento">Espaçamento</label>
            <select
              id="espacamento"
              value={espacamento}
              onChange={(event) => setEspacamento(event.target.value)}
            >
              <option value="500">500 mm</option>
              <option value="508">508 mm</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="customizacao">Configuração</label>
            <select
              id="customizacao"
              value={customizacao}
              onChange={(event) => setCustomizacao(event.target.value)}
            >
              <optgroup label="Barras duplas">
                <option value="1x1">1x1</option>
                <option value="1x2">1x2</option>
                <option value="1x3">1x3</option>
                <option value="1x4">1x4</option>
                <option value="1x5">1x5</option>
                <option value="1x6">1x6</option>
                <option value="2x2">2x2</option>
                <option value="2x3">2x3</option>
                <option value="2x4">2x4</option>
                <option value="2x5">2x5</option>
                <option value="2x6">2x6</option>
                <option value="3x3">3x3</option>
                <option value="3x4">3x4</option>
                <option value="3x5">3x5</option>
                <option value="3x6">3x6</option>
                <option value="4x4">4x4</option>
                <option value="4x5">4x5</option>
                <option value="4x6">4x6</option>
                <option value="5x5">5x5</option>
                <option value="5x6">5x6</option>
                <option value="6x6">6x6</option>
              </optgroup>

              <optgroup label="Ponteiras">
                <option value="1">1 ponteira</option>
                <option value="2">2 ponteiras</option>
                <option value="3">3 ponteiras</option>
                <option value="4">4 ponteiras</option>
                <option value="5">5 ponteiras</option>
                <option value="6">6 ponteiras</option>
              </optgroup>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="quantidade">Quantidade</label>
            <input
              id="quantidade"
              type="number"
              min="1"
              step="1"
              value={quantidade}
              onChange={(event) => setQuantidade(event.target.value)}
            />
          </div>
          <div>
            <div className={styles.resumo}>
              <span>Configuração:</span>
              <strong>
                {material} · {diametro} · {espacamento} mm · {customizacao}
              </strong>

              <span>Código:</span>
              <strong>{codigoAtual}</strong>
            </div>

            <button type="submit" className={styles.botaoSecundario}>
              Adicionar
            </button>
          </div>
        </form>

        {mensagem && (
          <p className={styles.mensagem} role="status">
            {mensagem}
          </p>
        )}

        <div className={styles.lista}>
          <div className={styles.listaHeader}>
            <div>
              <h3>Seus tubos configurados</h3>
              <p>
                {listaTubos.length} configuração(ões) · {totalUnidades}{" "}
                unidade(s)
              </p>
            </div>
          </div>

          {listaTubos.length === 0 ? (
            <div className={styles.listaVazia}>
              <p>
                Nenhum tubo adicionado ainda. Configure acima e clique em
                “Escolher mais”.
              </p>
            </div>
          ) : (
            <div className={styles.itens}>
              {listaTubos.map((tubo, indice) => (
                <article className={styles.item} key={tubo.id}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemNumero}>Item {indice + 1}</span>

                    <strong className={styles.itemCodigo}>{tubo.codigo}</strong>

                    <p>
                      {tubo.material === "PP" ? "Polipropileno (PP)" : "Inox"} ·{" "}
                      {tubo.diametro} · {tubo.espacamento} mm
                    </p>

                    <p>
                      Configuração:{" "}
                      {["1", "2", "3", "4", "5", "6"].includes(
                        tubo.customizacao,
                      )
                        ? `${tubo.customizacao} ponteira(s)`
                        : `Barras duplas ${tubo.customizacao}`}
                    </p>
                  </div>

                  <div className={styles.itemAcoes}>
                    <label htmlFor={`qtd-${tubo.id}`}>Quantidade</label>
                    <input
                      id={`qtd-${tubo.id}`}
                      type="number"
                      min="1"
                      step="1"
                      value={tubo.quantidade}
                      onChange={(event) =>
                        alterarQuantidade(tubo.id, event.target.value)
                      }
                    />

                    <button
                      type="button"
                      className={styles.remover}
                      onClick={() => removerDaLista(tubo.id)}
                      aria-label={`Remover item ${indice + 1}`}
                    >
                      Remover
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <button
            type="button"
            className={styles.botao}
            onClick={adicionarAoOrcamento}
            disabled={listaTubos.length === 0}
          >
            Adicionar lista ao orçamento ({listaTubos.length})
          </button>
        </div>
      </div>
    </section>
  );
}

export default TuboConfigurador;
