import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import { createMarker } from './controller/markers.js';
import { createPopups, displayPopup } from './controller/popups.js';

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: fromLonLat([107.6098, -6.9175]),
        zoom: 12
    })
});
// Mengambil data koordinat marker dari URL yang diberikan
let markerCoords = [];
fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/marker')
    .then(response => response.json())
    .then(data => {
        // Memeriksa apakah data markers adalah array
        if (!Array.isArray(data.markers)) {
            console.error('Data marker bukan array:', data);
            return;
        }
        console.log('Koordinat Marker:', data.markers);
        createMapMarkers(data.markers); // Membuat marker pada peta
    })
    .catch(error => console.error('Gagal mengambil data marker:', error));

// Mengambil data untuk pop-up dari URL yang diberikan
let popupsData = [];
fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/lokasi')
    .then(response => response.json())
    .then(data => {
        // Memeriksa apakah data adalah array
        if (!Array.isArray(data)) {
            console.error('Popup data bukan array:', data);
            return;
        }
        // Memfilter dan memetakan data pop-up
        popupsData = data.filter(item => item.lon && item.lat && item.nama_tempat && item.lokasi && item.fasilitas && item.gambar)
                         .map(item => ({
                             coordinate: [item.lon, item.lat],
                             content: `
                                <div class="popup-content">
                                    <img src="${item.gambar}" alt="Gambar Tempat" style="width:100%; height:auto;">
                                    <table>
                                        <tr><th>Nama Tempat</th><td>${item.nama_tempat}</td></tr>
                                        <tr><th>Lokasi</th><td>${item.lokasi}</td></tr>
                                        <tr><th>Fasilitas</th><td>${item.fasilitas}</td></tr>
                                    </table>
                                </div>`
                         }));
        console.log('Popup Data:', popupsData);
        initializeMapPopups(popupsData); // Menginisialisasi pop-up pada peta
    })
    .catch(error => console.error('Error fetching popup data:', error));

// Array untuk menyimpan pop-up
let popups = [];

// Fungsi untuk menginisialisasi pop-up pada peta
function initializeMapPopups(popupsData) {
    popups = createPopups(map, popupsData.map(item => ({
        coordinate: item.coordinate,
        content: item.content
    })));
}

function createMapMarkers(markerCoords) {
    // Membuat penanda (marker) untuk setiap koordinat yang diberikan
    const markers = markerCoords.map(coord => createMarker(map, coord));

    // Menambahkan event listener ke setiap penanda
    markers.forEach((marker, index) => {
        marker.getElement().addEventListener('click', () => {
            // Mengambil pop-up dan data pop-up berdasarkan indeks penanda
            const popup = popups[index];
            const popupData = popupsData[index];

            // Jika pop-up dan data pop-up ditemukan
            if (popup && popupData && popupData.coordinate) {
                // Menampilkan pop-up dengan konten yang sesuai pada koordinat yang diberikan
                displayPopup(popup, popupData.coordinate, popupData.content);

                // Menganimasikan tampilan peta untuk berfokus pada lokasi pop-up dengan zoom tingkat 14
                map.getView().animate({ center: fromLonLat(popupData.coordinate), zoom: 14 });
            } else {
                // Menampilkan pesan kesalahan jika pop-up atau data pop-up tidak ditemukan
                console.error('Popup atau data pop-up tidak ditemukan untuk penanda dengan indeks:', index);
            }
        });
    });
}

map.on('click', function(event) {
    popups.forEach(popup => {
        popup.setPosition(null);
    });
});

// Tambahkan event listener ke peta untuk menyembunyikan tabel saat peta diklik
map.on('click', function() {
    document.getElementById('placesTable').style.display = 'none';
});

// Fungsi untuk menangani pengiriman form dan menyimpan data ke database
document.getElementById('parkingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = {
        nama_tempat: document.getElementById('nama_tempat').value,
        lokasi: document.getElementById('lokasi').value,
        fasilitas: document.getElementById('fasilitas').value,
        lon: parseFloat(document.getElementById('lon').value),
        lat: parseFloat(document.getElementById('lat').value),
        gambar: document.getElementById('gambar').value
    };

    fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/tempat-parkir', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.Response);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('coordinatesForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = {
        markers: JSON.parse(document.getElementById('markers').value)
    };

    fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/koordinat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});