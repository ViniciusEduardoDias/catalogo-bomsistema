import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import style from "./style.module.css";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

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

  return (
    <div className={style.catalogo}>
      <h1 className={style.title}>Produtos</h1>
      <div className={style.layout}>
        {/* Sidebar - vamos desenvolver depois */}
        <aside className={style.sidebar}>
          <h2>Filtrar produtos</h2>
        </aside>

        {/* Produtos */}
        <section className={style.products}>
          <div className={style.grid}>
            {produtos.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
