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

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProducts[]>([]);
  const [buyer, setBuyer] = useState<IBuyer>();

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
    if (buyer?.cart) {
      buyer.cart.items.push({ product, qt: 1 });
      try {
        const resp = await updateCart(buyer);
        console.log(resp);
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
      <div className="container-products">
        <div className="top">
          <img src={homeIcon} alt="home" />
          <button onClick={() => goTo("/create-product")}>NEW PRODUCT</button>
          <img src={arrowIcon} alt="" onClick={() => goTo("/cart")} />
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
