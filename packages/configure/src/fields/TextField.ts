import { makeField, setProp } from "../old/models/Field";

export const TextField = makeField((field) => {
  return (base, key) => setProp(base, key, { type: "string" });
});
