import { useState, useContext } from "react";
import { AppContext } from "../../../context";
import { createProduct } from "../../../app.service";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./create_product.module.css";
import IProducts from "../../../models/products.model";
import { Dropdown } from "../../../components";

export default function CreateProduct() {
  const { userId } = useContext(AppContext);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [unitKg, setUnitKg] = useState(false);

  const goTo = (path: string) => {
    navigate(path);
  };
  const hSubmit = async (data: any) => {
    const newProduct: IProducts = data;
    newProduct.createdByUserId = userId;
    try {
      await createProduct(newProduct);
      goTo("/products");
    } catch (error) {
      console.log(error);
    }
  };

  const hSelection = (item: any) => {
    if (item.value === "Un") {
      setUnitKg(true);
    } else {
      setUnitKg(false);
    }
    setValue("unit", item.value);
  };

  return (
    <form onSubmit={handleSubmit(hSubmit)} className={styles.container}>
      <div className={styles.input}>
        <label>Name</label>
        <input {...register("name")} type="text" />
      </div>
      <div className={styles.input}>
        <label>Marca</label>
        <input
          {...register("badge")}
          placeholder="Ex: Coca-Cola, Nestlé, etc"
          type="text"
        />
      </div>
      <div className={styles.input}>
        <label>Preço</label>
        <input {...register("price")} placeholder="Ex: 1,99" type="text" />
      </div>
      <div className={styles.input}>
        <Dropdown
          hSelection={hSelection}
          title="Unidade de Medida"
          options={[
            { label: "Kg", value: "kg" },
            { label: "Unidade", value: "un" },
          ]}
        />
      </div>
      {unitKg && (
        <div className={styles.input}>
          <label>Tamanho</label>
          <input
            {...register("size")}
            placeholder="Ex: 100ml, 1L, 1kg, 400gr"
            type="text"
          />
        </div>
      )}
      <div className={styles.buttons}>
        <button onClick={() => goTo("/products")}>Cancelar</button>
        <button type="submit">Salvar</button>
      </div>
    </form>
  );
}
