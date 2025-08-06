import { readFileSync } from "fs";

const inputFile = "db-data.json";

const dbData = readFileSync(inputFile, {
  encoding: "utf8"
});

const campaigns = JSON.parse(dbData);

const links = campaigns.flatMap(c => c.campaign.ads.flatMap(a => a.links.flatMap(l => ({
  id: l.id,
  adId: a.id,
  campaignId: c.campaign.id
}))));
console.log(links);