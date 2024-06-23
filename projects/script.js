
/** 新しいタブでリンクを開くようにする */
const link_s = document.querySelector("main").querySelectorAll("a");
link_s.forEach( link => { link.target = "_blank" } );


setTimeout(() => {
    const ads = document.querySelector(".left-ads");
const article = document.querySelector(".article");
ads.style.height = article.clientHeight + "px";
console.log(ads.clientHeight);
}, 250);