export type Carpet = {
  id: number;
  number: string;
  name: string;
  image: string;
  description: string;
  origin: string;
  technique: string;
  pattern: string;
};

/** Replace images / names / metadata here only. */
export const carpets: Carpet[] = [
  {
    id: 1,
    number: "۰۱",
    name: "باغ ایرانی",
    image: "/images/carpet-01.jpg",
    description:
      "روایتی از باغ‌های ایرانی؛ جایی که نظم هندسی با لطافت طبیعت در هم می‌آمیزد.",
    origin: "کرمان",
    technique: "دستباف",
    pattern: "نقش باغ",
  },
  {
    id: 2,
    number: "۰۲",
    name: "ترنج جاودان",
    image: "/images/carpet-02.jpg",
    description:
      "ترنجی که در مرکز می‌نشیند و نگاه را در میان ظرافت نقش‌های اصیل ایرانی به گردش درمی‌آورد.",
    origin: "کرمان",
    technique: "دستباف",
    pattern: "نقش ترنج",
  },
  {
    id: 3,
    number: "۰۳",
    name: "بته ماندگار",
    image: "/images/carpet-03.jpg",
    description:
      "نقشی آشنا از حافظه تصویری ایران؛ بازخوانی‌شده با نگاهی آرام و معاصر.",
    origin: "کرمان",
    technique: "دستباف",
    pattern: "نقش بته",
  },
  {
    id: 4,
    number: "۰۴",
    name: "گلستان",
    image: "/images/carpet-04.jpg",
    description:
      "ترکیبی از رنگ، گل و هندسه؛ اثری که گرمای هنر ایرانی را به فضای امروز می‌آورد.",
    origin: "کرمان",
    technique: "دستباف",
    pattern: "نقش گل",
  },
];
