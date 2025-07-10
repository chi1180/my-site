const ARTICLES = [
    {
        "title": "サイトを新しくしました",
        "description": "いろいろと考えた末に、サイトを新しく作り直しました。",
        "content": "### 新しいサイト\n騒がしかった時期をきっかけにして、Qiitaにも、このサイトにもアップデートをしない時期が続きました。\n\nそこで、このままではいけないと、やっと思い立ってすぐ、サイトの作り直しにかかりました。\n\n不要なコンテンツを無くし、**何のために作ったのか**を大事にして作っていきたいと思います。\n### お願い\n\n[contacts](#contacts)では私にメッセージを送っていただくことが可能です。\n\n励みになりますので、もしよろしければ、このサイトの感想や改善案、そのほかについてメッセージを送信していただくと非常にうれしく思います。\n\n有難うございました。",
        "created_at": "2024/09/16"
    },
    {
        "title": "Qiita記事投稿さぼりプログラム",
        "description": "一度調べなおして、なるべく楽に書くことを意識して作ってみました",
        "content": "### Qiitaへの記事投稿\n\n**するべきです**\n\nでも、**継続して取り組むということは難しい** のです。\n\nそこで昔の私は **「プログラムを書いて自動化したらいいじゃぁないか！」** と考えます。\n\n非常にいい考えです。（なんで記事を書くのかという目的を忘れていますが）\n\nしかし、当時の私は思い付きで作成したので、多くの処理（記事の要約、記事の投稿など）をスクレイピングでの処理に頼ってしまっていたのです（あらまぁ）\n\n結果として、コードは汚いモノでした。\n\nそこで今回、新しく書き直そうと思った次第です。\n\n### コード\n\n作成した（作り直した）コードは Github 上にあげました。\n\n[作成しなおしたプログラム](https://github.com/chi1180/QiitaTrendArticleSummary)　←clickしたらリポジトリに飛びます_( ﾉ ﾟｰﾟ)ﾉ\n\n### 改善した（と思っている）トコロ\n\n1__環境変数の使用：\n\n前のコードでは、Qiitaのユーザデータ（cookie）などを直書きしていましたが、今回は環境変数から読み込んで使うようにしました\n\n|\n\n2__LineNotifyライブラリを使用：\n\n前はapiを普通にrequestして～みたいな関数（notification_senderだったかなぁ）を自作して使っていましたが、検索したらライブラリがあったので使用させていただきました。\n\n|\n\n3__エラー処理：\n\n前回は何もエラー処理を書いていませんでした。今回は、非常におおざっぱではありますがエラー処理を一応記述しました（もっと勉強します）\n\n|\n\n4__gemini api の使用：\n\n前回は、スクレイピング処理でAIの要約サイトに行ってそこテキストを入力して要約した文章を生成してもらうみたいなことしていたのですが、今回は、gemini api（モデルは1.5-flash（返答速度が速い））を使用して要約の処理を記述しました。\n\n|\n\n5__qiita api の使用：\n\n前回は、Qiitaへの記事の投稿も、スクレイピング処理で行っていました（ユーザ認証のためにcookieにデータを入れたりとか...）が、今回は api を使用して、記事の投稿をするようにしました。\n\n|\n\nあと、ちょっとしたことですが、LINE通知のメッセージをわかりやすいよう考えました（投稿した記事へのリンクを付けたり）\n\n### 今後やっていきたいコト\n\nqiitaのトレンド記事を取得することが現在の api では無理なので、qiita側がどのようにしてトレンドの記事を選出しているのかというのを調べて、それと同じことを api で実装して～見たいなことをしたいです。",
        "created_at": "2024/09/22"
    },
];










function articlePreview(article_data)
{
    let text = "# " + article_data["title"] + "\n" + article_data["description"] + "\n" + article_data["content"] + "\n\ncreated_at : " + article_data["created_at"];
    const html = marked.parse(text);
    blog_preview.innerHTML = html;
}

const blog_preview = document.querySelector(".blog-preview");
const blog_container = document.querySelector(".blog-container");

for (let i = ARTICLES.length - 1; i > -1; i --) {
    const [blog_card, blog_title, blog_description] = Array(3).fill().map(() => document.createElement("div"));
    blog_card.classList.add("blog-card");
    blog_title.classList.add("blog-title");
    blog_description.classList.add("blog-description");
    blog_title.innerText = ARTICLES[i].title;
    blog_description.innerText = ARTICLES[i].description;
    blog_card.addEventListener("click", () => {
        articlePreview(ARTICLES[i]);
    });

    blog_card.appendChild(blog_title);
    blog_card.appendChild(blog_description);

    blog_container.appendChild(blog_card);

    if (i === ARTICLES.length - 1) articlePreview(ARTICLES[i]);
}

const lastEditDate = document.getElementById("last-edit-date");
lastEditDate.innerText = ARTICLES[ARTICLES.length - 1]["created_at"];


const nav = document.querySelector("nav");

nav.querySelectorAll("a").forEach((a, index) => {
    a.addEventListener("click", () => {
        nav.querySelectorAll("li").forEach(li => {
            const is_selected = li.classList.contains("selecting");
            if (is_selected) li.classList.remove("selecting");
        });
        nav.querySelectorAll("li")[index].classList.add("selecting");
    });
});

requestAnimationFrame(update_learning_days);

setInterval(update_learning_days, 1000 * 60);

function update_learning_days() {
    const learning_days = Math.floor((new Date() - new Date(2023, 0, 1)) / 1000 / 60 / 60 / 24);
    const learn_time = document.getElementById("learn-time");
    learn_time.innerText = learning_days.toString() + "days";
}

const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

messageInput.addEventListener("keydown", () => {
    massageInputEventListener();
});
messageInput.addEventListener("keyup", () => {
    massageInputEventListener();
});
messageInput.addEventListener("change", () => {
    massageInputEventListener();
});

let massageInputEventListener = () => {
    const is_filled = messageInput.value.trim() !== "";
    if (is_filled) {
        sendBtn.classList.add("send-btn");
    } else if (sendBtn.classList.contains("send-btn")) {
        sendBtn.classList.remove("send-btn");
    }
};

let clicked_count = 0;

sendBtn.addEventListener("click", () => {
    if (!clicked_count) {
        clicked_count ++;
        message = messageInput.value;
        sendMail(message);
    }
});

emailjs.init("kSkyNdkMfA1J1a17O");

async function sendMail(message) {
    const templateVariables = {
        message: message
    };

    await emailjs.send(
        'service_fht8v2p',
        'template_1mejccm',
        templateVariables,
    );

    sendBtn.classList.remove("send-btn");
    massageInputEventListener = () => { };

    alert("無事にあなたのメッセージが私に送信されたようです！\n誠に有難うございました！\n今後もプログラミングと人生に励んでまいります！");
}

document.querySelectorAll("a").forEach(a => {
    a.target = "_blank";
});
nav.querySelectorAll("a").forEach(a => {
    a.target = "_self";
});

