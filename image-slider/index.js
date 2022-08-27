const imgs = document.getElementById("imgid");

const img = document.querySelectorAll("#imgid img");

let idx = 0;

function res() {
    idx++;

    if (idx > img.length-1) {
        idx = 0;
    }

    imgs.style.transform = `translateX(${-idx * 300}px)`;
}

setInterval(res, 2000);