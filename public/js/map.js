// console.log("Listing Location:", listingLocation);

// const map = L.map("map").setView([20.5937, 78.9629], 5);

// L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "&copy; OpenStreetMap contributors"
// }).addTo(map);

// const marker = L.marker([20.5937, 78.9629]).addTo(map);

// marker.bindPopup("India").openPopup();

// fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${listingLocation}`)
//     .then(response => response.json())
//     .then(data => {
//         console.log("Coordinates:", data);
//     });

if (typeof listingLocation !== "undefined") {

    console.log("Listing Location:", listingLocation);

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${listingLocation}`)
        .then(response => response.json())
        .then(data => {

            console.log("Coordinates:", data);

            if (data.length > 0) {

                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);

                const map = L.map("map").setView([lat, lon], 12);

                L.tileLayer("https://tiles.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png", {
                    attribution: "&copy; OpenStreetMap contributors"
                }).addTo(map);

                const marker = L.marker([lat, lon]).addTo(map); 

                marker.bindPopup(`<b>${listingTitle}</b><br>${listingLocation}`).openPopup();
            }
        });
}