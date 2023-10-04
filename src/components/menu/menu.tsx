import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { AppContext } from "../../context";
import "./menu.css";

export default function Menu() {
  const { qtItemCart } = useContext(AppContext);
  return (
    <div>
      <nav className="nav-bar">
        <Link className="li" to="">
          Home
        </Link>
        <Link className="li" to="products">
          Products
        </Link>
        <div className="li li-cart">
          <div className="badge-cart">{qtItemCart}</div>
          <Link to="cart">Cart</Link>
        </div>
        <Link className="li" to="duties">
          Duties
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
