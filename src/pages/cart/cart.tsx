import { useCallback, useEffect, useState } from "react";
import IBuyer from "../../models/buyer.model";
import IProducts from "../../models/products.model";
import AutoDeleteSharp from "@mui/icons-material/AutoDeleteSharp";
import { Button, Grid } from "@mui/material";
import "./cart.css";

import {
    getBuyer,
    updateCart,
    sendWhatsapp,
  } from "../../app.service";

export default function Cart(){

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

      const removeItemFromCart = async (product: IProducts) => {
        if (buyer?.cart) {
          buyer.cart.items = buyer.cart.items.filter(
            (item) => item.product.name !== product.name
          );
          try {
            const resp = await updateCart(buyer);
            await setBuyer(resp);
          } catch (error) {
            console.log(error);
          }
        }
      };

      const editQuantity = async (product: IProducts, qt: number) => {
        if (buyer?.cart) {
          buyer.cart.items = buyer.cart.items.map((item) => {
            if (item.product.name === product.name) {
              item.qt = qt;
            }
            return item;
          });
          try {
            const resp = await updateCart(buyer);
            console.log(resp);
            await setBuyer(resp);
          } catch (error) {
            console.log(error);
          }
        }
      };

    return(
        <>
        <Grid item className="buyer" xs={4}>
          <Grid>
            <h1>Buyer</h1>
          </Grid>
          <Grid container>
            {buyer?.cart?.items
              ? buyer.cart.items.map((item, index) => (
                  <Grid container className="table" key={index}>
                    <Grid item xs={2}>
                      <div
                        onClick={() => {
                          removeItemFromCart(item.product);
                        }}
                      >
                        <AutoDeleteSharp />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <span> {item?.product?.name ?? "-"}</span>
                    </Grid>
                    <Grid item xs={4}>
                      <input
                        type="number"
                        placeholder={item.qt.toString()}
                        onKeyDown={(event: any) => {
                          if (event.key === "Enter") {
                            editQuantity(item.product, event.target.value);
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                ))
              : null}
          </Grid>
          <Grid className="cart-foot" container>
            <span>Total: {total}</span>
            <Button
              variant="contained"
              onClick={() => {
                buyer ? sendWhatsapp(buyer) : null;
              }}
            >
              Send Order
            </Button>
          </Grid>
        </Grid>
        </>
    )
}