import { useCallback, useEffect, useState } from "react";
import IBuyer from "../../models/buyer.model";
import IProducts from "../../models/products.model";
import { dim, plus } from "../../assets/icons/icons";
import "./cart.css";

import { getBuyer, updateCart, sendWhatsapp } from "../../app.service";

export default function Cart() {
  const [buyer, setBuyer] = useState<IBuyer>();
  const [total, setTotal] = useState<string>("0.00");

  useEffect(() => {
    loadBuyer();
  }, []);

  const loadBuyer = async () => {
    const response = await getBuyer();
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
      try {
        const resp = await updateCart(buyer);
        await setBuyer(resp);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className="container">
        <div className="top">
          <span>Total: {total}</span>
          <button
            onClick={() => {
              buyer ? sendWhatsapp(buyer) : null;
            }}
          >
            Send Order
          </button>
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
      </div>
    </>
  );
}
