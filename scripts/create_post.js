document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const resetButton = document.getElementById("reset-form");
  const notification = document.querySelector(".notification");
  const deleteButton = notification.querySelector(".delete");

  // Handle form submission asynchronously
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = form.elements["title"].value.trim();
    const content = form.elements["content"].value.trim();

    if (!title || !content) return;

    // Sends a post request to the server with the form data
    // and handles the response
    try {
      const res = await fetch("http://localhost:3000/blogapi/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      // Server response handling (success or error)
      if (res.ok) {
        showNotification("Added Successfully");
        form.reset();
      } else {
        showNotification("Failed to add post", true);
      }
    } catch (err) {
      console.error(err);
      showNotification("Server error", true);
    }
  });

  // Handle manual form when reset button is clicked
  resetButton.addEventListener("click", (e) => {
    e.preventDefault();
    form.reset();
  });

  // Hide notification when delete button is clicked
  deleteButton.addEventListener("click", () => {
    notification.classList.add("is-hidden");
  });

  // Funtion to show notification messages
  // with different styles based on success or error
  function showNotification(message, isError = false) {
    notification.classList.remove("is-hidden", "is-primary", "is-danger");
    notification.classList.add(isError ? "is-danger" : "is-primary");
    notification.innerHTML = `
      <button class="delete"></button>
      ${message}
    `;

    // Dynamically add event listener to the delete button inside the notification
    notification.querySelector(".delete").addEventListener("click", () => {
      notification.classList.add("is-hidden");
    });
  }
});
