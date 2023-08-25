import IProducts from "./products.model";

type PersonalInfo = {
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

type Items = {
  product: IProducts;
  qt: number;
};

type Cart = {
  status: string;
  items: Items[];
};

interface IBuyer extends Document {
  _id: string;
  name: string;
  email: string;
  password?: string;
  personalInfo?: PersonalInfo;
  cart?: Cart;
}

export default IBuyer;
