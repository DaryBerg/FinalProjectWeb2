document.addEventListener("DOMContentLoaded", async () => {
  const contentFeed = document.getElementById("contentFeed");

  // Clear the feed before inserting new content
  contentFeed.innerHTML = "";

  try {
    // Fetch posts from the backend API
    const response = await fetch("http://localhost:3000/blogapi/posts");
    const postData = await response.json();

    // Handle empty post list
    if (postData.length === 0) {
      const emptyNotice = document.createElement("p");
      emptyNotice.textContent = "No posts yet.";
      emptyNotice.classList.add("has-text-grey", "has-text-centered", "is-size-5");
      contentFeed.appendChild(emptyNotice);
      return;
    }

    // Render each post
    for (const entry of postData) {
      const postCard = document.createElement("div");
      postCard.className = "box";

      const titleNode = document.createElement("h3");
      titleNode.className = "title is-4";
      titleNode.textContent = entry.title;

      const contentNode = document.createElement("div");
      contentNode.className = "content-scroll";
      contentNode.textContent = entry.content;

      postCard.appendChild(titleNode);
      postCard.appendChild(contentNode);
      contentFeed.appendChild(postCard);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);

    const failNotice = document.createElement("p");
    failNotice.textContent = "Failed to load posts. Please try again later.";
    failNotice.classList.add("has-text-danger");
    contentFeed.appendChild(failNotice);
  }
});
