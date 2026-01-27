// Database user untuk login - username menggunakan NIP atau nama (untuk yang tidak punya NIP)
const USERS = [
  {
    username: "MUHAMAD IKSAN SUTISNA",
    password: "Citaleus2",
    role: "admin",
    nama: "MUHAMAD IKSAN SUTISNA"
  },
  {
    username: "196910232005012004",
    password: "Citaleus2",
    role: "user",
    nama: "IDA RIDAWATI, S.Pd"
  },
  {
    username: "198704202022211004",
    password: "Citaleus2",
    role: "user",
    nama: "BAMBANG IRAWAN, S.Pd"
  },
  {
    username: "198412022022212001",
    password: "Citaleus2",
    role: "user",
    nama: "DARA MUTIARA LESTARI, S.Pd"
  },
  {
    username: "198005242022212002",
    password: "Citaleus2",
    role: "user",
    nama: "ILIS SUARSIH, S.Pd"
  },
  {
    username: "198201202025212006",
    password: "Citaleus2",
    role: "user",
    nama: "RITA MULYAWATI, S.Pd"
  },
  {
    username: "196808172023211001",
    password: "Citaleus2",
    role: "user",
    nama: "SUHERMAN, S.Pd.I"
  },
  {
    username: "196707202008012005",
    password: "Citaleus2",
    role: "user",
    nama: "TITI SUWATI, S.Pd"
  },
  {
    username: "199502012025211097",
    password: "Citaleus2",
    role: "user",
    nama: "TINO SANDRI HENDRIYANA PIRMANSYAH, S.Pd"
  },
  {
    username: "SRI OKTAVIANI",
    password: "Citaleus2",
    role: "user",
    nama: "SRI OKTAVIANI, S.Pd"
  },
  {
    username: "197805202025211080",
    password: "Citaleus2",
    role: "user",
    nama: "JOJO SUKARJA"
  }
];

// Fungsi login
function login() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  const err = document.getElementById("loginError");
  const card = document.querySelector(".login-card");

  // Cari user di database
  const user = USERS.find(x => x.username === u && x.password === p);

  // Jika user tidak ditemukan
  if (!user) {
    err.style.display = "block";
    card.classList.add("error");
    setTimeout(() => card.classList.remove("error"), 1000);
    return;
  }

  // User ditemukan - simpan ke localStorage dan redirect
  err.style.display = "none";
  localStorage.setItem("loginUser", JSON.stringify({
    username: user.username,
    role: user.role,
    nama: user.nama
  }));

  // Redirect sesuai role
  if (user.role === "admin") {
    location.href = "admin.html";
  } else {
    location.href = "outgtk.html";
  }
}
