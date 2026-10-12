// Swap any image URL here; Home and TripResult both read from this file.
const u = (id, w = 900) =>
  `https://i.pinimg.com/736x/81/06/44/810644f3cffecf954cbf98d61eff625c.jpg`;

export const HERO_IMAGE = u("photo-1533104816931-20fa691ff6ca", 2400);

export const DESTINATIONS = [
  { name: "Bali, Indonesia", region: "Indonesia", phrase: "Rice terraces and quiet coastline", image: u("photo-1537996194471-e657df975ab4") },
  { name: "Kyoto, Japan", region: "Japan", phrase: "Temples, tea houses and old streets", image: u("photo-1493976040374-85c8e12f0c0e") },
  { name: "Swiss Alps", region: "Switzerland", phrase: "Lakes and high mountain trails", image: u("photo-1531366936337-7c912a4589a7") },
  { name: "Amalfi Coast, Italy", region: "Italy", phrase: "Cliffside towns above the sea", image: u("photo-1533104816931-20fa691ff6ca") },
  { name: "Cappadocia, Türkiye", region: "Türkiye", phrase: "Valleys, caves and sunrise skies", image: u("photo-1570939274717-7eda259b50ed") },
  { name: "Manali, India", region: "India", phrase: "Pine forests and Himalayan views", image: u("photo-1626621341517-bbf3d9990a23") },
];

export function imageForDestination(name = "") {
  const n = name.toLowerCase().trim();
  if (!n) return undefined;
  return DESTINATIONS.find((d) => {
    const key = d.name.split(",")[0].toLowerCase();
    return n.includes(key) || key.includes(n);
  })?.image;
}