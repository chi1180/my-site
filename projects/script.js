
/** 新しいタブでリンクを開くようにする */
const link_s = document.querySelector("main").querySelectorAll("a");
link_s.forEach( link => { link.target = "_blank" } );
