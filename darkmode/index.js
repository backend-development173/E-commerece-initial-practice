const btn = document.getElementById("toggle");

btn.addEventListener("change",(e)=>{
   document.body.classList.toggle("dark",e.target.checked);
})