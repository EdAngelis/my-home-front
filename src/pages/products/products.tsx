import { useState, useEffect } from "react";
import IProducts from "../../models/products.model";
import { getProducts, getBuyer, updateCart } from "../../app.service";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import IBuyer from "../../models/buyer.model";
import { Grid, TextField } from "@mui/material";
import "./products.css";

export default function Products (){

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

      const handleFilter = (event: any) => {
        const value = event.target.value;
        const temp = products.filter((product) =>
          product.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(temp);
      };

    return (
        <>
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
        </>
    );
}