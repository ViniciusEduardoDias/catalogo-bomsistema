import styles from "./Sidebar.module.css";

const categorias = [
  {
    nome: "Componentes Sem Categoria",
    slug: "componentes-pulverizacao",
  },
  {
    nome: "Abraçadeiras Clampfix",
    slug: "abracadeiras",
  },
  {
    nome: "Agricultura de Precisão",
    slug: "agricultura-precisao",
  },
  {
    nome: "Controladores de Vazão",
    slug: "controladores",
  },
  {
    nome: "Monitores",
    slug: "monitores",
  },
  {
    nome: "Bombas",
    slug: "bombas",
  },
  {
    nome: "Bombas Centrífugas",
    slug: "bombas-centrifugas",
  },
  {
    nome: "Conexões QuickFit",
    slug: "quickfit",
  },
  {
    nome: "Porta-Bicos Proeco",
    slug: "portabicos",
  },
  {
    nome: "Reparos Bombas",
    slug: "reparo",
  },
];

function Sidebar({ categoriasSelecionadas, onAlterarCategoria }) {
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
