const btn = document.getElementById("btn");
const container = document.getElementById("container");

btn.addEventListener("click", () => {
    const box = document.createElement("div");
    box.classList.add("cssadded");

   box.innerText = "click here to  get 2000$";

    container.appendChild(box);

    setInterval(() => {
       box.remove();    
    }, 2000);
});


    
  
