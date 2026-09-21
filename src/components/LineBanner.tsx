"use client";

import * as React from "react";

export default function LineBanner(): React.JSX.Element {
  return (
    <div className="line-banner" aria-hidden="true">
      <img
        src="/assets/navunder.jpg"
        alt=""
        className="line-banner__img"
        draggable={false}
      />

      <style>{`
        .line-banner {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          overflow: hidden;
          background: #f3f5f1;
          padding: 0;
          margin: 0;
        }

        .line-banner__img {
          display: block;
          /* ✅ عرض — این عدد رو زیاد/کم کن */
          width: 100vw;
          max-width: 100%;
          height: clamp(2rem, 5vw, 4rem);
          object-fit: cover;
          object-position: center;
          user-select: none;
          pointer-events: none;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
