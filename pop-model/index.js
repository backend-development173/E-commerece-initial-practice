 const open  = document.getElementById('open');
const pop  = document.getElementById("container");
const close = document.getElementById('close');


open.addEventListener("click",  ()=>{
 
   pop.classList.add("active");
  

 })
 
close.addEventListener("click",  ()=>{
 
    pop.classList.remove("active");
   
  })