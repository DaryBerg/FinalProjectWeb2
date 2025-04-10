document.addEventListener("DOMContentLoaded", () => {
  // Connect to form and UI elements from the HTML
  const postForm = document.getElementById("form");                            // <form id="form">
  const clearFormButton = document.getElementById("reset-form-button");       // <button id="reset-form-button">
  const notificationBox = document.querySelector(".notification");            // <div class="notification">
  const notificationCloseButton = notificationBox.querySelector(".delete");   // <button class="delete">

  // Handle form submission
  postForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const postTitle = postForm.elements["title"].value.trim();   // input[name="title"]
    const postContent = postForm.elements["content"].value.trim(); // textarea[name="content"]

    if (!postTitle || !postContent) return;

    try {
      const response = await fetch("http://localhost:3000/blogapi/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: postTitle, content: postContent }),
      });

      if (response.ok) {
        showNotification("Post added successfully.");
        postForm.reset();
      } else {
        showNotification("Failed to add post.", true);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      showNotification("Server error. Please try again later.", true);
    }
  });

  // Handle manual form reset
  clearFormButton.addEventListener("click", (event) => {
    event.preventDefault();
    postForm.reset();
  });

  // Hide notification when close button is clicked
  notificationCloseButton.addEventListener("click", () => {
    notificationBox.classList.add("is-hidden");
  });

  // Show a notification message
  function showNotification(message, isError = false) {
    // Reset state and apply styling
    notificationBox.classList.remove("is-hidden", "is-primary", "is-danger");
    notificationBox.classList.add(isError ? "is-danger" : "is-primary");

    // Inject message content and a close button
    notificationBox.innerHTML = `
      <button class="delete"></button>
      ${message}
    `;

    // Re-bind close button after HTML overwrite
    const newCloseButton = notificationBox.querySelector(".delete");
    newCloseButton.addEventListener("click", () => {
      notificationBox.classList.add("is-hidden");
    });
  }
});
