const map = L.map('map').setView([20, 0], 2);

// OpenStreetMap base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const pins = [];

document.getElementById('locationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const location = document.getElementById('location').value.trim();

    if (!name || !location) return;

    // Geocode using Nominatim
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    try {
        const res = await fetch(url, {headers: {'Accept-Language':'en'}});
        const data = await res.json();
        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            // Add pin to map
            const marker = L.marker([lat, lon]).addTo(map)
                .bindPopup(`<b>${name}</b><br>${location}`).openPopup();
            pins.push({name, location, lat, lon});
            map.setView([lat, lon], 6);
        } else {
            alert('Could not find that location!');
        }
    } catch (err) {
        alert('Error finding location.');
    }
});
