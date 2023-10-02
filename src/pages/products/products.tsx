import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import trashIcon from "../../assets/icons/trash-icon.svg";
import cartIcon from "../../assets/icons/cart-icon.svg";
import homeIcon from "../../assets/icons/home-icon.svg";
import IProducts from "../../models/products.model";
import arrowIcon from "../../assets/icons/arrow-icon.png";
import {
  getProducts,
  getBuyer,
  updateCart,
  deleteProduct,
} from "../../app.service";
import IBuyer from "../../models/buyer.model";
import "./products.css";
import { set } from "react-hook-form";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProducts[]>([]);
  const [buyer, setBuyer] = useState<IBuyer>();
  const [alertOn, setAlertOn] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<IProducts[]>([]);

  useEffect(() => {
    loadProducts();
    loadBuyer();
  }, []);

  const loadProducts = async () => {
    const response = await getProducts();
    setProducts(response.data);
    setFilteredProducts(response.data);
  };

  const loadBuyer = async () => {
    const response = await getBuyer();
    await setBuyer(response);
  };

  const addItemToCart = async (product: IProducts) => {
    setAlertOn(true);
    setTimeout(() => {
      setAlertOn(false);
    }, 500);
    if (buyer?.cart) {
      const hasProductInTheCart = buyer.cart.items.find((item) => {
        return item.product._id === product._id;
      });

      if (hasProductInTheCart) return;

      buyer.cart.items.push({ product, qt: 1 });

      try {
        const resp = await updateCart(buyer);
        await setBuyer(resp);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteProd = async (id: string) => {
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = (event: any) => {
    const value = event.target.value;
    const temp = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(temp);
  };

  const goTo = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <div className={`alert ${alertOn && "trigger-alert"}`}></div>
      <div className="container-products">
        <div className="top">
          <button className="btn" onClick={() => goTo("/create-product")}>
            NEW PRODUCT
          </button>
        </div>

        <div className="filter">
          <input
            placeholder="filter by name"
            type="text"
            onChange={(event) => handleFilter(event)}
          />
        </div>
        {filteredProducts.map((product, index) => (
          <div className="row" key={index}>
            <img
              className=""
              src={trashIcon}
              alt="delete"
              onClick={() => deleteProd(product._id)}
            />
            <div>
              <span className="product">{product.name}</span>
              <span className="badge">{product.badge}</span>
              <span className="price">{product.price}</span>
            </div>
            <img
              className="cart-icon"
              src={cartIcon}
              alt="cart"
              onClick={() => addItemToCart(product)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
