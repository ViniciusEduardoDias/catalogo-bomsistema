import styles from "./Sidebar.module.css";
import { useEffect, useState } from "react";

function Sidebar({ categoriasSelecionadas, onAlterarCategoria }) {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);

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

  return (
    <aside className={styles.sidebar}>
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
    </aside>
  );
}

export default Sidebar;
