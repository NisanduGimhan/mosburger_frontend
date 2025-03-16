window.onload = async function () {
  await loadItems();
  await loadCustomers();
  filterCategory("All");
  renderCart();
  populateCustomerDropdown();
  console.log(items);
};

let customers = [];
let items = [];
let cart = [];

async function placeOrder() {
  addCustomer();
  console.log(cart);
  const customerName = document.getElementById("customerName").value.trim();
  const contactNo = document.getElementById("contactNo").value.trim();
  const discount = parseFloat(document.getElementById("discount").value) || 0;
  const totalPrice = calculateTotal();

  if (!customerName || !contactNo) {
    alert("Please enter customer information");
    return;
  }

  const order = {
    customerName,
    contactNo,
    items: cart.map((cartItem) => ({
      itemName: cartItem.name,
      price: cartItem.price,
      quantity: cartItem.quantity,
    })),
    discount,
    totalPrice,
  };

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(order),
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "http://localhost:8080/order/add",
      requestOptions
    );
    const result = await response.text();
    console.log(result);
    alert("Order placed successfully!");

    cart = [];
    document.getElementById("customerName").value = "";
    document.getElementById("contactNo").value = "";
    document.getElementById("discount").value = "";
    renderCart();
  } catch (error) {
    console.error(error);
    alert("Failed to place order. Please try again.");
  }
}

async function loadItems() {
  try {
    const response = await fetch("http://localhost:8080/item/get-all");
    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }
    items = await response.json();
    renderMenu(items);
  } catch (error) {
    console.error("Error loading items:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load items. Please try again.",
    });
  }
}

async function loadCustomers() {
  try {
    const response = await fetch("http://localhost:8080/customer/get-all");
    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }
    customers = await response.json();
    populateCustomerDropdown();
  } catch (error) {
    console.error("Error loading customers:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load customers. Please try again.",
    });
  }
}

function renderMenu(items) {
  const menuContent = document.getElementById("menu-content");
  menuContent.innerHTML = "";
  menuContent.classList.add("row", "row-cols-1", "row-cols-md-3", "g-4");

  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.classList.add("col");
    card.innerHTML = `
      <div class="card h-10">
        <img src="${item.imageUrl}" class="card-img-top" alt="${item.name}" style="height: 150px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">Rs.${item.price}</p>
          <button style="background-color: #FB710C;" class="btn btn-add-item" onclick="addToCart(${index})">Add to Cart</button>
        </div>
      </div>
    `;
    menuContent.appendChild(card);
  });
}

function filterCategory(category) {
  document.querySelectorAll(".category-btn").forEach((btn) => {
    if (btn.textContent.includes(category)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  let filteredItems;
  if (category === "All") {
    filteredItems = items;
  } else {
    filteredItems = items.filter((item) => item.itemType === category);
  }

  renderMenu(filteredItems);
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
            <span>${item.name} - Rs.${item.price}</span>
            <input type="number" value="${item.quantity
      }" min="1" onchange="updateQuantity(${index}, this.value)">
            <span>Rs.${(parseFloat(item.price) * item.quantity).toFixed(
        2
      )}</span>
            <button class="btn btn-danger btn-remove" onclick="removeFromCart(${index})">Remove</button>
        `;
    cartItems.appendChild(cartItem);
  });

  document.getElementById("totalPrice").textContent =
    calculateTotal().toFixed(2);
}

function populateCustomerDropdown() {
  const customerSelect = document.getElementById("existingCustomer");
  customerSelect.innerHTML =
    '<option value="">-- Select a customer --</option>';
  customers.forEach((customer, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${customer.name} (${customer.phone})`;
    customerSelect.appendChild(option);
  });
}

function fillCustomerInfo() {
  const dropdown = document.getElementById("existingCustomer");
  const selectedIndex = dropdown.value;

  if (selectedIndex !== "") {
    const selectedCustomer = customers[selectedIndex];
    document.getElementById("customerName").value = selectedCustomer.name;
    document.getElementById("customerEmail").value = selectedCustomer.email;
    document.getElementById("contactNo").value = selectedCustomer.phone;
    document.getElementById("customerAddress").value = selectedCustomer.address;
  }
}

function addToCart(index) {
  const item = items[index];
  const existingItem = cart.find((cartItem) => cartItem.name === item.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  renderCart();
}

function calculateTotal() {
  const discount = parseFloat(document.getElementById("discount").value) || 0;
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return subtotal - discount;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
  console.log(customers);
  console.log(items);
  console.log(filterCategory);
}

const cartToggle = document.getElementById("cartToggle");
const cartPopup = document.getElementById("cartPopup");
const cartOverlay = document.getElementById("cartOverlay");

cartToggle.addEventListener("click", (e) => {
  e.preventDefault();
  cartPopup.classList.toggle("active");
  cartOverlay.classList.toggle("active");
});

cartOverlay.addEventListener("click", () => {
  cartPopup.classList.remove("active");
  cartOverlay.classList.remove("active");
});
function addCustomer() {
  console.log("add works");

  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const phone = document.getElementById("contactNo").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

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
