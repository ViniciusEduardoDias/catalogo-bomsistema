import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import style from "./style.module.css";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [busca, setBusca] = useState("");

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

  let produtosFiltrados = produtos;

  // Se existe busca, filtra pelo nome
  if (busca.trim() !== "") {
    const termo = busca.toLowerCase().trim();

    produtosFiltrados = produtosFiltrados.filter((produto) =>
      produto.nome.toLowerCase().includes(termo),
    );
  }

  // Se existem categorias selecionadas, filtra por categoria
  if (categoriasSelecionadas.length > 0) {
    produtosFiltrados = produtosFiltrados.filter((produto) =>
      produto.categorias?.some((categoria) =>
        categoriasSelecionadas.includes(categoria.slug),
      ),
    );
  }

  // Se não existe busca nem categoria,
  // mostra somente os produtos em destaque
  if (busca.trim() === "" && categoriasSelecionadas.length === 0) {
    produtosFiltrados = produtos.filter((produto) => produto.destaque === true);

    produtosFiltrados.sort((a, b) => {
      const aBomba = a.categorias?.some(
        (categoria) => categoria.slug === "bombas",
      );

      const bBomba = b.categorias?.some(
        (categoria) => categoria.slug === "bombas",
      );

      return Number(bBomba) - Number(aBomba);
    });
  }

  // PAGINAÇÃO
  const indiceInicial = (paginaAtual - 1) * produtosPorPagina;
  const indiceFinal = indiceInicial + produtosPorPagina;

  const produtosDaPagina = produtosFiltrados.slice(indiceInicial, indiceFinal);

  const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);

  return (
    <div className={style.catalogo}>
      <SearchBar
        valor={busca}
        onAlterar={(valor) => {
          setBusca(valor);
          setPaginaAtual(1);

          if (valor.trim() !== "") {
            setCategoriasSelecionadas([]);
          }
        }}
      />
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
