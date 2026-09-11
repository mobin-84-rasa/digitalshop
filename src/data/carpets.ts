export type Carpet = {
  id: string;
  number: string;
  name: string;
  persianName: string;
  age: string;
  story: string;
  dimensions: string;
  material: string;
  density: string;
  origin: string;
  image: string;
  palette: "dark" | "sage" | "ivory";
  motif: string;
  craft: string;
  category: string;
  presentation: "chamber" | "hanging";
};

export const carpets: Carpet[] = [
  {
    id: "kerman-01",
    number: "II",
    name: "Garden of Kerman",
    persianName: "باغ کرمان",
    age: "c. 1920",
    story:
      "A lattice of blossoms on a madder field, the medallion opening like a sun over the workshops of old Kerman.",
    dimensions: "3.2 × 4.6 m",
    material: "Wool & silk",
    density: "≈ 450,000 knots/m²",
    origin: "Kerman, Iran",
    image: "/carpets/kerman-01.jpg",
    palette: "dark",
    motif: "Shah Abbasi medallion, floral arabesque",
    craft: "Handmade · knot by knot",
    category: "Kerman · Persian carpet",
    presentation: "hanging",
  },
  {
    id: "kerman-02",
    number: "III",
    name: "Tree of Life",
    persianName: "درخت زندگی",
    age: "c. 1940",
    story:
      "A single tree rises through an ivory mihrab, its branches a quiet prayer of continuity — woven as if the garden itself were still growing.",
    dimensions: "2.8 × 4.0 m",
    material: "Wool",
    density: "≈ 380,000 knots/m²",
    origin: "Kerman, Iran",
    image: "/carpets/kerman-02.jpg",
    palette: "sage",
    motif: "Derakht-e Zendegi · Tree of Life",
    craft: "Handmade · handcrafted pile",
    category: "Kerman · Persian carpet",
    presentation: "hanging",
  },
  {
    id: "kerman-03",
    number: "IV",
    name: "Madder Medallion",
    persianName: "ترنج لاکی",
    age: "c. 1955",
    story:
      "Deep lacquer red holds an ivory medallion — a night garden of palmettes, each knot a held breath of light.",
    dimensions: "3.0 × 4.4 m",
    material: "Wool & silk",
    density: "≈ 500,000 knots/m²",
    origin: "Kerman, Iran",
    image: "/carpets/kerman-03.jpg",
    palette: "dark",
    motif: "Central toranj, palmette field",
    craft: "Handmade · silk highlights",
    category: "Kerman · Persian carpet",
    presentation: "hanging",
  },
  {
    id: "kerman-04",
    number: "I",
    name: "Ivory Hall",
    persianName: "تالار عاج",
    age: "c. 1930",
    story:
      "An ivory field framed in cherry silk, hanging in the hush of an arched hall — the first work one meets after the door.",
    dimensions: "3.4 × 4.9 m",
    material: "Wool",
    density: "≈ 420,000 knots/m²",
    origin: "Kerman, Iran",
    image: "/carpets/kerman-04.jpg",
    palette: "ivory",
    motif: "Floral medallion, burgundy border",
    craft: "Handmade · handcrafted",
    category: "Kerman · Persian carpet",
    presentation: "chamber",
  },
];

export const featuredCarpetId = "kerman-04";

export const featuredCarpet =
  carpets.find((carpet) => carpet.id === featuredCarpetId) ?? carpets[0];

export const collectionCarpets = carpets.filter(
  (carpet) => carpet.id !== featuredCarpet.id,
);
