import { readFileSync } from "fs";

const inputFile = "export-data.json";

const eventData = readFileSync(inputFile, {
  encoding: "utf8"
});

const events = JSON.parse(eventData);

const eventsForImport = events.map((e) => {
  const pEntries = e.event_params.map(p => getParamEntry(p));
  return {
    timestamp_micros: 1609488000000000,
    ...Object.fromEntries(pEntries)
  }
});

function getParamEntry(pData) {
  const pVal = Object.values(pData.value).find(v => !!v);
  return [
    `event_param.${pData.key}`,
    pVal
  ]
}