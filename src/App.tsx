import { BrowserRouter } from 'react-router-dom';
import Menu from './components/menu/menu';
import Routes from './routes';

function App(){
    return (

        <BrowserRouter>
            <Menu />
            <Routes />
        </BrowserRouter>
    );
}

export default App;