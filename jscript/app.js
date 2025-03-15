// Event listeners after page loads
window.addEventListener("DOMContentLoaded", function () {
  // Handle Forgot Password link click
  document
    .getElementById("forgotPasswordLink")
    .addEventListener("click", function () {
      document.getElementById("loginForm").style.display = "none";
      document.querySelector(".forgot-password-container").style.display =
        "block";
    });
  // Handling OTP Send Button Click
  document
    .getElementById("sendOtpBtn")
    .addEventListener("click", function () {
      const email = document.getElementById("forgotEmail").value;
      if (email) {
        // Simulate sending OTP (you can replace this with actual API call)
        alert("OTP sent to " + email);
        document.querySelector(".otp-container").style.display = "block";
      } else {
        alert("Please enter a valid email.");
      }
    });

  // Handling OTP Verification Button Click
  document
    .getElementById("verifyOtpBtn")
    .addEventListener("click", function () {
      const otp = document.getElementById("otpInput").value;
      if (otp) {
        // Simulate OTP verification (replace with actual verification logic)
        alert("OTP Verified!");
        document.querySelector(
          ".reset-password-container"
        ).style.display = "block";
      } else {
        alert("Please enter the OTP.");
      }
    });
  // Handling Password Reset Button Click
  document
    .getElementById("resetPasswordBtn")
    .addEventListener("click", function () {
      const newPassword = document.getElementById("newPassword").value;
      if (newPassword) {
        // Simulate password reset (you can replace this with an actual API call)
        alert("Password reset successful!");
        location.reload(); // Reloading to show the login page
      } else {
        alert("Please enter a new password.");
      }
    });
  // Handle Register link click
  document
    .getElementById("registerLink")
    .addEventListener("click", function () {
      document.getElementById("loginForm").style.display = "none";
      document.querySelector(".register-container").style.display =
        "block";
    });

  // Handle Register Button click
  document
    .getElementById("registerBtn")
    .addEventListener("click", function () {
      const username = document.getElementById("formFullName").value;
      const email = document.getElementById("formEmail").value;
      const password = document.getElementById("formPassword").value;
      const formConfirmPassword = document.getElementById(
        "formConfirmPassword"
      ).value;

      if (username && email && password && formConfirmPassword) {
        alert("Registration successful!");
        location.reload();
      } else {
        alert("Please fill all fields.");
      }
    });
});