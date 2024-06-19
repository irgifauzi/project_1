document.addEventListener('DOMContentLoaded', function() {
    fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/lokasi')  // Ganti 'data.json' dengan path sesuai dengan lokasi file JSON Anda
        .then(response => response.json())
        .then(data => {
            const dataBody = document.getElementById('dataBody');
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item._id}</td>
                    <td>${item.nama_tempat}</td>
                    <td>${item.lokasi}</td>
                    <td>${item.fasilitas}</td>
                    <td>${item.lon}</td>
                    <td>${item.lat}</td>
                    <td>${item.gambar}</td>
                `;
                dataBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
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
