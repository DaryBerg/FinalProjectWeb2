document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("posts-container");

  async function loadPosts() {
    try {
      const res = await fetch("http://localhost:3000/blogapi/posts");
      const posts = await res.json();

      container.innerHTML = "";

      if (!posts.length) {
        const noPostsMsg = document.createElement("p");
        noPostsMsg.textContent = "No posts yet.";
        noPostsMsg.classList.add("has-text-grey", "has-text-centered", "is-size-5");
        container.appendChild(noPostsMsg);
      } else {
        posts.forEach((post) => {
          const box = document.createElement("div");
          box.className = "box";

          const titleEl = document.createElement("h3");
          titleEl.className = "title is-5";
          titleEl.textContent = post.title;

          const contentEl = document.createElement("p");
          contentEl.textContent = post.content;

          const buttonGroup = document.createElement("div");
          buttonGroup.className = "buttons mt-3";

          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Delete";
          deleteBtn.className = "button is-danger is-small";
          deleteBtn.dataset.id = post.id;

          const editBtn = document.createElement("button");
          editBtn.textContent = "Edit";
          editBtn.className = "button is-info is-small";
          editBtn.dataset.id = post.id;

          deleteBtn.addEventListener("click", async () => {
            const confirmDelete = confirm("Are you sure you want to delete this post?");
            if (!confirmDelete) return;

            try {
              const res = await fetch(`http://localhost:3000/blogapi/posts/${post.id}`, {
                method: "DELETE",
              });

              if (res.ok) {
                loadPosts();
              } else {
                alert("Failed to delete post.");
              }
            } catch (err) {
              console.error("Error deleting post:", err);
              alert("Server error while deleting post.");
            }
          });

          const editForm = document.createElement("form");
          editForm.className = "edit-form is-hidden";
          box.appendChild(editForm);

          editForm.innerHTML = `
            <div class="field">
              <label class="label">Title</label>
              <div class="control">
                <input class="input title-input" type="text" value="${post.title}" />
              </div>
            </div>
            <div class="field">
              <label class="label">Content</label>
              <div class="control">
                <textarea class="textarea content-input content-box" rows="6">${post.content}</textarea>
              </div>
            </div>
            <div class="buttons mt-2">
              <button class="button is-link is-light clear-edit">Clear</button>
              <button class="button is-success update-post">Update Post</button>
            </div>
            <br><br><br>
          `;

          editBtn.addEventListener("click", () => {
            editForm.classList.toggle("is-hidden");
          });

          editForm.querySelector(".clear-edit").addEventListener("click", (e) => {
            e.preventDefault();
            editForm.classList.add("is-hidden");
          });

          editForm.querySelector(".update-post").addEventListener("click", async () => {
            const updatedTitle = editForm.querySelector(".title-input").value.trim();
            const updatedContent = editForm.querySelector(".content-input").value.trim();

            if (!updatedTitle || !updatedContent) {
              alert("Both title and content are required.");
              return;
            }

            try {
              const res = await fetch(`http://localhost:3000/blogapi/posts/${post.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title: updatedTitle,
                  content: updatedContent,
                }),
              });

              if (res.ok) {
                loadPosts();
              } else {
                alert("Failed to update post.");
              }
            } catch (err) {
              console.error("Error updating post:", err);
              alert("Server error while updating.");
            }
          });

          buttonGroup.appendChild(editBtn);
          buttonGroup.appendChild(deleteBtn);

          box.appendChild(titleEl);
          box.appendChild(contentEl);
          box.appendChild(buttonGroup);

          container.appendChild(box);
        });
      }
    } catch (err) {
      console.error("Error loading posts:", err);
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Failed to load posts.";
      errorMsg.classList.add("has-text-danger");
      container.appendChild(errorMsg);
    }
  }

  loadPosts();
});
