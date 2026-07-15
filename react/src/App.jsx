import { useEffect, useState } from "react";

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
    <div>
      <h1>Produtos</h1>

      {produtos.map((produto) => (
        <div key={produto.id}>
          {produto.imagem && (
            <img src={produto.imagem} alt={produto.nome} width="200" />
          )}

          <h2>{produto.nome}</h2>

          <a href={produto.url}>Ver produto</a>
        </div>
      ))}
    </div>
  );
}

export default App;
