export interface VehicleModel {
  id: string;
  name: string;
  category: "car" | "bike";
  brand: string;
  segment?: string;
  years: number[];
  variants: {
    id: string;
    name: string;
    fuel: "Petrol" | "Diesel" | "CNG" | "Electric";
    transmission: "Manual" | "Automatic";
    baseExShowroom: number; // For recent year base price
    historicalExShowroom: Record<number, number>; // model year -> price in INR
  }[];
}

export interface StateRTO {
  stateCode: string;
  stateName: string;
  roadTaxPercentCar: number; // e.g., 12%
  roadTaxPercentBike: number; // e.g., 8%
  rtos: {
    code: string;
    city: string;
  }[];
}

export const POPULAR_VEHICLES: VehicleModel[] = [
  // ================= CARS =================
  {
    id: "hyundai-i20",
    name: "i20",
    category: "car",
    brand: "Hyundai",
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    variants: [
      {
        id: "i20-magna-petrol-mt",
        name: "Magna 1.2 Petrol MT",
        fuel: "Petrol",
        transmission: "Manual",
        baseExShowroom: 704000,
        historicalExShowroom: {
          2018: 540000,
          2019: 580000,
          2020: 620000,
          2021: 679000,
          2022: 704000,
          2023: 746000,
          2024: 775000,
        },
      },
      {
        id: "i20-sportz-petrol-mt",
        name: "Sportz 1.2 Petrol MT",
        fuel: "Petrol",
        transmission: "Manual",
        baseExShowroom: 805000,
        historicalExShowroom: {
          2018: 620000,
          2019: 670000,
          2020: 730000,
          2021: 759000,
          2022: 805000,
          2023: 838000,
          2024: 872000,
        },
      },
      {
        id: "i20-asta-petrol-ivt",
        name: "Asta (O) 1.2 Petrol IVT (Auto)",
        fuel: "Petrol",
        transmission: "Automatic",
        baseExShowroom: 1045000,
        historicalExShowroom: {
          2020: 920000,
          2021: 990000,
          2022: 1045000,
          2023: 1101000,
          2024: 1125000,
        },
      },
    ],
  },
  {
    id: "maruti-swift",
    name: "Swift",
    category: "car",
    brand: "Maruti Suzuki",
    years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    variants: [
      {
        id: "swift-vxi-petrol-mt",
        name: "VXi 1.2 Petrol MT",
        fuel: "Petrol",
        transmission: "Manual",
        baseExShowroom: 695000,
        historicalExShowroom: {
          2017: 535000,
          2018: 575000,
          2019: 610000,
          2020: 645000,
          2021: 675000,
          2022: 695000,
          2023: 725000,
          2024: 760000,
        },
      },
      {
        id: "swift-zxi-amt",
        name: "ZXi 1.2 Petrol AMT",
        fuel: "Petrol",
        transmission: "Automatic",
        baseExShowroom: 820000,
        historicalExShowroom: {
          2018: 695000,
          2019: 735000,
          2020: 765000,
          2021: 795000,
          2022: 820000,
          2023: 855000,
          2024: 890000,
        },
      },
      {
        id: "swift-vxi-cng",
        name: "VXi CNG Manual",
        fuel: "CNG",
        transmission: "Manual",
        baseExShowroom: 785000,
        historicalExShowroom: {
          2021: 740000,
          2022: 785000,
          2023: 820000,
          2024: 845000,
        },
      },
    ],
  },
  {
    id: "tata-nexon",
    name: "Nexon",
    category: "car",
    brand: "Tata Motors",
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    variants: [
      {
        id: "nexon-creative-petrol-mt",
        name: "Creative 1.2 Turbo Petrol MT",
        fuel: "Petrol",
        transmission: "Manual",
        baseExShowroom: 1100000,
        historicalExShowroom: {
          2018: 750000,
          2019: 820000,
          2020: 920000,
          2021: 990000,
          2022: 1040000,
          2023: 1100000,
          2024: 1150000,
        },
      },
      {
        id: "nexon-fearless-diesel-amt",
        name: "Fearless+ 1.5 Diesel AMT",
        fuel: "Diesel",
        transmission: "Automatic",
        baseExShowroom: 1450000,
        historicalExShowroom: {
          2020: 1220000,
          2021: 1310000,
          2022: 1380000,
          2023: 1450000,
          2024: 1510000,
        },
      },
    ],
  },
  {
    id: "mahindra-thar",
    name: "Thar",
    category: "car",
    brand: "Mahindra",
    years: [2020, 2021, 2022, 2023, 2024],
    variants: [
      {
        id: "thar-lx-diesel-at-4x4",
        name: "LX Hard Top Diesel AT 4x4",
        fuel: "Diesel",
        transmission: "Automatic",
        baseExShowroom: 1680000,
        historicalExShowroom: {
          2020: 1375000,
          2021: 1490000,
          2022: 1590000,
          2023: 1680000,
          2024: 1760000,
        },
      },
      {
        id: "thar-lx-petrol-at-rwd",
        name: "LX Hard Top Petrol AT RWD",
        fuel: "Petrol",
        transmission: "Automatic",
        baseExShowroom: 1350000,
        historicalExShowroom: {
          2023: 1350000,
          2024: 1410000,
        },
      },
    ],
  },
  {
    id: "honda-city",
    name: "City",
    category: "car",
    brand: "Honda",
    years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    variants: [
      {
        id: "city-vx-petrol-cvt",
        name: "VX 1.5 i-VTEC CVT",
        fuel: "Petrol",
        transmission: "Automatic",
        baseExShowroom: 1380000,
        historicalExShowroom: {
          2017: 1150000,
          2018: 1210000,
          2019: 1260000,
          2020: 1320000,
          2021: 1350000,
          2022: 1380000,
          2023: 1440000,
          2024: 1490000,
        },
      },
    ],
  },

  // ================= BIKES =================
  {
    id: "re-classic-350",
    name: "Classic 350",
    category: "bike",
    brand: "Royal Enfield",
    years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    variants: [
      {
        id: "re-classic-350-signals",
        name: "Signals Edition Dual Channel ABS",
        fuel: "Petrol",
        transmission: "Manual",
        baseExShowroom: 213000,
        historicalExShowroom: {
          2017: 142000,
          2018: 158000,
          2019: 168000,
          2020: 178000,
          2021: 198000,
          2022: 213000,
          2023: 219000,
          2024: 225000,
        },
      },
      {
        id: "re-classic-350-halcyon",
        name: "Halcyon Series Dual Channel",
        fuel: "Petrol",
        transmission: "Manual",
        baseExShowroom: 193000,
        historicalExShowroom: {
          2021: 184000,
          2022: 193000,
          2023: 198000,
          2024: 202000,
        },
      },
    ],
  },
  {
    id: "tvs-apache-rtr-160",
    name: "Apache RTR 160 4V",
    category: "bike",
    brand: "TVS",
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    variants: [
      {
        id: "apache-rtr-160-special",
        name: "Special Edition Dual Disc ABS",
        fuel: "Petrol",
        transmission: "Manual",
        baseExShowroom: 132000,
        historicalExShowroom: {
          2018: 86000,
          2019: 92000,
          2020: 104000,
          2021: 118000,
          2022: 126000,
          2023: 132000,
          2024: 136000,
        },
      },
    ],
  },
  {
    id: "honda-activa",
    name: "Activa 6G",
    category: "bike",
    brand: "Honda",
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    variants: [
      {
        id: "activa-6g-dlx",
        name: "Deluxe Alloy Smart Key",
        fuel: "Petrol",
        transmission: "Automatic",
        baseExShowroom: 82000,
        historicalExShowroom: {
          2019: 64000,
          2020: 68000,
          2021: 72000,
          2022: 76000,
          2023: 82000,
          2024: 85000,
        },
      },
    ],
  },
];

