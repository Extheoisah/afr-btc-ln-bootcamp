import { Bootcamp } from "./bootcamp";

declare module "*.json" {
  const value: Bootcamp[];
  export default value;
} 