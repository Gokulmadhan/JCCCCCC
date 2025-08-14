import React from "react";

import Men from "./categories/Men/ActiveWear";
import Innerwear from "./categories/Men/InnerWear";
import Tops from "./categories/Men/Tops";
import Vests from "./categories/Men/Vests";
import Bottoms from "./categories/Men/Bottoms";

export default function App() {
  return (
    <>
      <Men />
      <Innerwear />
      <Tops />
      <Vests />
      <Bottoms />
    </>
  );
}