export const POPULAR_STATES: StateRTO[] = [
  {
    stateCode: "TS",
    stateName: "Telangana",
    roadTaxPercentCar: 14,
    roadTaxPercentBike: 9,
    rtos: [
      { code: "TS-09", city: "Hyderabad (Khairatabad)" },
      { code: "TS-10", city: "Secunderabad" },
      { code: "TS-07", city: "Ranga Reddy / Gachibowli" },
      { code: "TS-03", city: "Warangal" },
    ],
  },
  {
    stateCode: "KA",
    stateName: "Karnataka",
    roadTaxPercentCar: 18,
    roadTaxPercentBike: 12,
    rtos: [
      { code: "KA-01", city: "Bangalore Central (Koramangala)" },
      { code: "KA-03", city: "Bangalore East (Indiranagar)" },
      { code: "KA-05", city: "Bangalore South (Jayanagar)" },
      { code: "KA-51", city: "Electronic City" },
      { code: "KA-09", city: "Mysore" },
    ],
  },
  {
    stateCode: "MH",
    stateName: "Maharashtra",
    roadTaxPercentCar: 13,
    roadTaxPercentBike: 10,
    rtos: [
      { code: "MH-01", city: "Mumbai South (Tardeo)" },
      { code: "MH-02", city: "Mumbai West (Andheri)" },
      { code: "MH-03", city: "Mumbai East (Wadala)" },
      { code: "MH-12", city: "Pune Central" },
      { code: "MH-14", city: "Pimpri-Chinchwad" },
    ],
  },
  {
    stateCode: "DL",
    stateName: "Delhi NCR",
    roadTaxPercentCar: 10,
    roadTaxPercentBike: 7,
    rtos: [
      { code: "DL-01", city: "Delhi North (Mall Road)" },
      { code: "DL-03", city: "Delhi South (Sheikh Sarai)" },
      { code: "DL-07", city: "Delhi East (Mayur Vihar)" },
    ],
  },
  {
    stateCode: "TN",
    stateName: "Tamil Nadu",
    roadTaxPercentCar: 15,
    roadTaxPercentBike: 9,
    rtos: [
      { code: "TN-01", city: "Chennai Central (Ayanavaram)" },
      { code: "TN-07", city: "Chennai South (Thiruvanmiyur)" },
      { code: "TN-38", city: "Coimbatore North" },
    ],
  },
  {
    stateCode: "KL",
    stateName: "Kerala",
    roadTaxPercentCar: 15,
    roadTaxPercentBike: 10,
    rtos: [
      { code: "KL-01", city: "Thiruvananthapuram" },
      { code: "KL-07", city: "Kochi / Ernakulam" },
    ],
  },
  {
    stateCode: "GJ",
    stateName: "Gujarat",
    roadTaxPercentCar: 8,
    roadTaxPercentBike: 6,
    rtos: [
      { code: "GJ-01", city: "Ahmedabad West" },
      { code: "GJ-06", city: "Vadodara" },
      { code: "GJ-05", city: "Surat" },
    ],
  },
];

export interface WizardFormData {
  category: "car" | "bike";
  brand: string;
  modelId: string;
  variantId: string;
  modelYear: number;
  fuel: string;
  transmission: string;
  stateCode: string;
  rtoCode: string;
  odometer: number;
  owners: number;
  condition: "excellent" | "very-good" | "good" | "fair" | "needs-work";
  serviceHistory: "authorized" | "partial" | "none";
  accidentHistory: "clean" | "minor-cosmetic" | "major-mechanical" | "structural-flood";
  tyreCondition: "new" | "good" | "due";
  batteryCondition: "good" | "weak";
  insuranceStatus: "comprehensive" | "third-party" | "expired";
}

export const INITIAL_FORM_DATA: WizardFormData = {
  category: "car",
  brand: "Hyundai",
  modelId: "hyundai-i20",
  variantId: "i20-sportz-petrol-mt",
  modelYear: 2022,
  fuel: "Petrol",
  transmission: "Manual",
  stateCode: "TS",
  rtoCode: "TS-09",
  odometer: 42000,
  owners: 1,
  condition: "good",
  serviceHistory: "authorized",
  accidentHistory: "clean",
  tyreCondition: "due",
  batteryCondition: "good",
  insuranceStatus: "comprehensive",
};
