window.addEventListener("DOMContentLoaded", function () {
  const baseUrl = "http://localhost:8080/user";

  //Forgot Password click
  document
    .getElementById("forgotPasswordLink")
    .addEventListener("click", function () {
      document.getElementById("loginForm").style.display = "none";
      document.querySelector(".forgot-password-container").style.display =
        "block";
    });

  //  Register click
  document
    .getElementById("registerLink")
    .addEventListener("click", function () {
      document.getElementById("loginForm").style.display = "none";
      document.querySelector(".register-container").style.display = "block";
    });

  // login part
  document
    .querySelector("#loginForm form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      fetch(`${baseUrl}/login/${email}/${password}`, {
        method: "POST",
      })
        .then((response) => response.text())
        .then((message) => {
          Swal.fire({
            title: "Login successful! 🎉",
            icon: "success",
          });

          if (message === "Login successful!") {
            window.location.href = "http://127.0.0.1:5501/frontpage.html";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Login failed. Please try again.");
        });
    });

  //OTP Part
  document.getElementById("sendOtpBtn").addEventListener("click", function () {
    const email = document.getElementById("forgotEmail").value;
    if (email) {
      const raw = "";

      const requestOptions = {
        method: "POST",
        body: raw,
        redirect: "follow",
      };

      fetch(
        `http://localhost:8080/user/forgot-password/${email}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          Swal.fire({
            title: "OTP Sent 📧 ",
            icon: "success",
          });
          if (result === "OTP sent!") {
            document.querySelector(".otp-container").style.display = "block";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Failed to send OTP. Please try again",
          });
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please Enter Valid Email",
      });
    }
  });

  // OTP Verification part
  document
    .getElementById("verifyOtpBtn")
    .addEventListener("click", function () {
      const email = document.getElementById("forgotEmail").value;
      const otp = document.getElementById("otpInput").value;
      if (email && otp) {
        fetch(`${baseUrl}/verify-otp/${email}/${otp}`, {
          method: "POST",
        })
          .then((response) => response.text())
          .then((message) => {
            Swal.fire({
              title: "OTP Verified! 🎊 ",
              icon: "success",
            });
            if (message === "OTP Verified!") {
              document.querySelector(
                ".reset-password-container"
              ).style.display = "block";
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
              icon: "error",
              title: "Oops!",
              text: "OTP verification failed. Please try again.",
            });
          });
      } else {
        alert("Please enter the OTP.");
      }
    });

  // Reset Password part
  document
    .getElementById("resetPasswordBtn")
    .addEventListener("click", function () {
      const email = document.getElementById("forgotEmail").value;
      const newPassword = document.getElementById("newPassword").value;
      if (email && newPassword) {
        fetch(`${baseUrl}/reset-password/${email}/${newPassword}`, {
          method: "POST",
        })
          .then((response) => response.text())
          .then((message) => {
            Swal.fire({
              title: "Password reset successfully! 🎊 ",
              icon: "success",
            });
            if (message === "Password reset successfully!") {
              location.reload();
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
              icon: "error",
              title: "Oops!",
              text: "Password reset failed. Please try again..",
            });
          });
      } else {
        alert("Please enter a new password.");
      }
    });

  //regisper part
  document.getElementById("registerBtn").addEventListener("click", function () {
    const fullName = document.getElementById("formFullName").value;
    const email = document.getElementById("formEmail").value;
    const password = document.getElementById("formPassword").value;
    const confirmPassword = document.getElementById(
      "formConfirmPassword"
    ).value;

    if (fullName && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Password not match",
        });
        return;
      }

      const user = {
        fullName: fullName,
        email: email,
        password: password,
      };

      fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.text())
        .then((message) => {
          alert(message);
          if (message === "User registered successfully!") {
            location.reload();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Registration failed. Please try again.",
          });
        });
    } else {
      alert("Please fill all fields.");
    }
  });
});
