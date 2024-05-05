
/** contactsのところのwebページリンクに自分のサイトのリンクを入れる */
const siteURL = document.getElementById("site-url");
siteURL.href = siteURL.innerText = window.location.href.includes("#") ? window.location.href.split("#")[0] : window.location.href ;

/** 新しいタブでリンクを開くようにする */
const link_s = document.querySelector("main").querySelectorAll("a");
link_s.forEach( link => { link.target = "_blank" } );

