const launchesMongo = require("./launches.mongo");
const planets = require("./planents.mongo");

const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

launches.set(launch.flightNumber, launch);

function launchExistsWithId(launchId) {
  return launches.has(launchId);
}

async function getAllLaunches() {
  return await launchesMongo.find(
    {},
    { _id: 0, __v: 0 } // Exclude the id and version from the response
  );
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet was found.");
  }

  await launchesMongo.updateOne(
    {
      flightNumber: launch.flightNumber, // Update the document if this flightNumber exists
    },
    launch, // Otherwise, insert the new launch
    { upsert: true }
  );
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["ZTM", "NASA"],
      flightNumber: latestFlightNumber,
    })
  );
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  launchExistsWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
};
