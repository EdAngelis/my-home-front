import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context";
import { useNavigate } from "react-router-dom";
import trashIcon from "../../assets/icons/trash-icon.svg";
import cartIcon from "../../assets/icons/cart-icon.svg";
import IProducts from "../../models/products.model";
import {
  getProducts,
  getBuyer,
  updateCart,
  deleteProduct,
} from "../../app.service";
import IBuyer from "../../models/buyer.model";
import "./products.css";
import Alert from "../../components/alert/alert";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProducts[]>([]);
  const [buyer, setBuyer] = useState<IBuyer>();
  const [alertOn, setAlertOn] = useState<boolean>(false);

  const [filteredProducts, setFilteredProducts] = useState<IProducts[]>([]);
  const { userId, setQtItemCart } = useContext(AppContext);
  useEffect(() => {
    loadProducts();
    userId !== "" && loadBuyer();
  }, []);

  const loadProducts = async () => {
    const response = await getProducts();
    setProducts(response);
    setFilteredProducts(response);
  };

  const loadBuyer = async () => {
    const response = await getBuyer(userId);
    const qtItems = response?.cart?.items?.length || 0;
    setQtItemCart(qtItems);
    await setBuyer(response);
  };

  const addItemToCart = async (product: IProducts) => {
    setAlertOn(true);

    if (buyer?.cart) {
      const hasProductInTheCart = buyer.cart.items.find((item) => {
        return item.product._id === product._id;
      });

      if (hasProductInTheCart) return;

      buyer.cart.items.push({ product, qt: 1 });

      try {
        const resp = await updateCart(buyer);
        const qtItems = resp.cart?.items?.length || 0;
        setQtItemCart(qtItems);
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
      <Alert alertOn={alertOn} setAlertOn={setAlertOn} />
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
            <div className="trash-icon-div">
              {product.createdByUserId === userId && (
                <img
                  src={trashIcon}
                  alt="delete"
                  onClick={() => deleteProd(product._id)}
                />
              )}
            </div>
            <div className="card-product">
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
