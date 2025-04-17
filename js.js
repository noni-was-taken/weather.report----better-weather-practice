const APIkey = 'XRZU7BWG5WUQZQC4WRWNLD9YW';
let searchBar = document.getElementById(`inputLocation`);

async function getData(location){
    try{
        data = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${APIkey}`)
        if(!data.ok){
            throw 'Failed to fetch data.';
        }
        let receivedData = data.json();
        return receivedData;
    }
    catch(error){
        console.log(error);
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
    data = await getData(location);
    var date = new Date();
    var dateFormat = new Intl.DateTimeFormat("en-US", {
        timeZone: `${data.timezone}`,
        timeZoneName: "short"
    });
    const currentTime = dateFormat.format(date);
    document.getElementById(`locationData`).textContent = data.resolvedAddress.toUpperCase();
    document.getElementById(`temperatureData`).textContent = `${Math.ceil((data.days[0].temp-32)*5/9)}°`;
    document.getElementById(`timezone`).textContent = `${currentTime}`;
    document.getElementById(`condition`).textContent = data.days[0].conditions;
    document.getElementById(`feelsLike`).textContent = `feels like ${Math.ceil((data.days[0].feelslikemin-32)*5/9)}°`;
    document.getElementById(`weatherIcon`).setAttribute('src', `images/icons/${data.days[0].icon}.svg`)
}