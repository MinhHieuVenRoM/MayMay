const firebaseConfig = {
  apiKey:            "AIzaSyD5MgP5qusHNtTPGzyDg7Dh6OpuMPsPOVk",
  authDomain:        "thoinoimay.firebaseapp.com",
  projectId:         "thoinoimay",
  storageBucket:     "thoinoimay.firebasestorage.app",
  messagingSenderId: "531993389281",
  appId:             "1:531993389281:web:7fcfc4f59f5bfac6e4afa0"
};

firebase.initializeApp(firebaseConfig);
const db  = firebase.firestore();
const col = db.collection("wishes");

/* ---- Load lời chúc ---- */
async function loadWishes() {
  const list = document.getElementById("gbList");
  try {
    const snap = await col.orderBy("createdAt", "desc").get();
    if (snap.empty) {
      list.innerHTML = '<p class="gb-empty">Chưa có lời chúc nào. Hãy là người đầu tiên! 💌</p>';
      return;
    }
    list.innerHTML = "";
    snap.forEach(doc => {
      const d = doc.data();
      const card = document.createElement("div");
      card.className = "gb-card";
      const date = d.createdAt
        ? d.createdAt.toDate().toLocaleDateString("vi-VN")
        : "";
      card.innerHTML = `
        <p class="gb-card-msg">"${escHtml(d.msg)}"</p>
        <div class="gb-card-footer">
          <span class="gb-card-name">— ${escHtml(d.name)}</span>
          <span class="gb-card-date">${date}</span>
        </div>`;
      list.appendChild(card);
    });
  } catch (e) {
    list.innerHTML = '<p class="gb-empty">Không thể tải lời chúc.</p>';
    console.error(e);
  }
}

/* ---- Gửi lời chúc ---- */
document.getElementById("gbForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name   = document.getElementById("gbName").value.trim();
  const msg    = document.getElementById("gbMsg").value.trim();
  const btn    = document.getElementById("gbSubmit");
  const status = document.getElementById("gbStatus");

  if (!name || !msg) return;

  btn.disabled    = true;
  btn.textContent = "Đang gửi…";
  status.textContent = "";

  try {
    await col.add({ name, msg, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    document.getElementById("gbName").value = "";
    document.getElementById("gbMsg").value  = "";
    status.textContent = "Đã gửi lời chúc! Cảm ơn bạn 💕";
    status.className   = "gb-status success";
    await loadWishes();
  } catch (err) {
    status.textContent = "Gửi thất bại, thử lại nhé.";
    status.className   = "gb-status error";
    console.error(err);
  } finally {
    btn.disabled    = false;
    btn.textContent = "Gửi lời chúc ☁️";
  }
});

function escHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

loadWishes();
