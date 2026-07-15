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
    <div className={style.container}>
      <h1>Produtos</h1>

      {produtos.map((produto) => (
        <ProductCard key={produto.id} produto={produto} />
      ))}
    </div>
  );
}

export default App;
