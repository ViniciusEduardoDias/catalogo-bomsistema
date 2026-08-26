import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Orcamento from "./Orcamento";

const pagina = document.getElementById("root").dataset.pagina;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {pagina === "orcamento" ? <Orcamento /> : <App />}
  </React.StrictMode>,
);
