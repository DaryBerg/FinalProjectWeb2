document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const resetButton = document.getElementById("reset-form");
    const notification = document.querySelector(".notification");
    const deleteButton = notification.querySelector(".delete");
  
    // Handle form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const title = form.elements["title"].value.trim();
      const content = form.elements["content"].value.trim();
  
      if (!title || !content) return;
  
      try {
        const res = await fetch("http://localhost:3000/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content }),
        });
  
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
  
    // Handle manual form reset
    resetButton.addEventListener("click", (e) => {
      e.preventDefault();
      form.reset();
    });
  
    // Hide notification on close
    deleteButton.addEventListener("click", () => {
      notification.classList.add("is-hidden");
    });
  
    // Show notification message
    function showNotification(message, isError = false) {
      notification.classList.remove("is-hidden", "is-primary", "is-danger");
      notification.classList.add(isError ? "is-danger" : "is-primary");
      notification.innerHTML = `
        <button class="delete"></button>
        ${message}
      `;
  
      // Re-bind close button
      notification.querySelector(".delete").addEventListener("click", () => {
        notification.classList.add("is-hidden");
      });
    }
  });
  