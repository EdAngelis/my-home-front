import { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { AppContext } from "../../context";
import "./menu.css";

export default function Menu() {
  const { qtItemCart, userId } = useContext(AppContext);
  const [tabName, setTabName] = useState("Home");

  useEffect(() => {
    userId === "" ? setTabName("Home") : setTabName("Logout");
  }, [userId]);
  return (
    <div>
      <nav className="nav-bar">
        <Link className="li" to="">
          {tabName}
        </Link>
        <Link className="li" to="products">
          Products
        </Link>
        <div className="li li-cart">
          <div className="badge-cart">{qtItemCart}</div>
          <Link to="cart">Cart</Link>
        </div>
        {/* <Link className="li" to="duties">
          Duties
        </Link> */}
      </nav>
      <Outlet />
    </div>
  );
}
