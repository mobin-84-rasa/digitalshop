"use client";

import * as React from "react";
import "@/styles/line-banner.css";

/** Floral rule that sits stationary between sections. */
export default function LineBanner(): React.JSX.Element {
  return (
    <div className="line-banner" aria-hidden="true">
      <div className="line-banner__track">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/navunder.jpg"
          alt=""
          className="line-banner__img"
          draggable={false}
        />
      </div>
    </div>
  );
}
