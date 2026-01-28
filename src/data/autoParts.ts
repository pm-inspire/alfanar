export interface CompatibilityEntry {
  brand: string;
  car_type: string;
  years: number[];
  note?: string;
}

export interface AutoPart {
  id: string;
  name_ar: string;
  part_number: string;
  brand: string;
  brand_ar?: string;
  car_type: string;
  year: number;
  section_main: string;
  section_sub: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  compatibility: CompatibilityEntry[];
}

export const brandLabels: Record<string, string> = {
  Mitsubishi: "ميتسوبيشي",
  Toyota: "تويوتا",
  Hyundai: "هيونداي",
  Kia: "كيا",
  Nissan: "نيسان",
  Mazda: "مازدا",
  Honda: "هوندا",
  Changan: "شانجان",
  Geely: "جيلي",
};

export const autoParts: AutoPart[] = [
  {
    id: "p-1001",
    name_ar: "رديتر ماء ميتسوبيشي لانسر أزرق",
    part_number: "MR-43120-A",
    brand: "Mitsubishi",
    brand_ar: "ميتسوبيشي",
    car_type: "لانسر",
    year: 2015,
    section_main: "تبريد",
    section_sub: "رديتر",
    description: "رديتر ماء أصلي لانسر 2013-2016 تبريد عالي الأداء.",
    image: "/placeholder.svg",
    price: 520,
    stock: 12,
    compatibility: [
      { brand: "Mitsubishi", car_type: "لانسر", years: [2013, 2014, 2015, 2016] },
    ],
  },
  {
    id: "p-1002",
    name_ar: "فحمات فرامل أمامية تويوتا كورولا",
    part_number: "TY-BRK-2010",
    brand: "Toyota",
    brand_ar: "تويوتا",
    car_type: "كورولا",
    year: 2010,
    section_main: "فرامل",
    section_sub: "فحمات",
    description: "فحمات فرامل أمامية أصلية كورولا 2009-2012.",
    image: "/placeholder.svg",
    price: 180,
    stock: 24,
    compatibility: [
      { brand: "Toyota", car_type: "كورولا", years: [2009, 2010, 2011, 2012] },
    ],
  },
  {
    id: "p-1003",
    name_ar: "فلتر زيت هيونداي النترا",
    part_number: "HY-ELN-OF-17",
    brand: "Hyundai",
    brand_ar: "هيونداي",
    car_type: "النترا",
    year: 2017,
    section_main: "زيوت",
    section_sub: "فلاتر",
    description: "فلتر زيت أصلي للنترا 2016-2018.",
    image: "/placeholder.svg",
    price: 65,
    stock: 80,
    compatibility: [
      { brand: "Hyundai", car_type: "النترا", years: [2016, 2017, 2018] },
    ],
  },
  {
    id: "p-1004",
    name_ar: "فلتر هواء كيا سيراتو",
    part_number: "KIA-AIR-18",
    brand: "Kia",
    brand_ar: "كيا",
    car_type: "سيراتو",
    year: 2018,
    section_main: "فلاتر",
    section_sub: "هواء",
    description: "فلتر هواء عالي الجودة لسيراتو 2017-2019.",
    image: "/placeholder.svg",
    price: 95,
    stock: 56,
    compatibility: [
      { brand: "Kia", car_type: "سيراتو", years: [2017, 2018, 2019] },
    ],
  },
  {
    id: "p-1005",
    name_ar: "دينامو نيسان صني",
    part_number: "NS-SNY-ALT-14",
    brand: "Nissan",
    brand_ar: "نيسان",
    car_type: "صني",
    year: 2014,
    section_main: "كهرباء",
    section_sub: "دينامو",
    description: "دينامو عالي الكفاءة لصني 2013-2015.",
    image: "/placeholder.svg",
    price: 680,
    stock: 6,
    compatibility: [
      { brand: "Nissan", car_type: "صني", years: [2013, 2014, 2015] },
    ],
  },
  {
    id: "p-1006",
    name_ar: "طرمبة ماء مازدا 3",
    part_number: "MZ3-WP-16",
    brand: "Mazda",
    brand_ar: "مازدا",
    car_type: "مازدا 3",
    year: 2016,
    section_main: "تبريد",
    section_sub: "طرمبة ماء",
    description: "طرمبة ماء أصلية لمازدا 3 موديلات 2014-2017.",
    image: "/placeholder.svg",
    price: 410,
    stock: 18,
    compatibility: [
      { brand: "Mazda", car_type: "مازدا 3", years: [2014, 2015, 2016, 2017] },
    ],
  },
  {
    id: "p-1007",
    name_ar: "كمبروسر مكيف هوندا سيفيك",
    part_number: "HN-CIV-AC-19",
    brand: "Honda",
    brand_ar: "هوندا",
    car_type: "سيفيك",
    year: 2019,
    section_main: "تكييف",
    section_sub: "كمبروسر",
    description: "كمبروسر مكيف أصلي لسيفيك 2018-2020.",
    image: "/placeholder.svg",
    price: 1280,
    stock: 4,
    compatibility: [
      { brand: "Honda", car_type: "سيفيك", years: [2018, 2019, 2020] },
    ],
  },
  {
    id: "p-1008",
    name_ar: "إطار أمامي شانجان السفن",
    part_number: "CH-SVN-FR-20",
    brand: "Changan",
    brand_ar: "شانجان",
    car_type: "السفن",
    year: 2020,
    section_main: "هيكل",
    section_sub: "إطار",
    description: "إطار أمامي أصلي للسفن 2019-2021.",
    image: "/placeholder.svg",
    price: 880,
    stock: 9,
    compatibility: [
      { brand: "Changan", car_type: "السفن", years: [2019, 2020, 2021] },
    ],
  },
  {
    id: "p-1009",
    name_ar: "شمعة احتراق جيلي امجراند",
    part_number: "GE-EM-PLUG-15",
    brand: "Geely",
    brand_ar: "جيلي",
    car_type: "امجراند",
    year: 2015,
    section_main: "محرك",
    section_sub: "شمعات",
    description: "شمعة احتراق أصلية لامجراند 2014-2016.",
    image: "/placeholder.svg",
    price: 45,
    stock: 150,
    compatibility: [
      { brand: "Geely", car_type: "امجراند", years: [2014, 2015, 2016] },
    ],
  },
  {
    id: "p-1010",
    name_ar: "سير دينمو ميتسوبيشي باجيرو",
    part_number: "MR-PAJ-BELT-12",
    brand: "Mitsubishi",
    brand_ar: "ميتسوبيشي",
    car_type: "باجيرو",
    year: 2012,
    section_main: "محرك",
    section_sub: "سيور",
    description: "سير دينمو أصلي لباجيرو 2011-2013.",
    image: "/placeholder.svg",
    price: 120,
    stock: 33,
    compatibility: [
      { brand: "Mitsubishi", car_type: "باجيرو", years: [2011, 2012, 2013] },
    ],
  },
  {
    id: "p-1011",
    name_ar: "علبة دركسون تويوتا كامري",
    part_number: "TY-CAM-STR-16",
    brand: "Toyota",
    brand_ar: "تويوتا",
    car_type: "كامري",
    year: 2016,
    section_main: "توجيه",
    section_sub: "دركسون",
    description: "علبة دركسون أصلية لكامري 2015-2017.",
    image: "/placeholder.svg",
    price: 980,
    stock: 5,
    compatibility: [
      { brand: "Toyota", car_type: "كامري", years: [2015, 2016, 2017] },
    ],
  },
  {
    id: "p-1012",
    name_ar: "مساعد أمامي هيونداي توسان",
    part_number: "HY-TUS-SHO-18",
    brand: "Hyundai",
    brand_ar: "هيونداي",
    car_type: "توسان",
    year: 2018,
    section_main: "تعليق",
    section_sub: "مساعدات",
    description: "مساعد أمامي أصلي لتوسان 2017-2019.",
    image: "/placeholder.svg",
    price: 760,
    stock: 11,
    compatibility: [
      { brand: "Hyundai", car_type: "توسان", years: [2017, 2018, 2019] },
    ],
  },
];
