document.addEventListener("DOMContentLoaded", () => {
  const postList = document.getElementById("contentFeed");

  async function fetchAndRenderPosts() {
    try {
      const response = await fetch("http://localhost:3000/blogapi/posts");
      const allPosts = await response.json();

      postList.innerHTML = "";

      if (!allPosts.length) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No posts yet.";
        emptyMessage.classList.add("has-text-grey", "has-text-centered", "is-size-5");
        postList.appendChild(emptyMessage);
        return;
      }

      allPosts.forEach((entry) => {
        const card = document.createElement("div");
        card.className = "box";

        const postHeader = document.createElement("h3");
        postHeader.className = "title is-5";
        postHeader.textContent = entry.title;

        const postBody = document.createElement("p");
        postBody.textContent = entry.content;

        const buttonWrap = document.createElement("div");
        buttonWrap.className = "buttons mt-3";

        const editButton = document.createElement("button");
        editButton.className = "button is-info is-small";
        editButton.textContent = "Edit";
        editButton.dataset.id = entry.id;

        const deleteButton = document.createElement("button");
        deleteButton.className = "button is-danger is-small";
        deleteButton.textContent = "Delete";
        deleteButton.dataset.id = entry.id;

        const editPanel = document.createElement("form");
        editPanel.className = "edit-form is-hidden";

        editPanel.innerHTML = `
          <div class="field">
            <label class="label">Title</label>
            <div class="control">
              <input class="input title-input" type="text" value="${entry.title}" />
            </div>
          </div>
          <div class="field">
            <label class="label">Content</label>
            <div class="control">
              <textarea class="textarea content-input content-box" rows="6">${entry.content}</textarea>
            </div>
          </div>
          <div class="buttons mt-2">
            <button class="button is-link is-light cancel-edit">Clear</button>
            <button class="button is-success save-update">Update Post</button>
          </div>
          <br><br><br>
        `;

        // Toggle edit form
        editButton.addEventListener("click", () => {
          editPanel.classList.toggle("is-hidden");
        });

        // Cancel edit
        editPanel.querySelector(".cancel-edit").addEventListener("click", (e) => {
          e.preventDefault();
          editPanel.classList.add("is-hidden");
        });

        // Update post
        editPanel.querySelector(".save-update").addEventListener("click", async () => {
          const newTitle = editPanel.querySelector(".title-input").value.trim();
          const newContent = editPanel.querySelector(".content-input").value.trim();

          if (!newTitle || !newContent) {
            alert("Both title and content are required.");
            return;
          }

          try {
            const updateRes = await fetch(`http://localhost:3000/blogapi/posts/${entry.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ title: newTitle, content: newContent }),
            });

            if (updateRes.ok) {
              fetchAndRenderPosts();
            } else {
              alert("Failed to update post.");
            }
          } catch (error) {
            console.error("Error updating post:", error);
            alert("Server error while updating.");
          }
        });

        // Delete post
        deleteButton.addEventListener("click", async () => {
          const confirmed = confirm("Are you sure you want to delete this post?");
          if (!confirmed) return;

          try {
            const delRes = await fetch(`http://localhost:3000/blogapi/posts/${entry.id}`, {
              method: "DELETE",
            });

            if (delRes.ok) {
              fetchAndRenderPosts();
            } else {
              alert("Failed to delete post.");
            }
          } catch (error) {
            console.error("Error deleting post:", error);
            alert("Server error while deleting.");
          }
        });

        buttonWrap.appendChild(editButton);
        buttonWrap.appendChild(deleteButton);

        card.appendChild(postHeader);
        card.appendChild(postBody);
        card.appendChild(buttonWrap);
        card.appendChild(editPanel);

        postList.appendChild(card);
      });
    } catch (error) {
      console.error("Error loading posts:", error);
      const failMsg = document.createElement("p");
      failMsg.textContent = "Failed to load posts.";
      failMsg.classList.add("has-text-danger");
      postList.appendChild(failMsg);
    }
  }

  fetchAndRenderPosts();
});
