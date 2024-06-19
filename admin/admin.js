document.addEventListener('DOMContentLoaded', function () {
    const dataTable = document.getElementById('data-table');
    const tableBody = document.getElementById('table-body');
    const addForm = document.getElementById('add-form');
    let currentIdToUpdate = null; // Variable to store the ID of the item being updated

    const fetchData = async () => {
      try {
        const response = await fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/lokasi'); // Update with your backend URL
        const data = await response.json();
        renderData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const renderData = (data) => {
      tableBody.innerHTML = '';
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
          <td>
            <button class="btn-update" data-id="${item._id}">Update</button>
            <button class="btn-delete" data-id="${item._id}">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    };

    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        nama_tempat: document.getElementById('nama_tempat').value,
        lokasi: document.getElementById('lokasi').value,
        fasilitas: document.getElementById('fasilitas').value,
        lon: document.getElementById('lon').value,
        lat: document.getElementById('lat').value,
        gambar: document.getElementById('gambar').value
      };

      try {
        const response = await fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/tempat-parkir', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error adding data');
        }

        fetchData();
        addForm.reset();
      } catch (error) {
        console.error('Error adding data:', error);
      }
    });

    tableBody.addEventListener('click', async (e) => {
      if (e.target.classList.contains('btn-update')) {
        const id = e.target.getAttribute('data-id');
        // Fetch the current data for the item to update
        try {
          const response = await fetch(`https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/tempat${id}`);
          if (!response.ok) {
            throw new Error('Error fetching item data');
          }
          const data = await response.json();
          // Populate the form fields with current data
          document.getElementById('nama_tempat').value = data.nama_tempat;
          document.getElementById('lokasi').value = data.lokasi;
          document.getElementById('fasilitas').value = data.fasilitas;
          document.getElementById('lon').value = data.lon;
          document.getElementById('lat').value = data.lat;
          document.getElementById('gambar').value = data.gambar;

          // Store the ID of the item being updated
          currentIdToUpdate = id;
        } catch (error) {
          console.error('Error fetching item data:', error);
        }
      }

      if (e.target.classList.contains('btn-delete')) {
        const id = e.target.getAttribute('data-id');
        try {
          const response = await fetch(`https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/tempat${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Error deleting data');
          }

          fetchData();
        } catch (error) {
          console.error('Error deleting data:', error);
        }
      }
    });

    // Event listener for the update form
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        nama_tempat: document.getElementById('nama_tempat').value,
        lokasi: document.getElementById('lokasi').value,
        fasilitas: document.getElementById('fasilitas').value,
        lon: document.getElementById('lon').value,
        lat: document.getElementById('lat').value,
        gambar: document.getElementById('gambar').value
      };

      try {
        const response = await fetch(`https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/tempat${currentIdToUpdate}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error updating data');
        }

        fetchData();
        addForm.reset();
      } catch (error) {
        console.error('Error updating data:', error);
      }
    });

    // Load data on page load
    fetchData();
});
