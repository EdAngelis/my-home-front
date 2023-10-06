import { useState, useContext, useEffect } from "react";
import { cpfValidator } from "../../components/validators";
import { getBuyerByCpf, createBuyer } from "../../app.service";
import { AppContext } from "../../context";

import "./home.css";
import { useNavigate } from "react-router-dom";
import IBuyer from "../../models/buyer.model";

export default function Home() {
  const [cpf, setCpf] = useState("");

  let { userId, setUserId } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    setUserId("");
  });

  const hLogin = async (event: any) => {
    const cpf: string = event.target.value;
    setCpf(cpf);
    if (cpfValidator(cpf)) {
      try {
        const resp = await getBuyerByCpf(cpf);
        const { message } = resp;

        if (message === "Buyer not found") {
          const newBuyer: IBuyer = { cpf };
          const resp = await createBuyer(newBuyer);
          resp.status === 200
            ? setUserId(resp.data.data._id)
            : console.log("Show Alerta");
        } else {
          setUserId(resp.data._id);
        }
        navigate("/products");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className="container-home">
        {userId === "" && (
          <div className="login-input">
            <label htmlFor="cpf">"LOGIN"</label>
            <input
              onChange={hLogin}
              value={cpf}
              placeholder="CPF"
              type="number"
              name="cpf"
              id="cpf"
            />
            <span>Caso o cpf nao exista uma nova conta será criada</span>
          </div>
        )}
      </div>
    </>
  );
}
