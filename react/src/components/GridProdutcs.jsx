import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";

function ProductGrid({ produtos }) {
  return (
    <div className={styles.grid}>
      {produtos.map((produto) => (
        <ProductCard key={produto.id} produto={produto} />
      ))}
    </div>
  );
}

export default ProductGrid;
