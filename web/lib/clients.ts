export type ClientLogo = {
  name: string;
  src: string;
  alt?: string;
  /** Optional public website link when set and approved for display. */
  href?: string;
  /** Set true only after an admin saves Approved publication permission. */
  canPublish?: boolean;
};

/** Hospitality clients shown on About — logos in /public/brand/clients/. */
export const clientLogos: ClientLogo[] = [
  { name: "88 Best Villas", src: "/brand/clients/88-best-villas.webp" },
  { name: "AKRA Collection", src: "/brand/clients/akra-collection.webp" },
  { name: "Alama Sea Village", src: "/brand/clients/alama-sea-village.webp" },
  { name: "Alinda Villas", src: "/brand/clients/alinda-villas.webp" },
  { name: "Andaman Breeze", src: "/brand/clients/andaman-breeze.webp" },
  { name: "Andaman Sea Kayak", src: "/brand/clients/andaman-sea-kayak.webp" },
  { name: "Andaman Vibes", src: "/brand/clients/andaman-vibes.webp" },
  { name: "Ao Luek Panoramic", src: "/brand/clients/ao-luek-panoramic.webp" },
  { name: "Asaya Kata", src: "/brand/clients/asaya-kata.webp" },
  { name: "Baan 125 Stay", src: "/brand/clients/baan-125-stay.webp" },
  { name: "Baan Taranya Resort", src: "/brand/clients/baan-taranya.webp" },
  { name: "Blue Canyon", src: "/brand/clients/blue-canyon.webp" },
  { name: "BYD Lofts", src: "/brand/clients/byd-lofts.webp" },
  { name: "Casa de Lipe", src: "/brand/clients/casa-de-lipe.webp" },
  { name: "Casa Solana Patong", src: "/brand/clients/casa-solana.webp" },
  { name: "Chestnut Hill", src: "/brand/clients/chestnut-hill.webp" },
  { name: "Club Bamboo", src: "/brand/clients/club-bamboo.webp" },
  { name: "Coastal Escape", src: "/brand/clients/coastal-escape.webp" },
  { name: "Destination Group", src: "/brand/clients/destination-group.webp" },
  { name: "Fantasea Plus", src: "/brand/clients/fantasea-plus.webp" },
  { name: "Hawa House", src: "/brand/clients/hawa-house.webp" },
  { name: "Holiday Inn Karon", src: "/brand/clients/holiday-inn-karon.webp" },
  { name: "Holiday Inn Surin", src: "/brand/clients/holiday-inn-surin.webp" },
  { name: "Hotel COCO Phuket", src: "/brand/clients/hotel-coco.webp" },
  { name: "Island Escape by Burasari", src: "/brand/clients/island-escape-burasari.webp" },
  { name: "La Saine City Resort", src: "/brand/clients/la-saine-city-resort.webp" },
  { name: "Le Kiri", src: "/brand/clients/le-kiri.webp" },
  { name: "Le Petit", src: "/brand/clients/le-petit.webp" },
  { name: "Long Beach Chalet", src: "/brand/clients/long-beach-chalet.webp" },
  { name: "Maple Travel", src: "/brand/clients/mapple-travel.webp" },
  { name: "Margarita Beach", src: "/brand/clients/margarita-beach.webp" },
  { name: "ME Logo", src: "/brand/clients/me-hotel.webp" },
  { name: "NAKA Yacht Charter", src: "/brand/clients/naka-yacht-charter.webp" },
  { name: "Phuket Boat Quay", src: "/brand/clients/phuket-boat-quay.webp" },
  { name: "Phunaya", src: "/brand/clients/phunaya.webp" },
  { name: "Ramada Chaofa", src: "/brand/clients/ramada-chaofa.webp" },
  { name: "Rush On", src: "/brand/clients/rush-on.webp" },
  { name: "Sivana Villas Hua-Hin", src: "/brand/clients/sivana-hua-hin.webp" },
  { name: "Southsea Khaolak Beach Resort", src: "/brand/clients/southsea-khaolak.webp" },
  { name: "T-Villa Naiyang", src: "/brand/clients/t-villa-naiyang.webp" },
  { name: "The Taksim Royal Beach Hotel", src: "/brand/clients/taksim-royal-beach.webp" },
  { name: "The Yama Hotel Phuket", src: "/brand/clients/the-yama-hotel.webp" },
  { name: "Timber Society", src: "/brand/clients/timber-society.webp" },
  { name: "Union Voyage", src: "/brand/clients/union-voyage.webp" },
  { name: "Universe Supply", src: "/brand/clients/universe-supply.webp" },
  { name: "Wonder Valley", src: "/brand/clients/wonder-valley.webp" },
  { name: "Wyndham Grand Nai Harn", src: "/brand/clients/wyndham-grand-nai-harn.webp" },
];

/** Hardcoded fallback only. Public pages load approved CMS logos; this stays empty until a mark has canPublish. */
export const publishedClientLogos = clientLogos.filter((client) => client.canPublish);

export function clientLogoAlt(client: ClientLogo) {
  return client.alt?.trim() || `${client.name} logo`;
}
