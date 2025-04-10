document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("posts-container");

  try {
    //Sends GET request to the server to fetch posts
    const res = await fetch("http://localhost:3000/blogapi/posts");
    const posts = await res.json();

    // Clear container before adding new posts
    container.innerHTML = "";

    // If there are no posts, display a message
    if (!posts.length) {
      const noPostsMsg = document.createElement("p");
      noPostsMsg.textContent = "No posts yet.";
      noPostsMsg.classList.add("has-text-grey", "has-text-centered", "is-size-5");
      container.appendChild(noPostsMsg);
    } else {
      posts.forEach((post) => {
        const box = document.createElement("div");
        box.className = "box";

        box.innerHTML = `
          <h3 class="title is-4">${post.title}</h3>
          <div class="content-scroll">${post.content}</div>
        `;

        container.appendChild(box);
      });
    }
  } catch (err) {
    console.error("Error fetching posts:", err);

    // If an error occurs, log it, then display an error message
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "Failed to load posts. Please try again later.";
    errorMsg.classList.add("has-text-danger");
    container.appendChild(errorMsg);
  }
});
