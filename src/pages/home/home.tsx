import { useState } from "react";

import "./home.css";
import { getBuyer } from "../../app.service";

export default function Home() {
  const [pin, setPin] = useState("");

  const hLogin = (event: any) => {
    const pinEvent = event.target.value;
    if (pinEvent.length <= 6) {
      setPin(pinEvent);
      if (pinEvent.length === 6) getBuyer(pinEvent);
    }
  };

  return (
    <>
      <div className="container-home">
        <div className="login-input">
          <label htmlFor="pin">Login</label>
          <input
            onChange={hLogin}
            value={pin}
            placeholder="Pin de 6 digitos"
            type="number"
            name="pin"
            id="pin"
          />
          <span>Caso o pin nao exista uma nova conta será criada</span>
        </div>
      </div>
    </>
  );
}
