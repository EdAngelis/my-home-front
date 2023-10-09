import { useState, useContext, useEffect } from "react";
import { cpfValidator } from "../../components/validators";
import { getBuyerByCpf, createBuyer } from "../../app.service";
import { AppContext } from "../../context";
import { Loading } from "../../components";
import styles from "./home.module.css";
import { useNavigate } from "react-router-dom";
import IBuyer from "../../models/buyer.model";

export default function Home() {
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);

  let { setUserId } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    setUserId("");
  });

  const hLogin = async (event: any) => {
    const cpf: string = event.target.value;
    setCpf(cpf);
    if (cpfValidator(cpf)) {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.subContainer}>
          {loading ? (
            <Loading />
          ) : (
            <div className={styles.loginInput}>
              <label htmlFor="cpf">LOGIN</label>
              <input
                onChange={hLogin}
                value={cpf}
                placeholder="USE SEU CPF"
                type="number"
                name="cpf"
                id="cpf"
              />
              <span>Caso o cpf não exista uma nova conta será criada</span>
            </div>
          )}
        </div>
        <p>O intuito deste App é o envio de listas de compras pelo WhatsApp</p>
      </div>
    </>
  );
}
