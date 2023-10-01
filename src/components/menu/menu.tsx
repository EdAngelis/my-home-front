import { Link, Outlet } from "react-router-dom";
import "./menu.css";

export default function Menu() {
  return (
    <div>
      <nav className="nav-bar">
        <Link className="li" to="products">
          Products
        </Link>
        <Link className="li" to="cart">
          Cart
        </Link>
        <Link className="li" to="duties">
          Duties
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
