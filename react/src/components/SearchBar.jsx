import styles from "./SearchBar.module.css";

function SearchBar({ valor, onAlterar }) {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        value={valor}
        onChange={(e) => onAlterar(e.target.value)}
        placeholder="Pesquisar produtos..."
      />
    </div>
  );
}

export default SearchBar;
