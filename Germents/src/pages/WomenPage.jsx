import React from "react";

import Women from "./categories/Women/ActiveWear";
import Innerwear from "./categories/Women/InnerWear";
import Tops from "./categories/Women/Tops";
import Vests from "./categories/Women/Vests";
import Bottoms from "./categories/Women/Bottoms";

export default function App() {
  return (
    <>
      <Women />
      <Innerwear />
      <Tops />
      <Vests />
      <Bottoms />
    </>
  );
}
