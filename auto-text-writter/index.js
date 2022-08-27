 const  message  = "sharepener is best for preparing off-campus and on-campus placement";
 let idx  =0;
function autowtitter(){
    document.body.innerText = message.slice(0,idx);

    idx++;
    if(idx>message.length) {
        idx=0;
    }
}

setInterval(autowtitter,100);

    
  
