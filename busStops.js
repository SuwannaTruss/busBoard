const fetch = require('node-fetch')
const prompt = require('prompt-sync')();

async function run() {
// get userinput - postcode    
const postcode = prompt('Please input postcode');

// get lat/lon from postcode API
const geoLocation = await fetch(`https://api.postcodes.io/postcodes/${postcode}`) 
     .then(response => response.json())
    //  .then(body => console.log(body))
     .catch(err => console.log(err));
    
 const lat = geoLocation.result.latitude;
 const lon = geoLocation.result.longitude;
 
// get nearest busStops in radius 500m from Tfl API
const nearestBusStops = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=NaptanBusWayPoint%2CNaptanBusCoachStation%2CNaptanOnstreetBusCoachStopPair%2CNaptanPrivateBusCoachTram%2C%20NaptanPublicBusCoachTram%2CNaptanOnstreetBusCoachStopCluster&radius=500`) 
    .then(response => response.json())
   // .then(body => console.log(body))
    .catch(err => console.log(err));
const stopPoint1 = nearestBusStops.stopPoints[0];

console.log(stopPoint1.commonName)
console.log(stopPoint1.naptanId)
const naptanId = '490008660N'  //stopPoint1.naptanId
// get next arrival bus from 
const nextArrivalBusStop1 = await fetch(`https://api.tfl.gov.uk/StopPoint/${naptanId}/Arrivals`) 
     .then(response => response.json())
    //  .then(body => console.log(body))
     .catch(err => console.log(err));
    // console.log(output);
console.log(nextArrivalBusStop1)
    const sortedByArrivalTimeStopPoint = nextArrivalBusStop1.sort(function(busA, busB) {
          return busA.timeToStation - busB.timeToStation
     });

for (let i =0; i < 5; i++) {
    console.log('\nBus: ' + (i+1));
    console.log('route:' + sortedByArrivalTimeStopPoint[i].lineName);
    console.log('destination: ' + sortedByArrivalTimeStopPoint[i].destinationName);
    console.log('in '+ Math.ceil(sortedByArrivalTimeStopPoint[i].timeToStation/60) + ' mins');
    console.log('in'+ Math.round(sortedByArrivalTimeStopPoint[i].timeToStation/60) + 'mins');
    }

}
 run()