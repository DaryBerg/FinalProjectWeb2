const init = async function () {

    const formEl = document.querySelector("form")
    const notifEl = document.querySelector(".success-notif")
    const errNotifEl = document.querySelector(".fail-notif")

    // code for closing the notification boxes.
    const deleteButtons = document.querySelectorAll("button.delete")
    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const parentElement = button.parentElement
            parentElement.classList.add("is-hidden")
        })
    })

    // docker container must be running already.
    const res = await fetch("http://localhost:8080/blogposts")
    const data = await res.json()


    formEl.addEventListener("submit", async function (event) {
        // to prevent the form from reloading the page 
        // once submitted.
        event.preventDefault()

        const data = new FormData(formEl)
        const objectData = Object.fromEntries(data)

        try {
            const res = await fetch("http://localhost:8080/registrations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(objectData)
            })

            const backendResponse = await res.json()
            if (res.status === 200) {
                // the record was created successfully
                // so we need to show the success notification box.
                notifEl.classList.remove("is-hidden")
            }

        } catch {
            // something went wrong here.
            errNotifEl.classList.remove("is-hidden")
        }
    })
}

init()
