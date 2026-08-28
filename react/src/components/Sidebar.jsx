import styles from "./Sidebar.module.css";
import { useEffect, useState } from "react";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

function Sidebar({ categoriasSelecionadas, onAlterarCategoria }) {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  useEffect(() => {
    fetch("/wp-json/bomsistema/v1/categorias")
      .then((response) => response.json())
      .then((data) => {
        setCategorias(
          data.filter(
            (categoria) => categoria.slug !== "componentes-pulverizacao",
          ),
        );
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar categorias:", error);
        setCarregando(false);
      });
  }, []);

  const categoriasSelecionadasInfo = categorias.filter((categoria) =>
    categoriasSelecionadas.includes(categoria.slug),
  );

  const categoriasVisiveis = categoriasSelecionadasInfo.slice(0, 2);
  const quantidadeRestante = categoriasSelecionadasInfo.length - 2;

  return (
    <aside className={styles.sidebar}>
      {/* DESKTOP */}
      <div className={styles.desktopFilter}>
        <h2>Filtrar produtos</h2>

        <div className={styles.categories}>
          {categorias.map((categoria) => (
            <label key={categoria.slug} className={styles.checkbox}>
              <input
                type="checkbox"
                value={categoria.slug}
                checked={categoriasSelecionadas.includes(categoria.slug)}
                onChange={() => onAlterarCategoria(categoria.slug)}
              />
              <span>{categoria.nome}</span>
            </label>
          ))}
        </div>
      </div>

      {/* MOBILE */}
      <div className={styles.mobileFilter}>
        <button
          type="button"
          className={styles.filterButton}
          onClick={() => setFiltrosAbertos(!filtrosAbertos)}
        >
          <span>FILTRAR PRODUTOS</span>
          {filtrosAbertos ? <IoIosArrowUp /> : <IoIosArrowDown />}

          {/*<span className={styles.arrow}></span>*/}
        </button>

        {/* FILTROS SELECIONADOS */}
        {categoriasSelecionadasInfo.length > 0 && (
          <div className={styles.selectedFilters}>
            {categoriasVisiveis.map((categoria) => (
              <button
                key={categoria.slug}
                type="button"
                className={styles.filterTag}
                onClick={() => onAlterarCategoria(categoria.slug)}
              >
                <span>{categoria.nome}</span>
                <span className={styles.removeFilter}>×</span>
              </button>
            ))}

            {quantidadeRestante > 0 && (
              <button
                type="button"
                className={styles.moreFilters}
                onClick={() => setFiltrosAbertos(true)}
              >
                mais {quantidadeRestante}
              </button>
            )}
          </div>
        )}

        {/* OPÇÕES DE FILTRO */}
        {filtrosAbertos && (
          <div className={styles.mobileCategories}>
            {categorias.map((categoria) => (
              <label key={categoria.slug} className={styles.checkbox}>
                <input
                  type="checkbox"
                  value={categoria.slug}
                  checked={categoriasSelecionadas.includes(categoria.slug)}
                  onChange={() => onAlterarCategoria(categoria.slug)}
                />

                <span>{categoria.nome}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
