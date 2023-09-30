import { useRoutes } from "react-router-dom";

import Products from "./pages/products/products";
import Cart from "./pages/cart/cart";
import Duties from "./pages/duties/duties";
import CreateProduct from "./pages/products/create/create_product";
export interface RouteObject {
  caseSensitive?: boolean;
  children?: RouteObject[];
  element?: React.ReactNode;
  index?: boolean;
  path?: string;
}
const routes = [
  {
    path: "/products",
    index: true,
    element: <Products />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/duties",
    element: <Duties />,
  },
  {
    path: "/create-product",
    element: <CreateProduct />,
  },
];

export default function Routes(): JSX.Element {
  const routing = useRoutes(routes);
  return <>{routing}</>;
}
