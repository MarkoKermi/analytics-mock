// pnpm tsx simulate-view-events.ts

import fs from "fs/promises";
import path from "path";


const measurementId = "G-FDJV9LC30R";
const apiSecret = "ttIAOG30SN-ztsiOHquh8w";

const BASE_URL = "https://smarthub.mk";

function buildUtmUrl({
  source,
  medium,
  campaignId,
  adId,
  linkId,
}: {
  source: string;
  medium: string;
  campaignId: string;
  adId: string;
  linkId: string;
}) {
  const url = new URL(BASE_URL);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("campaign_id", campaignId);
  url.searchParams.set("ad_id", adId);
  url.searchParams.set("link_id", linkId);
  return url.toString();
}

async function generateUtmLinksFromJson() {
  const dataPath = path.join(__dirname, "campaigns-output-1754395322321.json");
  const raw = await fs.readFile(dataPath, "utf-8");
  const json = JSON.parse(raw);

    for (const org of json) {
    const campaigns = org.campaign;
    for (const campaign of campaigns) {
      for (const ad of campaign.ads) {
        for (const link of ad.links) {
          const fullUrl = buildUtmUrl({
            source: link.source,
            medium: link.medium,
            campaignId: campaign.id,
            adId: ad.id,
            linkId: link.id,
          });

          console.log(fullUrl);

          await sendMockView(fullUrl, Date.now() * 1000);
        }
      }
    }
  }
}

function getRandomArbitrary(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

function generateClientId(timestamp) {
  const randomPart = getRandomArbitrary(1000000000, 9999999999);
  const timestampPart = String(timestamp).slice(0, 10);
  return `${randomPart}.${timestampPart}`;
}

async function sendMockView(pageUrl, timestampMicros) {
  const payload = {
    client_id: generateClientId(timestampMicros),
    timestamp_micros: timestampMicros,
    non_personalized_ads: false,
    events: [
      {
        name: "page_view",
        params: {
          page_location: pageUrl,
          engagement_time_msec: 1000
        }
      }
    ]
  };

  const res = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );

  if (!res.ok) {
    console.error(`Error ${res.status}: ${await res.text()}`);
  } else {
    console.log(`✅ Sent view: ${pageUrl}`);
  }
}

generateUtmLinksFromJson()
  .then(() => console.log("🎉 All UTM links processed and mock events sent"))
  .catch(console.error);


// SCRIPT TO BE RUN FOR 24 HOURS

//   // pnpm tsx simulate-view-events.ts

// import fs from "fs/promises";
// import path from "path";

// const measurementId = "G-FDJV9LC30R";
// const apiSecret = "ttIAOG30SN-ztsiOHquh8w";

// const BASE_URL = "https://smarthub.mk/pricing";

// function buildUtmUrl({
//   source,
//   medium,
//   campaignId,
//   adId,
//   linkId,
// }: {
//   source: string;
//   medium: string;
//   campaignId: string;
//   adId: string;
//   linkId: string;
// }) {
//   const url = new URL(BASE_URL);
//   url.searchParams.set("utm_source", source);
//   url.searchParams.set("utm_medium", medium);
//   url.searchParams.set("campaign_id", campaignId);
//   url.searchParams.set("ad_id", adId);
//   url.searchParams.set("link_id", linkId);
//   return url.toString();
// }

// async function generateUtmLinksFromJson() {
//   const dataPath = path.join(__dirname, "campaigns-output-1754395322321.json");
//   const raw = await fs.readFile(dataPath, "utf-8");
//   const json = JSON.parse(raw);

//   for (const org of json) {
//     const campaigns = org.campaign;
//     for (const campaign of campaigns) {
//       for (const ad of campaign.ads) {
//         for (const link of ad.links) {
//           const fullUrl = buildUtmUrl({
//             source: link.source,
//             medium: link.medium,
//             campaignId: campaign.id,
//             adId: ad.id,
//             linkId: link.id,
//           });

//           console.log(fullUrl);

//           await sendMockView(fullUrl, Date.now() * 1000);
//         }
//       }
//     }
//   }
// }

// function getRandomInt(min: number, max: number) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function generateClientId(timestamp: number) {
//   const randomPart = getRandomInt(1000000000, 9999999999);
//   const timestampPart = String(Math.floor(timestamp / 1000));
//   return `${randomPart}.${timestampPart}`;
// }

// async function sendMockView(pageUrl: string, timestampMicros: number) {
//   const payload = {
//     client_id: generateClientId(timestampMicros),
//     timestamp_micros: timestampMicros,
//     non_personalized_ads: false,
//     events: [
//       {
//         name: "page_view",
//         params: {
//           page_location: pageUrl,
//           engagement_time_msec: 1000,
//         },
//       },
//     ],
//   };

//   const res = await fetch(
//     `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     }
//   );

//   if (!res.ok) {
//     console.error(`❌ Error ${res.status}: ${await res.text()}`);
//   } else {
//     console.log(`✅ Sent view: ${pageUrl}`);
//   }
// }

// async function generateViews() {
//   const dataPath = path.join(__dirname, "campaigns-output-1754395322321.json");
//   const raw = await fs.readFile(dataPath, "utf-8");
//   const json = JSON.parse(raw);

//   const viewsPerLink = 100;
//   const totalDurationMs = 24 * 60 * 60 * 1000;

//   for (const org of json) {
//     const campaigns = org.campaign;
//     for (const campaign of campaigns) {
//       for (const ad of campaign.ads) {
//         for (const link of ad.links) {
//           const fullUrl = buildUtmUrl({
//             source: link.source,
//             medium: link.medium,
//             campaignId: campaign.id,
//             adId: ad.id,
//             linkId: link.id,
//           });

//           console.log(`📌 Scheduling ${viewsPerLink} views for: ${fullUrl}`);

//           for (let i = 0; i < viewsPerLink; i++) {
//             const offset =
//               Math.floor((i / viewsPerLink) * totalDurationMs) +
//               getRandomInt(-300000, 300000); // ±5 minutes
//             const eventTime = Date.now() + offset;
//             const delay = eventTime - Date.now();

//             setTimeout(() => {
//               sendMockView(fullUrl, eventTime * 1000);
//             }, delay);
//           }
//         }
//       }
//     }
//   }
// }

// generateViews();

// generateUtmLinksFromJson()
//   .then(() => console.log("🎉 All UTM links processed and mock events sent"))
//   .catch(console.error);






