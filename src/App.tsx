import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context";
import Menu from "./components/menu/menu";
import Routes from "./routes";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Menu />
        <Routes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
