import { Link, Outlet } from 'react-router-dom';
import './menu.css';

export default function Menu() {
    return (
        <div>
            <nav className='nav-bar'>
                <Link to="products">Products</Link>
                <Link to="cart">Cart</Link>
                <Link to="duties">Duties</Link>
            </nav>
            <Outlet />
        </div>
    )
}