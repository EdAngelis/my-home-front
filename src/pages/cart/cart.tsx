import { useCallback, useEffect, useState, useContext } from "react";
import IBuyer from "../../models/buyer.model";
import IProducts from "../../models/products.model";
import { dim, plus } from "../../assets/icons/icons";
import { AppContext } from "../../context";
import "./cart.css";

import { getBuyer, updateCart, sendWhatsapp } from "../../app.service";
import InputButton from "../../components/input-button/input-button";
import Alert from "../../components/alert/alert";

export default function Cart() {
  const [buyer, setBuyer] = useState<IBuyer>();
  const [total, setTotal] = useState<string>("0.00");
  const [alertOn, setAlertOn] = useState<boolean>(false);

  const { userId, setQtItemCart } = useContext(AppContext);

  useEffect(() => {
    loadBuyer();
  }, []);

  const loadBuyer = async () => {
    const response = await getBuyer(userId);
    await setBuyer(response);
  };

  const handleTotal = useCallback(() => {
    let total = 0;
    if (!buyer?.cart) return;
    for (const item of buyer.cart.items) {
      total = total + item.qt * item.product.price;
      setTotal(total.toFixed(2));
    }
  }, [buyer?.cart]);

  useEffect(() => {
    handleTotal();
  }, [buyer?.cart?.items, handleTotal]);

  const editQuantity = async (product: IProducts, qt: number) => {
    if (buyer?.cart) {
      buyer.cart.items = buyer.cart.items.filter((item) => {
        if (item.product.name === product.name) {
          if (item.product.unit === "kg") qt = qt / 10;
          item.qt = item.qt + qt;
        }
        return item.qt > 0;
      });
      await hUpdateBuyer(buyer);
    }
  };

  const hCleanCart = async () => {
    if (buyer?.cart) {
      buyer.cart.items = [];
      await hUpdateBuyer(buyer);
      setTotal("0.00");
    }
  };

  const hUpdateBuyer = async (buyer: IBuyer) => {
    if (!buyer) return;
    try {
      const resp = await updateCart(buyer!);
      const qtItems = resp.cart?.items?.length || 0;
      setQtItemCart(qtItems);
      setBuyer(resp);
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  const onPhoneChange = async (e: any) => {
    if (e.length >= 10 && e.length <= 11) {
      buyer!.marketPhone = e;
      await hUpdateBuyer(buyer!);
      setAlertOn(true);
    }
  };

  return (
    <>
      <Alert alertOn={alertOn} setAlertOn={setAlertOn} />
      <div className="container-cart">
        <div className="top-cart">
          <span>Total: {total}</span>
          <InputButton
            type="number"
            label="Send"
            value="Send Order"
            onClick={() => (buyer ? sendWhatsapp(buyer) : null)}
            onInputChange={(e) => onPhoneChange(e)}
            placeholder={buyer?.marketPhone ? buyer.marketPhone : "Store Phone"}
          />
        </div>
        <div className="table-container">
          {buyer?.cart?.items
            ? buyer.cart.items.map((item, index) => (
                <div className="row-cart" key={index}>
                  <span> {item?.product?.name ?? "-"}</span>
                  <div
                    onClick={() => editQuantity(item.product, -1)}
                    className="img"
                  >
                    <img src={dim} alt="" />
                  </div>

                  <span>{item.qt.toFixed(1)}</span>
                  <div
                    onClick={() => editQuantity(item.product, 1)}
                    className="img"
                  >
                    <img src={plus} alt="" />
                  </div>
                </div>
              ))
            : null}
        </div>
        <button
          className="btn btn-clean"
          onClick={() => {
            hCleanCart();
          }}
        >
          Clean
        </button>
      </div>
    </>
  );
}
