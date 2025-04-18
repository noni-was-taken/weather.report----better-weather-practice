const APIkey = 'XRZU7BWG5WUQZQC4WRWNLD9YW';
let searchBar = document.getElementById(`inputLocation`);
let fine = true;
let previousLocation = 'temporary';

async function getData(location){
    try{
        data = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${APIkey}`)
        if(!data.ok){
            throw 'Failed to fetch data.';
        }
        let receivedData = await data.json();
        fine = true;
        return receivedData;
    }
    catch(error){
        console.log(error);
        if(!document.getElementById(`errorMessage`).classList.contains('fade')){
            document.getElementById(`errorMessage`).classList.toggle('fade');
        }
        fine = false;
    }
};

document.addEventListener("DOMContentLoaded", async (event) => {
    display('tokyo');
});

searchBar.addEventListener('keydown', function(event){
    if(event.key == 'Enter'){
        display(searchBar.value);
    }
});


async function display(location){
    try{
        if(location === previousLocation){
            console.log('locationAlready Displayed');    
        }else{
            if(fine)toggleFade();

            data = await getData(location);
            displayAdditional(data);
            const hour = epochHour();
            const hourly = data.days[0].hours;
            const currentHour = hourly.find(h =>{
                const apiTime = h.datetimeEpoch;
                return Math.abs(apiTime - hour) <= 1800; 
            }) || hourly[0];

            var date = new Date();
            var dateFormat = new Intl.DateTimeFormat("en-US", {
                timeZone: `${data.timezone}`,
                timeZoneName: "short"
            });
            
            const currentTime = dateFormat.format(date);
        
        
            if(document.getElementById(`errorMessage`).classList.contains('fade')){
                document.getElementById(`errorMessage`).classList.toggle('fade');
            }
            document.getElementById(`locationData`).textContent = data.resolvedAddress.toUpperCase();
            document.getElementById(`temperatureData`).textContent = `${Math.ceil((currentHour.temp-32)*5/9)}°`;
            document.getElementById(`timezone`).innerHTML = `${currentHour.datetime} <br> ${currentTime}`;
            document.getElementById(`condition`).textContent = currentHour.conditions;
            document.getElementById(`feelsLike`).textContent = `feels like ${Math.ceil((currentHour.feelslike-32)*5/9)}°`;
            document.getElementById(`weatherIcon`).setAttribute('src', `images/icons/${currentHour.icon}.svg`);
            document.getElementById(`weatherIcon`).setAttribute('style', `display: block`);
            document.getElementById(`backgroundIMG`).setAttribute(`src`, `/images/backgrounds/${currentHour.icon}.png`)

            if(fine)toggleFade();
            previousLocation = location;
        }
    } catch(error) {
        console.log('Error in Display');
    }
}

function toggleFade(){
    console.log("Toggling fade...");
    let elements = [
        document.getElementById(`locationData`),
        document.getElementById(`temperatureData`),
        document.getElementById(`timezone`),
        document.getElementById(`condition`),
        document.getElementById(`feelsLike`),
        document.getElementById(`weatherIcon`),
        document.getElementById(`wind-icon`),
        document.getElementById(`wind-speed`),
        document.getElementById(`wind-direction`),
        document.getElementById(`moon-icon`),
        document.getElementById(`moon-condition`),
        document.getElementById(`next-day-conditionIcon`),
        document.getElementById(`next-day-temp`),
        document.getElementById(`next-day-condition`),
        document.getElementById(`backgroundIMG`)
    ]
    elements.forEach((element, inx) => {
        element.classList.toggle('fade');
    });
}

function epochHour(){
    const now = new Date();
    return Math.floor(now.getTime() / 1000);
}

function displayAdditional(data){
    //tomorrow data
    document.getElementById(`next-day-temp`).textContent = `${Math.ceil((data.days[1].temp-32)*5/9)}°`;
    document.getElementById(`next-day-condition`).textContent = `${data.days[1].conditions}`;
    document.getElementById(`next-day-conditionIcon`).setAttribute('src', `/images/icons/${data.days[1].icon}.svg`);

    //wind info
    document.getElementById(`wind-speed`).textContent = `${data.days[1].windspeed} m/h`
    const windtext = document.getElementById(`wind-direction`);
    let windDir = data.days[1].winddir;
    switch(true) {
        case (windDir === 0 || windDir === 360):
            windtext.textContent = `N`;
            break;
        case (windDir === 90):
            windtext.textContent = `E`;
            break;
        case (windDir === 180):
            windtext.textContent = `S`;
            break;
        case (windDir === 270):
            windtext.textContent = `W`;
            break;
        case (windDir > 0 && windDir < 90):
            windtext.textContent = `NE`;
            break;
        case (windDir > 90 && windDir < 180):
            windtext.textContent = `SE`;
            break;
        case (windDir > 180 && windDir < 270):
            windtext.textContent = `SW`;
            break;
        case (windDir > 270 && windDir < 360):
            windtext.textContent = `NW`;
            break;
        default:
            console.log(`invalid direction`);
    }

    const moonStat = data.days[1].moonphase;
    const moonDescription = document.getElementById(`moon-condition`);
    console.log(moonStat);
    var moonCondition;
    switch(true){
        case (moonStat === 0):
            moonCondition = 'new-moon';
            moonDescription.textContent = `New Moon`;
            break; 
        case (moonStat < 0.25 && moonStat > 0):
            moonCondition = 'waxing-crescent';
            moonDescription.textContent = `Waxing Crescent`;
            break;
        case (moonStat === 0.25):
            moonCondition = 'first-quarter';
            moonDescription.textContent = `First Quarter`;
            break;
        case (moonStat < 0.50 && moonStat > 0.25):
            moonCondition = 'waxing-gibbous';
            moonDescription.textContent = `Waxing Gibbous`;
            break;
        case (moonStat === 0.50):
            moonCondition = 'full-moon';
            moonDescription.textContent = `Full Moon`;
            break;
        case (moonStat < 0.75 && moonStat > 0.50):
            moonCondition = 'waning-gibbous';
            moonDescription.textContent = `Waning Gibbous`;
            break;
        case (moonStat === 0.75):
            moonCondition = 'last-quarter';
            moonDescription.textContent = `Last Quarter`;
            break;
        case (moonStat < 1 && moonStat > 0.75):
            moonCondition = 'waning-crescent';
            moonDescription.textContent = `Waning Crescent`;
            break;
        default:
            console.log(`invalid moon phase`);
    }
    console.log(moonCondition);
    document.getElementById(`moon-icon`).setAttribute('src', `images/icons/lunar-icons/${moonCondition}.svg`)
}
