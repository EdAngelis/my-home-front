import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context";
import Menu from "./components/menu/menu";
import styles from "./app.module.css";
import Routes from "./routes";

function App() {
  return (
    <div className={styles.container}>
      <AppProvider>
        <BrowserRouter>
          <Menu />
          <Routes />
        </BrowserRouter>
      </AppProvider>
    </div>
  );
}

export default App;
