import { createProduct } from "../../../app.service";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./create_product.css";
import IProducts from "../../../models/products.model";

export default function CreateProduct() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<IProducts>();

  const goTo = (path: string) => {
    navigate(path);
  };
  const hSubmit = async (data: IProducts) => {
    try {
      await createProduct(data);
      goTo("/products");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(hSubmit)} className="container">
      <div className="input">
        <label>Name</label>
        <input {...register("name")} type="text" />
      </div>
      <div className="input">
        <label>Marca</label>
        <input
          {...register("badge")}
          placeholder="Ex: Coca-Cola, Nestlé, etc"
          type="text"
        />
      </div>
      <div className="input">
        <label>Preço</label>
        <input {...register("price")} placeholder="Ex: 1,99" type="text" />
      </div>
      <div className="input">
        <label>Unidade de Medida</label>
        <input
          {...register("unit")}
          placeholder="Ex: Litro, Kq, Un, Lata"
          type="text"
        />
      </div>
      <div className="input">
        <label>Tamanho</label>
        <input
          {...register("size")}
          placeholder="Ex: 100ml, 1L, 1kg, 1un"
          type="text"
        />
      </div>
      <div className="buttons">
        <button onClick={() => goTo("/products")}>Cancelar</button>
        <button type="submit">Salvar</button>
      </div>
    </form>
  );
}
