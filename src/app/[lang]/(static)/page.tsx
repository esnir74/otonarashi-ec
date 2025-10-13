"use client";

import { useTranslations } from "next-intl";

export default function Page() {
  const tC = useTranslations("common");

  return (
    //
    <section >
      <div>
        <h1>{tC("brand")}</h1>
        <p>{tC("tagline")}</p>
      </div>
      <div>
        <a href="#products">
          <h3>Products</h3>
          <p>Unique upcycled items</p>
        </a>
        <a href="#artisans">
          <h3>Artisans</h3>
          <p>Welfare × Fashion</p>
        </a>
        <a href="#news">
          <h3>News</h3>
          <p>Events & collaborations</p>
        </a>
      </div>
    </section>
  );
}
