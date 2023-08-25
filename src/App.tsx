import { Button, Grid, TextField } from "@mui/material";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AutoDeleteSharp from "@mui/icons-material/AutoDeleteSharp";
import IProducts from "./models/products.model";
import IBuyer from "./models/buyer.model";
import IDuties from "./models/duties.model";
import dateDifference from "./shared/dates-interval";
import {
  getProducts,
  getBuyer,
  updateCart,
  getDuties,
  updateDuty,
  sendWhatsapp,
} from "./app.service";
import "./App.css";
import { useCallback, useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState<IProducts[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProducts[]>([]);
  const [duties, setDuties] = useState<IDuties[]>([]);
  const [pendents, setPendents] = useState<IDuties[]>([]);
  const [buyer, setBuyer] = useState<IBuyer>();

  const [total, setTotal] = useState<string>("0.00");

  useEffect(() => {
    loadBuyer();
    loadProducts();
    loadDuties();
  }, []);

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

  const loadProducts = async () => {
    const response = await getProducts();
    setProducts(response.data);
    setFilteredProducts(response.data);
  };

  const loadDuties = async () => {
    const response = await getDuties();
    setDuties(response.data);
    handlePending(response.data);
  };

  const loadBuyer = async () => {
    const response = await getBuyer();
    await setBuyer(response);
  };

  const handlePending = useCallback((data: IDuties[]) => {
    const pendents = data.filter((duty) => {
      const dutyFrequency = duty.frequency;
      const lastDutyExecution = duty.history[0].date;
      const daysSinceLastExecution = lastDutyExecution
        ? dateDifference(new Date(), new Date(lastDutyExecution))
        : 199;

      if (daysSinceLastExecution > dutyFrequency) {
        return true;
      }
    });

    setPendents(pendents);
  }, []);

  const handleExecution = async (duty: IDuties) => {
    duty.history.unshift({ date: new Date() });
    try {
      await updateDuty(duty);
      await loadDuties();
    } catch (error) {
      console.log(error);
    }
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

  const handleFilter = (event: any) => {
    const value = event.target.value;
    const temp = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(temp);
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

  return (
    <>
      <Grid container>
        <Grid item className="products" xs={4}>
          <Grid container>
            <Grid container>
              <h1>Products</h1>
              <AddCircleIcon />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
                onChange={handleFilter}
              />
            </Grid>
            <Grid container>
              {filteredProducts.map((product, index) => (
                <Grid container className="table" key={index}>
                  <Grid item xs={10}>
                    <span> {product.name}</span>
                  </Grid>
                  <Grid item xs={2}>
                    <div
                      onClick={() => {
                        addItemToCart(product);
                      }}
                    >
                      <PlayCircleFilledIcon />
                    </div>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
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
        <Grid item className="duties" xs={4}>
          <Grid container>
            <h1>Duties</h1>
            <AddCircleIcon />
          </Grid>
          <Grid container>
            {pendents.map((duty, index) => (
              <Grid container className="table" key={index}>
                <Grid item xs={10}>
                  <span> {duty.name}</span>
                </Grid>
                <Grid item xs={2}>
                  <div
                    onClick={() => {
                      handleExecution(duty);
                    }}
                  >
                    <PlayCircleFilledIcon />
                  </div>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default App;
