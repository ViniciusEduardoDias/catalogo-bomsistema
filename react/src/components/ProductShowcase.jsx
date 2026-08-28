import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import styles from "./ProductShowcase.module.css";

import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

function ProductShowcase({ categoria, modo = "grid" }) {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  const carouselRef = useRef(null);

  useEffect(() => {
    setCarregando(true);
    setErro(false);

    fetch("/wp-json/bomsistema/v1/produtos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar produtos");
        }

        return response.json();
      })
      .then((data) => {
        console.log("PRODUTOS RECEBIDOS:", data);

        let produtosFiltrados;

        if (categoria) {
          produtosFiltrados = data.filter((produto) =>
            produto.categorias?.some(
              (categoriaProduto) => categoriaProduto.slug === categoria,
            ),
          );
        } else {
          produtosFiltrados = data.filter(
            (produto) => produto.destaque === true,
          );
          produtosFiltrados.sort((a, b) => {
            const aBomba = a.categorias?.some(
              (categoriaProduto) => categoriaProduto.slug === "bombas",
            );

            const bBomba = b.categorias?.some(
              (categoriaProduto) => categoriaProduto.slug === "bombas",
            );

            if (aBomba && !bBomba) return -1;
            if (!aBomba && bBomba) return 1;

            return 0;
          });
        }

        console.log("CATEGORIA:", categoria);
        console.log("PRODUTOS FILTRADOS:", produtosFiltrados);

        setProdutos(produtosFiltrados);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar produtos:", error);
        setErro(true);
        setCarregando(false);
      });
  }, [categoria]);

  const moverCarrossel = (direcao) => {
    if (!carouselRef.current) return;

    const largura = carouselRef.current.clientWidth;

    carouselRef.current.scrollBy({
      left: direcao * largura,
      behavior: "smooth",
    });
  };

  if (carregando) {
    return <div className={styles.loading}>Carregando produtos...</div>;
  }

  if (erro) {
    return (
      <div className={styles.error}>Não foi possível carregar os produtos.</div>
    );
  }

  if (produtos.length === 0) {
    return null;
  }

  return (
    <section className={styles.showcase}>
      {modo === "carousel" ? (
        <div className={styles.carouselWrapper}>
          <button
            type="button"
            className={`${styles.carouselButton} ${styles.previous}`}
            onClick={() => moverCarrossel(-1)}
            aria-label="Produtos anteriores"
          >
            <IoIosArrowBack size="24" />
          </button>

          <div ref={carouselRef} className={styles.carousel}>
            {produtos.map((produto) => (
              <div key={produto.id} className={styles.carouselItem}>
                <ProductCard produto={produto} />
              </div>
            ))}
          </div>

          <button
            type="button"
            className={`${styles.carouselButton} ${styles.next}`}
            onClick={() => moverCarrossel(1)}
            aria-label="Próximos produtos"
          >
            <IoIosArrowForward size="24" />
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {produtos.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductShowcase;
