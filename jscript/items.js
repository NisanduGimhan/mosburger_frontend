document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  getAllItems();
}
async function refreshTable() {
  const tableBody = document.querySelector("#itemTable tbody");
  tableBody.innerHTML = "";
  getAllItems();
}

function clearFields() {
  document.getElementById("itemId").value = "";
  document.getElementById("itemno").value = "";
  document.getElementById("itemtype").value = "";
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("image").value = "";
  document.getElementById("currentImageUrl").value = "";
}

async function refreshTable() {
  console.log("Refreshing table...");
}

function deleteItem() {
  let id = document.getElementById("itemId").value.trim();

  if (!id) {
    Swal.fire({
      icon: "warning",
      title: "No Item Selected",
      text: "Please select an item to delete.",
    });
    return;
  }

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };

      fetch(`http://localhost:8080/item/delete/${id}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          Swal.fire({
            title: "Deleted Successfully! 🎉",
            icon: "success",
          });
          clearFields();
          refreshTable();
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Something went wrong. Please try again.",
          });
        });
    }
  });
}

async function clearFields() {
  document.getElementById("itemno").value = "";
  document.getElementById("itemtype").value = "";
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("image").value = "";
  document.getElementById("itemId").value = "";
}

let items = [];

function getAllItems() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("http://localhost:8080/item/get-all", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      items = result;

      const tableBody = document.querySelector("#itemTable tbody");
      tableBody.innerHTML = "";

      result.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.itemNo}</td>
          <td>${item.itemType}</td>
          <td>${item.name}</td>
          <td>${item.price}</td>
          <td><img src="${item.imageUrl}" alt="${item.name}" class="item-image" style="width: 100px; height: 100px; display: block; margin: 0 auto;"></td>
        `;

        row.addEventListener("click", () => populateFields(index));

        tableBody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching items:", error));
}
function populateFields(index) {
  const item = items[index];

  document.getElementById("itemno").value = item.itemNo;
  document.getElementById("itemtype").value = item.itemType;
  document.getElementById("name").value = item.name;
  document.getElementById("price").value = item.price;
  document.getElementById("itemId").value = item.id;
  document.getElementById("image").value = item.imageUrl;
}

function searchItem() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const tableRows = document.querySelectorAll("#itemTable tbody tr");

  tableRows.forEach((row) => {
    const name = row.cells[3].innerText.toLowerCase();
    if (name.includes(searchInput)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

async function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch("http://localhost:8080/api/images/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const imageUrl = await response.text();
    return `http://localhost:8080${imageUrl}`;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

async function addItem() {
  const itemno = document.getElementById("itemno").value;
  const itemtype = document.getElementById("itemtype").value;
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const imageInput = document.getElementById("image");
  if (!imageInput.files.length) {
    throw new Error("Please select an image.");
  }
  const imageFile = imageInput.files[0];
  const imageUrl = await uploadImage(imageFile);
  console.log(imageUrl);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    itemNo: itemno,
    itemType: itemtype,
    name: name,
    price: price,
    imageUrl: imageUrl,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8080/item/add", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      Swal.fire({
        icon: "success",
        title: "Item Added",
        text: "The item was successfully Added.",
      });
      clearFields();
      refreshTable();
    })
    .catch((error) => console.error(error));
}

async function updateItem() {
  const id = document.getElementById("itemId").value.trim();
  const itemno = document.getElementById("itemno").value.trim();
  const itemtype = document.getElementById("itemtype").value.trim();
  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value.trim()) || 0;
  const image = document.getElementById("image").files[0];

  if (!id) {
    Swal.fire({
      icon: "warning",
      title: "No Item Selected",
      text: "Please select an item to update.",
    });
    return;
  }

  let imageUrl = document.getElementById("image").value;
  if (image) {
    imageUrl = await uploadImage(image);
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    id: id,
    itemNo: itemno,
    itemType: itemtype,
    name: name,
    price: price,
    imageUrl: imageUrl,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "http://localhost:8080/item/update",
      requestOptions
    );
    const result = await response.text();
    console.log(result);

    Swal.fire({
      icon: "success",
      title: "Item Updated",
      text: "The item was successfully updated.",
    });

    clearFields();

    await refreshTable();
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "An error occurred while updating the item.",
    });
  }
}
