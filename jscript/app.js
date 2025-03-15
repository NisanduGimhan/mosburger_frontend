document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "1234") {
      window.location.href = "frontpage.html";
    } else {
      alert("Invalid username or password. Please try again.");
    }
  });
