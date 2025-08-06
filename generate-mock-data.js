import { writeFileSync } from "fs";
import { stringify } from "csv-stringify/sync";

const links = [
  {
    id: '2a8c4908-fc08-483c-867b-88cc52fb0c98',
    adId: 'a981c394-565b-41cf-8887-fc54e0500497',
    campaignId: 'a1f589a6-69d0-41a0-845b-b46094cf0edc'
  },
  {
    id: 'a4c8ce89-33da-4af3-b5ec-5a29470d5ab7',
    adId: 'a981c394-565b-41cf-8887-fc54e0500497',
    campaignId: 'a1f589a6-69d0-41a0-845b-b46094cf0edc'
  },
  {
    id: '5c08b291-b9cb-42f5-a4a0-e9ac2cdf9ceb',
    adId: 'e3fde05a-460e-46ba-8a71-fbbd68868bc5',
    campaignId: 'a1f589a6-69d0-41a0-845b-b46094cf0edc'
  },
  {
    id: '72262745-e80c-469b-b1c9-4ba89f643a05',
    adId: 'e3fde05a-460e-46ba-8a71-fbbd68868bc5',
    campaignId: 'a1f589a6-69d0-41a0-845b-b46094cf0edc'
  },
  {
    id: '0f89c2b6-cbb2-4143-87d8-54dbd3ba6dfa',
    adId: '31e3efbb-b0c7-4664-ac02-2df13fc244c0',
    campaignId: '8125c23a-8dcf-4c68-93da-25f543bee0a5'
  },
  {
    id: 'fcd38e60-52bc-458f-9c73-f00c7219128c',
    adId: '31e3efbb-b0c7-4664-ac02-2df13fc244c0',
    campaignId: '8125c23a-8dcf-4c68-93da-25f543bee0a5'
  },
  {
    id: 'd810b48f-b527-4888-9b1e-08fae4ea8549',
    adId: '444b869a-b5ff-46d7-bc5b-33e975353f8e',
    campaignId: '8125c23a-8dcf-4c68-93da-25f543bee0a5'
  },
  {
    id: '9f08e92f-e07c-4c99-b963-8520a2174396',
    adId: '444b869a-b5ff-46d7-bc5b-33e975353f8e',
    campaignId: '8125c23a-8dcf-4c68-93da-25f543bee0a5'
  }
];

const measurementId = "G-FDJV9LC30R";

const estViewsPerLink = 10;
const viewsRange = 5;

const endTimestamp = new Date().getTime() * 1000;
const startTimestamp = endTimestamp - 2 * (1_000_000 * 60 * 60 * 24);

function getRandomArbitrary(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

const mockData = links.flatMap((l) => {
  const linkViews = getRandomArbitrary(estViewsPerLink - viewsRange, estViewsPerLink + viewsRange);
  const pageLocation = new URL("https://easeaccess24.com/");
  pageLocation.searchParams.append("linkId", l.id);
  pageLocation.searchParams.append("adId", l.adId);
  pageLocation.searchParams.append("campaignId", l.campaignId);
  return Array.from({ length: linkViews }, () => {
    const timestamp = getRandomArbitrary(startTimestamp, endTimestamp);
    return [
      timestamp,
      pageLocation.href,
      measurementId,
      "page_view"
    ];
  });
}).sort((eA, eB) => eA[0] - eB[0]);

const headers = [
  "timestamp_micros",
  "event_param.page_location",
  "measurement_id",
  "event_name",
]

writeFileSync("ga4-events.csv", stringify([headers, ...mockData]))

function generateClientId(timestamp) {
  const randomPart = getRandomArbitrary(1000000000, 9999999999);
  const timestampPart = String(timestamp).slice(0, 10);
  return `${randomPart}.${timestampPart}`;
}