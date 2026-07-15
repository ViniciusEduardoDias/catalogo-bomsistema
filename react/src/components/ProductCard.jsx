import style from "./ProductCard.module.css";

function ProductCard({ produto }) {
  return (
    <a href={produto.url} className={style.card}>
      <div className={style.imageContainer}>
        {produto.imagem && (
          <img src={produto.imagem} className={style.img} alt={produto.nome} />
        )}
      </div>

      <div className={style.content}>
        <h2 className={style.productTitle}>{produto.nome}</h2>

        <span className={style.button}>
          Veja detalhes
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}

export default ProductCard;
