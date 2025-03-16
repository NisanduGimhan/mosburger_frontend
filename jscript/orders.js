document.addEventListener("DOMContentLoaded", () => {
  fetchOrders();
});

const BASE_URL = "http://localhost:8080/order/get-all";

async function fetchOrders() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch orders");

    const orders = await response.json();
    displayOrders(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}

function displayOrders(orders) {
  const orderTableBody = document.getElementById("orderTableBody");
  orderTableBody.innerHTML = "";

  orders.forEach((order, index) => {
    const row = document.createElement("tr");

    const itemsList = order.items
      .map(
        (item) =>
          `<li>${item.itemName} (x${item.quantity}) - Rs. ${(
            item.price * item.quantity
          ).toFixed(2)}</li>`
      )
      .join("");

    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customerName}</td>
      <td>${order.contactNo}</td>
      <td><ul>${itemsList}</ul></td>
      
      <td>Rs. ${order.discount.toFixed(2)}</td>
      <td>Rs. ${order.totalPrice.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm" style="background-color: #e27324cc;" onclick="printOrderReport(${order.id
      })">
          Print Order Report
        </button>
        <button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.id
      })">
          Delete
        </button>
      </td>
    `;

    orderTableBody.appendChild(row);
  });
}

async function deleteOrder(orderId) {
  try {
    const response = await fetch(`${B}/${orderId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete order");

    fetchOrders();
  } catch (error) {
    console.error("Error deleting order:", error);
  }
}

async function printOrderReport(orderId) {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch orders");

    const orders = await response.json();
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      alert("Order not found!");
      return;
    }

    const { customerName = "No Name", contactNo = "No Contact" } = order;
    const items = Array.isArray(order.items) ? order.items : [];
    const discount = Number(order.discount) || 0;
    const totalPrice = Number(order.totalPrice) || 0;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const imgURL = "images/pdf.jpeg";

    doc.addImage(imgURL, "JPEG", 75, 5, 60, 25);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(255, 165, 0);
    doc.text("MOS BURGERS", 105, 40, null, null, "center");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 255);
    doc.text("Fresh & Tasty", 105, 50, null, null, "center");

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Order Bill", 105, 60, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleString()}`, 10, 65);
    doc.text(`Customer: ${customerName}`, 10, 75);
    doc.text(`Contact: ${contactNo}`, 10, 85);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Item", 10, 100);
    doc.text("Qty", 90, 100);
    doc.text("Price", 130, 100);
    doc.text("Total", 170, 100);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let yPosition = 110;
    items.forEach((item, i) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const total = quantity * price;

      doc.text(item.itemName || "Unknown Item", 10, yPosition);
      doc.text(quantity.toString(), 95, yPosition, { align: "right" });
      doc.text(`Rs.${price.toFixed(2)}`, 135, yPosition, { align: "right" });
      doc.text(`Rs.${total.toFixed(2)}`, 180, yPosition, { align: "right" });
      yPosition += 10;
    });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 165, 0);
    doc.setFontSize(14);
    doc.text(`Total Amount: Rs.${totalPrice.toFixed(2)}`, 180, yPosition + 10, {
      align: "right",
    });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(
      "Thank you for dining with us!",
      105,
      yPosition + 30,
      null,
      null,
      "center"
    );
    doc.text(
      "MOS Burgers - happy customers!",
      105,
      yPosition + 40,
      null,
      null,
      "center"
    );
    doc.text(
      "Address: No. 123, Galle Road, Colombo, Sri Lanka",
      105,
      yPosition + 50,
      null,
      null,
      "center"
    );
    doc.text(
      "Contact: +94 76 123 4567",
      105,
      yPosition + 60,
      null,
      null,
      "center"
    );
    doc.text(
      "Website: www.mossburger.lk",
      105,
      yPosition + 70,
      null,
      null,
      "center"
    );
    doc.text(
      "Follow Us: @mossburgerlk ",
      105,
      yPosition + 80,
      null,
      null,
      "center"
    );

    doc.save(`MOS_BURGERS_Invoice_${orderId}.pdf`);
  } catch (error) {
    console.error("Error generating report:", error);
  }
}
