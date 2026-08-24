import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import style from "./style.module.css";
import Sidebar from "./components/Sidebar";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);

  const produtosPorPagina = 12;

  const alterarCategoria = (slug) => {
    setCategoriasSelecionadas((categoriasAtuais) => {
      if (categoriasAtuais.includes(slug)) {
        return categoriasAtuais.filter((categoria) => categoria !== slug);
      }

      return [...categoriasAtuais, slug];
    });

    setPaginaAtual(1);
  };

  useEffect(() => {
    fetch("/wp-json/bomsistema/v1/produtos")
      .then((response) => response.json())
      .then((data) => {
        setProdutos(data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar produtos:", error);
        setCarregando(false);
      });
  }, []);

  if (carregando) {
    return <p>Carregando produtos...</p>;
  }

  // PAGINAÇÃO
  const indiceInicial = (paginaAtual - 1) * produtosPorPagina;
  const indiceFinal = indiceInicial + produtosPorPagina;

  const produtosDaPagina = produtos.slice(indiceInicial, indiceFinal);

  const totalPaginas = Math.ceil(produtos.length / produtosPorPagina);

  return (
    <div className={style.catalogo}>
      <h1 className={style.title}>Produtos</h1>
      <div>
        <div className={style.layout}>
          <Sidebar
            categoriasSelecionadas={categoriasSelecionadas}
            onAlterarCategoria={alterarCategoria}
          />

          {/* PRODUTOS */}
          <section className={style.products}>
            <div className={style.grid}>
              {produtosDaPagina.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          </section>
        </div>
      </div>
      {/* PAGINAÇÃO */}
      <div className={style.pagination}>
        <button
          disabled={paginaAtual === 1}
          onClick={() => setPaginaAtual(paginaAtual - 1)}
        >
          ←
        </button>

        {Array.from({ length: totalPaginas }, (_, index) => index + 1).map(
          (numeroPagina) => (
            <button
              key={numeroPagina}
              className={paginaAtual === numeroPagina ? style.activePage : ""}
              onClick={() => setPaginaAtual(numeroPagina)}
            >
              {numeroPagina}
            </button>
          ),
        )}

        <button
          disabled={paginaAtual === totalPaginas}
          onClick={() => setPaginaAtual(paginaAtual + 1)}
        >
          →
        </button>
      </div>
    </div>
  );
}

export default App;
