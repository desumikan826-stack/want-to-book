// latest version script.js loaded successfully
console.log("最新版(Auth)script.js 読み込み成功");

// 💡 認証オプション付きで初期化
const supabaseUrl = "https://eqgyfkxiecozflnbypkl.supabase.co";
const supabaseKey = "sb_publishable_3MQXaPuO9U3O_zub0LPoGg_N2pIYkIJ"; 

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // セッションを保存
    autoRefreshToken: true, // トークンを自動更新
  }
});

let books = [];
let currentTab = 'all'; 

// 💡 ログインユーザー情報を保持
let currentUser = null; 

// --- 認証 (Auth) 関連の関数 ---

// 1. サインアップ (新規登録)
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (error) throw error;
  return data;
}

// 2. サインイン (ログイン)
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) throw error;
  return data;
}

// 3. サインアウト (ログアウト)
async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// 💡 ログイン状態を監視するリスナー
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth State Changed:", event, session);
  
  if (session) {
    // ログインしている
    currentUser = session.user;
    console.log("Logged in as:", currentUser.email);
    updateUIForLoggedIn(currentUser); // UI切り替え
    loadBooks(); // ログイン後に読み込む
  } else {
    // ログアウトしている
    currentUser = null;
    console.log("Logged out");
    updateUIForLoggedOut(); // UI切り替え
    books = []; // リストを空にする
    // index.html以外ならログイン画面へ移動
    if (window.location.pathname.includes('list.html') || window.location.pathname.includes('search.html')) {
        window.location.href = "login.html";
    }
  }
});

// --- UI切り替え用の関数 ---

// ログイン後のUI調整
function updateUIForLoggedIn(user) {
    const nav = document.querySelector("header nav");
    if (nav) {
        nav.style.display = "flex"; // ナビゲーションを表示
        // ログアウトボタンを追加
        if (!document.getElementById("signoutNav")) {
            const signoutNav = document.createElement("a");
            signoutNav.id = "signoutNav";
            signoutNav.href = "#";
            signoutNav.textContent = `👋 ${user.email} (ログアウト)`;
            signoutNav.onclick = signOut;
            nav.appendChild(signoutNav);
        }
    }

    // index.htmlのメッセージ
    const welcomeMsg = document.getElementById("welcome-message");
    if (welcomeMsg) {
      welcomeMsg.innerHTML = `ようこそ、${user.email}さん！<br>上のメニューから機能を選択してください。`;
    }
}

// ログアウト後のUI調整
function updateUIForLoggedOut() {
    const nav = document.querySelector("header nav");
    if (nav) {
        nav.style.display = "none"; // ナビゲーションを隠す
    }
    // index.htmlのメッセージ
    const welcomeMsg = document.getElementById("welcome-message");
    if (welcomeMsg) {
        welcomeMsg.innerHTML = `最初に <a href="login.html">ログイン / 新規登録</a> してください。<br>ログインすると、プライベートなリストを管理できます。`;
    }
}

// --- 既存の関数を修正 ---

// ✅ saveBooks: localStorageへの保存は削除 (SupabaseのDBに保存されるため)
function saveBooks() {
    // 削除
}

// ✅ loadBooks: ログインユーザーの本だけを読み込む
async function loadBooks() {
    if (!currentUser) return; // ログインしていなければ読み込まない

    const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq('user_id', currentUser.id); // 💡 user_id でフィルター

    if (error) {
        console.error(error);
        return;
    }

    books = data;
    displayBooks();
}

// setRating関数の定義
function setRating(rating) {
  // currentRatingの更新、UIの星の表示切り替えなど
}

// ✅ addBook: user_idを追加して登録
async function addBook() {
    if (!currentUser) return; // ログインしていなければ登録しない

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    // 他の入力項目の値も取得

    if (title === "") return;

    await supabase
    .from("books")
    .insert({
        title: title,
        author: author,
        // rating, purchased, read など他の項目
        user_id: currentUser.id // 💡 ログインユーザーのIDを追加
    });

    await loadBooks();
    // フォームのクリア
}

// addRakutenBook 
async function addRakutenBook(info) {
    if (!currentUser) return;

    await supabase
    .from("books")
    .insert({
        title: info.title,
        author: info.author,
        image: info.largeImageUrl,
        rating: 0,
        purchased: false,
        read: false,
        user_id: currentUser.id // 💡 user_idを追加
    });

    await loadBooks();
}

// changeRating
function changeRating(index, rating) {
    if (!currentUser) return;
    // books[index].rating = rating; など
    // saveBooks()を呼ばないように
    displayBooks();
}

// deleteBook
async function deleteBook(index) {
    if (!currentUser) return;
    // books.splice(index, 1);
    // saveBooks()を呼ばないように
    displayBooks();
}

// togglePurchased
function togglePurchased(index) {
    if (!currentUser) return;
    // books[index].purchased = !books[index].purchased;
    // saveBooks()を呼ばないように
    displayBooks();
}

// toggleRead
function toggleRead(index) {
    if (!currentUser) return;
    // books[index].read = !books[index].read;
    // saveBooks()を呼ばないように
    displayBooks();
}

// openSettings, closeSettings, displayBooks... 中身は適宜

// searchBook, displaySearchResult...

// switchTab...

// window.xxx への公開
window.searchBook = searchBook;
window.addBook = addBook;
window.deleteBook = deleteBook;
window.changeRating = changeRating;
window.togglePurchased = togglePurchased;
window.toggleRead = toggleRead;
window.switchTab = switchTab; 
window.displayBooks = displayBooks;
window.signOut = signOut; // 💡 公開