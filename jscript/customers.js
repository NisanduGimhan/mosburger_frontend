document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  getAllCustomer();
}

function refreshTable() {
  const tableBody = document.querySelector("#customerTable tbody");
  tableBody.innerHTML = "";
  getAllCustomer();
}

function addCustomer() {
  console.log("add works");

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !address || !email || !phone) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Please fill all the fields before adding a customer!",
    });
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    name,
    email,
    phone,
    address,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8080/customer/add", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      Swal.fire({
        title: "Added Successfully! 🎉",
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

function updateCustomer() {
  const id = document.getElementById("customerId").value.trim();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!id) {
    Swal.fire({
      icon: "warning",
      title: "No Customer Selected",
      text: "Please select a customer to update.",
    });
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    id,
    name,
    email,
    phone,
    address,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8080/customer/update", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      Swal.fire({
        title: "Updated Successfully! 🎉",
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

function deleteCustomer() {
  let id = document.getElementById("customerId").value.trim();

  if (!id) {
    Swal.fire({
      icon: "warning",
      title: "No Customer Selected",
      text: "Please select a customer to delete.",
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

      fetch(`http://localhost:8080/customer/delete/${id}`, requestOptions)
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

function clearFields() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("address").value = "";
  document.getElementById("customerId").value = "";
}
let customers = [];

function getAllCustomer() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("http://localhost:8080/customer/get-all", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      customers = result;

      const tableBody = document.querySelector("#customerTable tbody");
      tableBody.innerHTML = "";

      result.forEach((customer, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${customer.id}</td>
          <td>${customer.name}</td>
          <td>${customer.email}</td>
          <td>${customer.phone}</td>
          <td>${customer.address}</td>
         
        `;

        row.addEventListener("click", () => populateFields(index));

        tableBody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching customers:", error));
}

function populateFields(index) {
  const customer = customers[index];

  document.getElementById("name").value = customer.name;
  document.getElementById("email").value = customer.email;
  document.getElementById("phone").value = customer.phone;
  document.getElementById("address").value = customer.address;

  document.getElementById("customerId").value = customer.id;
}

function searchCustomer() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const tableRows = document.querySelectorAll("#customerTable tbody tr");

  tableRows.forEach((row) => {
    const name = row.cells[1].innerText.toLowerCase();
    if (name.includes(searchInput)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
