// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiz7l9RlAWn7etwuERmJeXAtLcnwjdrLA",
  authDomain: "anivault-9813c.firebaseapp.com",
  projectId: "anivault-9813c",
  storageBucket: "anivault-9813c.firebasestorage.app",
  messagingSenderId: "402464470619",
  appId: "1:402464470619:web:55c1a5455f377bb359317e"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// State Management
let currentUser = localStorage.getItem('anivult_remembered_user');
let usersDB = {};
let allUsersLists = {}; // To store everyone's list for social features

// Extended Working Avatars (Using Anilist CDN for reliable hotlinking)
const animeAvatarCategories = {
    "Shonen Legends": [
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb40-qx20f5uWvJ8U.png&w=200&h=200&fit=cover&output=webp", name: "Luffy" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb62-nluA6tNlOQEI.png&w=200&h=200&fit=cover&output=webp", name: "Zoro" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb17-81Q1y0280sV7.png&w=200&h=200&fit=cover&output=webp", name: "Naruto" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb1-dVgdEfJt3ozR.png&w=200&h=200&fit=cover&output=webp", name: "Goku" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb27-L1d3h65p7K8A.png&w=200&h=200&fit=cover&output=webp", name: "Killua" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb11-R2D2Kx6uL3qg.png&w=200&h=200&fit=cover&output=webp", name: "Edward Elric" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb30-ZGiPIE6GQY3N.png&w=200&h=200&fit=cover&output=webp", name: "Ichigo" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb72-vJA9D7DzANTn.png&w=200&h=200&fit=cover&output=webp", name: "Natsu" }
    ],
    "Dark & Serious": [
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb45627-1KqSntI4kXfA.png&w=200&h=200&fit=cover&output=webp", name: "Levi" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb85-gDXXr92U2Irt.png&w=200&h=200&fit=cover&output=webp", name: "Kakashi" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb71-sBf1j1L92g42.png&w=200&h=200&fit=cover&output=webp", name: "Light Yagami" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb88-bKCkQv52MuUB.png&w=200&h=200&fit=cover&output=webp", name: "Itachi" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb417-puDGvuGT7RB6.png&w=200&h=200&fit=cover&output=webp", name: "Kaneki" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb118737-M3tHfDJF6Hpd.jpg&w=200&h=200&fit=cover&output=webp", name: "Eren" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb56986-fzL5VRFiVImW.png&w=200&h=200&fit=cover&output=webp", name: "Madara" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb74-vT5FhVXWVD64.png&w=200&h=200&fit=cover&output=webp", name: "L Lawliet" }
    ],
    "Demon Slayer": [
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb126071-0A861lB7Qp05.png&w=200&h=200&fit=cover&output=webp", name: "Tanjiro" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127518-nJ1Q9IerM3y6.jpg&w=200&h=200&fit=cover&output=webp", name: "Nezuko" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb128336-1eH83nNqfV70.jpg&w=200&h=200&fit=cover&output=webp", name: "Gojo" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127540-D9YIyvJfWHIX.png&w=200&h=200&fit=cover&output=webp", name: "Zenitsu" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127541-2m7cCrFhqxMH.png&w=200&h=200&fit=cover&output=webp", name: "Inosuke" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127542-mBq2gFZQnvhQ.png&w=200&h=200&fit=cover&output=webp", name: "Rengoku" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb147421-tCWoTu9HPVBH.png&w=200&h=200&fit=cover&output=webp", name: "Douma" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127561-8P0cFHAqioC0.png&w=200&h=200&fit=cover&output=webp", name: "Shinobu" }
    ],
    "Iconic Girls": [
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb13701-vEVbKByGv6bD.png&w=200&h=200&fit=cover&output=webp", name: "Mikasa" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb20-lIcHoKHHDKsh.png&w=200&h=200&fit=cover&output=webp", name: "Hinata" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb120792-cg1Gn3bfKwz7.jpg&w=200&h=200&fit=cover&output=webp", name: "Yor Forger" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb114737-IHLJEXBjm42m.png&w=200&h=200&fit=cover&output=webp", name: "Zero Two" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb116281-IFxy8s6De60R.png&w=200&h=200&fit=cover&output=webp", name: "Raphtalia" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb100811-2OZKfEpFkiX6.png&w=200&h=200&fit=cover&output=webp", name: "Rem" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb79067-Vc2RiGb6B8dL.png&w=200&h=200&fit=cover&output=webp", name: "Asuna" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb36511-Q02kCk2rYZLf.png&w=200&h=200&fit=cover&output=webp", name: "Erza" }
    ],
    "Jujutsu Kaisen": [
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127505-K6q0Z3PLUVLT.png&w=200&h=200&fit=cover&output=webp", name: "Yuji Itadori" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127506-ux5S3xWTGyrT.png&w=200&h=200&fit=cover&output=webp", name: "Megumi Fushiguro" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127507-mjnsBGXQI3SZ.png&w=200&h=200&fit=cover&output=webp", name: "Nobara" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb128509-0fLjJbqPTbFX.jpg&w=200&h=200&fit=cover&output=webp", name: "Ryomen Sukuna" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127508-vwuXQqMaRY8K.png&w=200&h=200&fit=cover&output=webp", name: "Nanami" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127509-E3o6DXIxZkRd.jpg&w=200&h=200&fit=cover&output=webp", name: "Toge Inumaki" }
    ],
    "Classic & Retro": [
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb3-4z5CSFHkgIam.png&w=200&h=200&fit=cover&output=webp", name: "Spike Spiegel" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb5-JbJBzLBY8ZXg.png&w=200&h=200&fit=cover&output=webp", name: "Vash" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb70-MiGEp8P8Izf3.png&w=200&h=200&fit=cover&output=webp", name: "Yusuke Urameshi" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb32-ZpMPjzGFxYUt.png&w=200&h=200&fit=cover&output=webp", name: "Inuyasha" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb55-YiLNUqeRH9mN.png&w=200&h=200&fit=cover&output=webp", name: "Roy Mustang" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb31-iicLIXHoIBWD.png&w=200&h=200&fit=cover&output=webp", name: "Vegeta" }
    ]
};

const animeAvatars = Object.values(animeAvatarCategories).flat().map(a => a.url);

// ===== WALLPAPER THEMES =====
const wallpaperThemes = [
    { id: 'particles', name: 'Void Particles', icon: '✨', desc: 'Purple & pink floating constellation' },
    { id: 'sakura', name: 'Sakura Storm', icon: '🌸', desc: 'Falling cherry blossom petals' },
    { id: 'matrix', name: 'Digital Rain', icon: '💻', desc: 'Green matrix-style code rain' },
    { id: 'aurora', name: 'Aurora Wave', icon: '🌌', desc: 'Flowing northern lights colors' },
    { id: 'fire', name: 'Soul Flame', icon: '🔥', desc: 'Rising fire embers and sparks' },
    { id: 'ocean', name: 'Dark Ocean', icon: '🌊', desc: 'Deep ocean waves rippling' }
];

let activeWallpaper = localStorage.getItem('anivault_wallpaper') || 'particles';
let wallpaperAnimFrame = null;

// Built-in curated popular anime ensuring instant content even if external APIs are down
const curatedAnimeList = [
  {
    "id": 16498,
    "mal_id": 16498,
    "title": "Attack on Titan",
    "title_japanese": "進撃の巨人",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-buvcRTBx4NSm.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-buvcRTBx4NSm.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-buvcRTBx4NSm.jpg"
      }
    },
    "score": "8.5",
    "year": 2013,
    "type": "TV",
    "episodes": 25,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Drama"
      },
      {
        "name": "Fantasy"
      },
      {
        "name": "Mystery"
      }
    ],
    "synopsis": "Several hundred years ago, humans were nearly exterminated by titans. Titans are typically several stories tall, seem to have no intelligence, devour human beings and, worst of all, seem to do it for the pleasure rather than as a food source. A small percentage of humanity survived by walling themse..."
  },
  {
    "id": 38000,
    "mal_id": 38000,
    "title": "Demon Slayer: Kimetsu no Yaiba",
    "title_japanese": "鬼滅の刃",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101922-WBsBl0ClmgYL.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101922-WBsBl0ClmgYL.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-WBsBl0ClmgYL.jpg"
      }
    },
    "score": "8.2",
    "year": 2019,
    "type": "TV",
    "episodes": 26,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Adventure"
      },
      {
        "name": "Drama"
      },
      {
        "name": "Fantasy"
      },
      {
        "name": "Supernatural"
      }
    ],
    "synopsis": "It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself. Though devastated by this grim reality, Tanjiro resol..."
  },
  {
    "id": 40748,
    "mal_id": 40748,
    "title": "JUJUTSU KAISEN",
    "title_japanese": "呪術廻戦",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113415-LHBAeoZDIsnF.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113415-LHBAeoZDIsnF.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-LHBAeoZDIsnF.jpg"
      }
    },
    "score": "8.4",
    "year": 2020,
    "type": "TV",
    "episodes": 24,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Drama"
      },
      {
        "name": "Supernatural"
      }
    ],
    "synopsis": "A boy fights... for \"the right death.\" Hardship, regret, shame: the negative feelings that humans feel become Curses that lurk in our everyday lives. The Curses run rampant throughout the world, capable of leading people to terrible misfortune and even death. What's more, the Curses can only be exor..."
  },
  {
    "id": 1535,
    "mal_id": 1535,
    "title": "Death Note",
    "title_japanese": "DEATH NOTE",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1535-kUgkcrfOrkUM.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1535-kUgkcrfOrkUM.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-kUgkcrfOrkUM.jpg"
      }
    },
    "score": "8.4",
    "year": 2006,
    "type": "TV",
    "episodes": 37,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Mystery"
      },
      {
        "name": "Psychological"
      },
      {
        "name": "Supernatural"
      },
      {
        "name": "Thriller"
      }
    ],
    "synopsis": "Light Yagami is a genius high school student who is about to learn about life through a book of death. When a bored shinigami, a God of Death, named Ryuk drops a black notepad called a Death Note, Light receives power over life and death with the stroke of a pen. Determined to use this dark gift for..."
  },
  {
    "id": 31964,
    "mal_id": 31964,
    "title": "My Hero Academia",
    "title_japanese": "僕のヒーローアカデミア",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21459-nYh85uj2Fuwr.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21459-nYh85uj2Fuwr.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21459-nYh85uj2Fuwr.jpg"
      }
    },
    "score": "7.6",
    "year": 2016,
    "type": "TV",
    "episodes": 13,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Adventure"
      },
      {
        "name": "Comedy"
      }
    ],
    "synopsis": "What would the world be like if 80 percent of the population manifested extraordinary superpowers called “Quirks” at age four? Heroes and villains would be battling it out everywhere! Becoming a hero would mean learning to use your power, but where would you go to study? U.A. High's Hero Program of ..."
  },
  {
    "id": 11061,
    "mal_id": 11061,
    "title": "Hunter x Hunter (2011)",
    "title_japanese": "HUNTER×HUNTER (2011)",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11061-y5gsT1hoHuHw.png",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11061-y5gsT1hoHuHw.png",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061-y5gsT1hoHuHw.png"
      }
    },
    "score": "8.9",
    "year": 2011,
    "type": "TV",
    "episodes": 148,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Adventure"
      },
      {
        "name": "Fantasy"
      }
    ],
    "synopsis": "A Hunter is one who travels the world doing all sorts of dangerous tasks. From capturing criminals to searching deep within uncharted lands for any lost treasures. Gon is a young boy whose father disappeared long ago, being a Hunter. He believes if he could also follow his father's path, he could on..."
  },
  {
    "id": 30276,
    "mal_id": 30276,
    "title": "One-Punch Man",
    "title_japanese": "ワンパンマン",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21087-B5DHjqZ3kW4b.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21087-B5DHjqZ3kW4b.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21087-B5DHjqZ3kW4b.jpg"
      }
    },
    "score": "8.2",
    "year": 2015,
    "type": "TV",
    "episodes": 12,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Comedy"
      },
      {
        "name": "Sci-Fi"
      },
      {
        "name": "Supernatural"
      }
    ],
    "synopsis": "Saitama has a rather peculiar hobby, being a superhero, but despite his heroic deeds and superhuman abilities, a shadow looms over his life. He's become much too powerful, to the point that every opponent ends up defeated with a single punch. The lack of challenge has driven him into a state of apat..."
  },
  {
    "id": 21,
    "mal_id": 21,
    "title": "ONE PIECE",
    "title_japanese": "ONE PIECE",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21-ELSYx3yMPcKM.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21-ELSYx3yMPcKM.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-ELSYx3yMPcKM.jpg"
      }
    },
    "score": "8.7",
    "year": 1999,
    "type": "TV",
    "episodes": 24,
    "status": "RELEASING",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Adventure"
      },
      {
        "name": "Comedy"
      },
      {
        "name": "Drama"
      },
      {
        "name": "Fantasy"
      }
    ],
    "synopsis": "Gold Roger was known as the Pirate King, the strongest and most infamous being to have sailed the Grand Line. The capture and death of Roger by the World Government brought a change throughout the world. His last words before his death revealed the location of the greatest treasure in the world, One..."
  },
  {
    "id": 22319,
    "mal_id": 22319,
    "title": "Tokyo Ghoul",
    "title_japanese": "東京喰種 トーキョーグール",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b20605-k665mVkSug8D.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b20605-k665mVkSug8D.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b20605-k665mVkSug8D.jpg"
      }
    },
    "score": "7.6",
    "year": 2014,
    "type": "TV",
    "episodes": 12,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Drama"
      },
      {
        "name": "Horror"
      },
      {
        "name": "Mystery"
      },
      {
        "name": "Psychological"
      },
      {
        "name": "Supernatural"
      }
    ],
    "synopsis": "The suspense horror/dark fantasy story is set in Tokyo, which is haunted by mysterious \"ghouls\" who are devouring humans. People are gripped by the fear of these ghouls whose identities are masked in mystery. An ordinary college student named Kaneki encounters Rize, a girl who is an avid reader like..."
  },
  {
    "id": 25777,
    "mal_id": 25777,
    "title": "Attack on Titan Season 2",
    "title_japanese": "進撃の巨人 Season２",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20958-HuFJyr54Mmir.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20958-HuFJyr54Mmir.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20958-HuFJyr54Mmir.jpg"
      }
    },
    "score": "8.5",
    "year": 2017,
    "type": "TV",
    "episodes": 12,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Drama"
      },
      {
        "name": "Fantasy"
      },
      {
        "name": "Mystery"
      }
    ],
    "synopsis": "Eren Jaeger swore to wipe out every last Titan, but in a battle for his life he wound up becoming the thing he hates most. With his new powers, he fights for humanity's freedom facing the monsters that threaten his home. After a bittersweet victory against the Female Titan, Eren finds no time to res..."
  },
  {
    "id": 5114,
    "mal_id": 5114,
    "title": "Fullmetal Alchemist: Brotherhood",
    "title_japanese": "鋼の錬金術師 FULLMETAL ALCHEMIST",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx5114-nSWCgQlmOMtj.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx5114-nSWCgQlmOMtj.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-nSWCgQlmOMtj.jpg"
      }
    },
    "score": "9.0",
    "year": 2009,
    "type": "TV",
    "episodes": 64,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Adventure"
      },
      {
        "name": "Drama"
      },
      {
        "name": "Fantasy"
      }
    ],
    "synopsis": "\"In order for something to be obtained, something of equal value must be lost.\" Alchemy is bound by this Law of Equivalent Exchange—something the young brothers Edward and Alphonse Elric only realize after attempting human transmutation: the one forbidden act of alchemy. They pay a terrible price fo..."
  },
  {
    "id": 20,
    "mal_id": 20,
    "title": "Naruto",
    "title_japanese": "NARUTO -ナルト-",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20-dE6UHbFFg1A5.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20-dE6UHbFFg1A5.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-dE6UHbFFg1A5.jpg"
      }
    },
    "score": "8.0",
    "year": 2002,
    "type": "TV",
    "episodes": 220,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Adventure"
      },
      {
        "name": "Comedy"
      },
      {
        "name": "Drama"
      },
      {
        "name": "Fantasy"
      },
      {
        "name": "Supernatural"
      }
    ],
    "synopsis": "Naruto Uzumaki, a hyperactive and knuckle-headed ninja, lives in Konohagakure, the Hidden Leaf village. Moments prior to his birth, a huge demon known as the Kyuubi, the Nine-tailed Fox, attacked Konohagakure and wreaked havoc. In order to put an end to the Kyuubi's rampage, the leader of the villag..."
  },
  {
    "id": 11757,
    "mal_id": 11757,
    "title": "Sword Art Online",
    "title_japanese": "ソードアート・オンライン",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11757-SxYDUzdr9rh2.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11757-SxYDUzdr9rh2.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11757-SxYDUzdr9rh2.jpg"
      }
    },
    "score": "7.0",
    "year": 2012,
    "type": "TV",
    "episodes": 25,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Adventure"
      },
      {
        "name": "Fantasy"
      },
      {
        "name": "Romance"
      }
    ],
    "synopsis": "In the near future, a Virtual Reality Massive Multiplayer Online Role-Playing Game (VRMMORPG) called Sword Art Online has been released where players control their avatars with their bodies using a piece of technology called Nerve Gear. One day, players discover they cannot log out, as the game crea..."
  },
  {
    "id": 28851,
    "mal_id": 28851,
    "title": "A Silent Voice",
    "title_japanese": "聲の形",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20954-sYRfE5jQRtSB.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20954-sYRfE5jQRtSB.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20954-sYRfE5jQRtSB.jpg"
      }
    },
    "score": "8.8",
    "year": 2016,
    "type": "MOVIE",
    "episodes": 1,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Drama"
      },
      {
        "name": "Romance"
      },
      {
        "name": "Slice of Life"
      }
    ],
    "synopsis": "After transferring into a new school, a deaf girl, Shouko Nishimiya, is bullied by the popular Shouya Ishida. As Shouya continues to bully Shouko, the class turns its back on him. Shouko transfers and Shouya grows up as an outcast. Alone and depressed, the regretful Shouya finds Shouko to make amend..."
  },
  {
    "id": 32281,
    "mal_id": 32281,
    "title": "Your Name.",
    "title_japanese": "君の名は。",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21519-SUo3ZQuCbYhJ.png",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21519-SUo3ZQuCbYhJ.png",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21519-SUo3ZQuCbYhJ.png"
      }
    },
    "score": "8.5",
    "year": 2016,
    "type": "MOVIE",
    "episodes": 1,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Drama"
      },
      {
        "name": "Romance"
      },
      {
        "name": "Supernatural"
      }
    ],
    "synopsis": "Mitsuha Miyamizu, a high school girl, yearns to live the life of a boy in the bustling city of Tokyo—a dream that stands in stark contrast to her present life in the countryside. Meanwhile in the city, Taki Tachibana lives a busy life as a high school student while juggling his part-time job and hop..."
  },
  {
    "id": 35760,
    "mal_id": 35760,
    "title": "Attack on Titan Season 3",
    "title_japanese": "進撃の巨人 Season３",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx99147-AiPDD8cwlCfi.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx99147-AiPDD8cwlCfi.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx99147-AiPDD8cwlCfi.jpg"
      }
    },
    "score": "8.6",
    "year": 2018,
    "type": "TV",
    "episodes": 12,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Drama"
      },
      {
        "name": "Fantasy"
      },
      {
        "name": "Mystery"
      }
    ],
    "synopsis": "Eren and his companions in the 104th are assigned to the newly-formed Levi Squad, whose assignment is to keep Eren and Historia safe given Eren's newly-discovered power and Historia's knowledge and pedigree. Levi and Erwin have good reason to be concerned, because the priest of the Church that Hanji..."
  },
  {
    "id": 33486,
    "mal_id": 33486,
    "title": "My Hero Academia Season 2",
    "title_japanese": "僕のヒーローアカデミア２",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21856-gutauxhWAwn6.png",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21856-gutauxhWAwn6.png",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21856-gutauxhWAwn6.png"
      }
    },
    "score": "7.9",
    "year": 2017,
    "type": "TV",
    "episodes": 25,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Adventure"
      },
      {
        "name": "Comedy"
      }
    ],
    "synopsis": "Taking off right after the last episode of the first season. The school is temporarily closed due to security. When U.A. restarts, it is announced that the highly anticipated School Sports Festival will soon be taking place. All classes: Hero, Support, General and Business will be participating. Tou..."
  },
  {
    "id": 40028,
    "mal_id": 40028,
    "title": "Attack on Titan Final Season",
    "title_japanese": "進撃の巨人 The Final Season",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx110277-sKUNXAsWMNFw.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx110277-sKUNXAsWMNFw.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx110277-sKUNXAsWMNFw.jpg"
      }
    },
    "score": "8.7",
    "year": 2021,
    "type": "TV",
    "episodes": 16,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Drama"
      },
      {
        "name": "Fantasy"
      },
      {
        "name": "Mystery"
      }
    ],
    "synopsis": "It’s been four years since the Scout Regiment reached the shoreline, and the world looks different now. Things are heating up as the fate of the Scout Regiment—and the people of Paradis—are determined at last. However, Eren is missing. Will he reappear before age-old tensions between Marleyans and E..."
  },
  {
    "id": 44511,
    "mal_id": 44511,
    "title": "Chainsaw Man",
    "title_japanese": "チェンソーマン",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx127230-DdP4vAdssLoz.png",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx127230-DdP4vAdssLoz.png",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-DdP4vAdssLoz.png"
      }
    },
    "score": "8.3",
    "year": 2022,
    "type": "TV",
    "episodes": 12,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Drama"
      },
      {
        "name": "Horror"
      },
      {
        "name": "Supernatural"
      }
    ],
    "synopsis": "Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil corpses with Pochita. One day, Denji is betrayed and killed. As his consciousness fades, he makes a contract wi..."
  },
  {
    "id": 37779,
    "mal_id": 37779,
    "title": "The Promised Neverland",
    "title_japanese": "約束のネバーランド",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101759-8UR7r9MNVpz2.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101759-8UR7r9MNVpz2.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101759-8UR7r9MNVpz2.jpg"
      }
    },
    "score": "8.3",
    "year": 2019,
    "type": "TV",
    "episodes": 12,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Drama"
      },
      {
        "name": "Fantasy"
      },
      {
        "name": "Horror"
      },
      {
        "name": "Mystery"
      },
      {
        "name": "Psychological"
      },
      {
        "name": "Thriller"
      }
    ],
    "synopsis": "Emma, Norman and Ray are the brightest kids at the Grace Field House orphanage. And under the care of the woman they refer to as “Mom,” all the kids have enjoyed a comfortable life. Good food, clean clothes and the perfect environment to learn—what more could an orphan ask for? One day, though, Emma..."
  },
  {
    "id": 24833,
    "mal_id": 24833,
    "title": "Assassination Classroom",
    "title_japanese": "暗殺教室",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20755-dWrhs569YGUO.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20755-dWrhs569YGUO.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20755-dWrhs569YGUO.jpg"
      }
    },
    "score": "7.9",
    "year": 2015,
    "type": "TV",
    "episodes": 22,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Comedy"
      },
      {
        "name": "Drama"
      },
      {
        "name": "Supernatural"
      }
    ],
    "synopsis": "The students of class 3-E have a mission: kill their teacher before graduation. He has already destroyed the moon, and has promised to destroy the Earth if he can not be killed within a year. But how can this class of misfits kill a tentacled monster, capable of reaching Mach 20 speed, who may be th..."
  },
  {
    "id": 32182,
    "mal_id": 32182,
    "title": "Mob Psycho 100",
    "title_japanese": "モブサイコ100",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21507-6YUSbh2m0N1p.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21507-6YUSbh2m0N1p.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21507-6YUSbh2m0N1p.jpg"
      }
    },
    "score": "8.4",
    "year": 2016,
    "type": "TV",
    "episodes": 12,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Comedy"
      },
      {
        "name": "Drama"
      },
      {
        "name": "Psychological"
      },
      {
        "name": "Slice of Life"
      },
      {
        "name": "Supernatural"
      }
    ],
    "synopsis": "The story revolves around \"Mob,\" a boy who will explode if his emotional capacity reaches 100%. This boy with psychic powers earned his nickname \"Mob\" because he does not stand out among other people. He keeps his psychic powers bottled up so he can live normally, but if his emotional level reaches ..."
  },
  {
    "id": 31240,
    "mal_id": 31240,
    "title": "Re:ZERO -Starting Life in Another World-",
    "title_japanese": "Re:ゼロから始める異世界生活",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21355-wRVUrGxpvIQQ.jpg",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21355-wRVUrGxpvIQQ.jpg",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21355-wRVUrGxpvIQQ.jpg"
      }
    },
    "score": "8.1",
    "year": 2016,
    "type": "TV",
    "episodes": 25,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Action"
      },
      {
        "name": "Adventure"
      },
      {
        "name": "Drama"
      },
      {
        "name": "Fantasy"
      },
      {
        "name": "Psychological"
      },
      {
        "name": "Romance"
      },
      {
        "name": "Thriller"
      }
    ],
    "synopsis": "In the story, Subaru Natsuki is an ordinary high school student who is lost in an alternate world, where he is rescued by a beautiful, silver-haired girl. He stays near her to return the favor, but the destiny she is burdened with is more than Subaru can imagine. Enemies attack one by one, and both ..."
  },
  {
    "id": 23273,
    "mal_id": 23273,
    "title": "Your lie in April",
    "title_japanese": "四月は君の嘘",
    "imageUrl": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20665-TLgkL8T8IRFd.png",
    "images": {
      "jpg": {
        "image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20665-TLgkL8T8IRFd.png",
        "large_image_url": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20665-TLgkL8T8IRFd.png"
      }
    },
    "score": "8.4",
    "year": 2014,
    "type": "TV",
    "episodes": 22,
    "status": "FINISHED",
    "genres": [
      {
        "name": "Drama"
      },
      {
        "name": "Music"
      },
      {
        "name": "Romance"
      },
      {
        "name": "Slice of Life"
      }
    ],
    "synopsis": "Piano prodigy Arima Kousei dominated the competition and all child musicians knew his name. But after his mother, who was also his instructor, passed away, he had a mental breakdown while performing at a recital. This resulted in him no longer being able to hear the sound of his piano playing. Two y..."
  }
];

const state = {
    currentUser: currentUser,
    currentView: 'discover',
    searchResults: [],
    myList: []
};

let currentFetchId = 0;
let discoverPage = 1;
let currentGenreId = null;

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchSpinner = document.getElementById('search-spinner');
const viewContent = document.getElementById('view-content');
const navItems = document.querySelectorAll('.nav-item[data-view]');
const modal = document.getElementById('anime-modal');
const closeModal = document.getElementById('close-modal');
const modalBody = document.getElementById('modal-body');

// Drawer DOM
const menuToggle = document.getElementById('menu-toggle');
const closeDrawerBtn = document.getElementById('close-drawer');
const navDrawer = document.getElementById('nav-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const adminNavItem = document.getElementById('admin-nav-item');

// Auth DOM
const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const logoutBtn = document.getElementById('logout-btn');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const submitBtn = document.getElementById('submit-btn');
const loginSubtitle = document.getElementById('login-subtitle');
const loginError = document.getElementById('login-error');
const userProfileBadge = document.getElementById('user-profile-badge');
const guestBtn = document.getElementById('guest-btn');

let isLoginMode = true;

// Utility: Fetch with timeout
async function fetchWithTimeout(url, options = {}, timeoutMs = 3500) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
}

// AniList GraphQL Fetcher (Fast, highly reliable fallback)
async function fetchFromAniList({ page = 1, perPage = 24, genre = null, search = null }) {
    const query = `
    query ($page: Int, $perPage: Int, $genre: String, $search: String) {
        Page(page: $page, perPage: $perPage) {
            media(type: ANIME, sort: POPULARITY_DESC, genre: $genre, search: $search) {
                id
                idMal
                title { english romaji native }
                coverImage { extraLarge large }
                averageScore
                seasonYear
                startDate { year }
                format
                episodes
                status
                genres
                description
            }
        }
    }
    `;
    const variables = { page, perPage };
    if (genre) variables.genre = genre;
    if (search) variables.search = search;

    const res = await fetchWithTimeout('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ query, variables })
    }, 4500);

    if (!res.ok) throw new Error(`AniList HTTP error: ${res.status}`);
    const json = await res.json();
    const media = json.data?.Page?.media || [];
    return media.map(m => ({
        id: m.idMal || m.id,
        mal_id: m.idMal || m.id,
        title: m.title.english || m.title.romaji || 'Unknown Title',
        title_japanese: m.title.native || '',
        images: {
            jpg: {
                image_url: m.coverImage.large,
                large_image_url: m.coverImage.extraLarge || m.coverImage.large
            }
        },
        imageUrl: m.coverImage.large,
        score: m.averageScore ? (m.averageScore / 10).toFixed(1) : 'N/A',
        year: m.seasonYear || m.startDate?.year || 'N/A',
        type: m.format || 'TV',
        episodes: m.episodes || '?',
        status: m.status || 'Finished',
        genres: (m.genres || []).map(g => ({ name: g })),
        synopsis: m.description ? m.description.replace(/<[^>]*>/g, '').replace(/[\r\n]+/g, ' ') : 'No synopsis available.'
    }));
}

async function fetchSingleFromAniList(id) {
    const isNum = Number(id);
    const query = `
    query ($id: Int, $idMal: Int) {
        Media(id: $id, idMal: $idMal, type: ANIME) {
            id
            idMal
            title { english romaji native }
            coverImage { extraLarge large }
            averageScore
            seasonYear
            startDate { year }
            format
            episodes
            status
            genres
            description
        }
    }
    `;
    const variables = isNum > 50000 ? { id: isNum } : { idMal: isNum };
    const res = await fetchWithTimeout('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
    }, 4000);
    if (!res.ok) return null;
    const json = await res.json();
    const m = json.data?.Media;
    if (!m) return null;
    return {
        id: m.idMal || m.id,
        mal_id: m.idMal || m.id,
        title: m.title.english || m.title.romaji || 'Unknown Title',
        title_japanese: m.title.native || '',
        images: {
            jpg: {
                image_url: m.coverImage.large,
                large_image_url: m.coverImage.extraLarge || m.coverImage.large
            }
        },
        imageUrl: m.coverImage.large,
        score: m.averageScore ? (m.averageScore / 10).toFixed(1) : 'N/A',
        year: m.seasonYear || m.startDate?.year || 'N/A',
        type: m.format || 'TV',
        episodes: m.episodes || '?',
        status: m.status || 'Finished',
        genres: (m.genres || []).map(g => ({ name: g })),
        synopsis: m.description ? m.description.replace(/<[^>]*>/g, '').replace(/[\r\n]+/g, ' ') : 'No synopsis available.'
    };
}

function showLoginPrompt(subtitle) {
    if (loginSubtitle) loginSubtitle.textContent = subtitle || 'Sign in to track your anime journey.';
    if (loginOverlay) loginOverlay.classList.remove('hidden');
}

// Initialize Application
async function init() {
    setupBulkListeners();
    setupEventListeners();
    
    // Always render initial Discover view immediately so content appears with 0 delay!
    renderDiscoverView();
    checkAuthStatus();
    
    try {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } catch (e) { console.warn("Persistence error:", e); }
    
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            state.currentUser = user.email;
            localStorage.setItem('anivult_remembered_user', user.email);
            
            await syncAllData();
            
            // Ensure owner and show admin UI
            if (user.email === 'abubakorsiddikpapel@gmail.com') {
                try {
                    const ownerDoc = await db.collection('users').doc(user.email).get();
                    const existingData = ownerDoc.exists ? ownerDoc.data() : {};
                    const needsUpdate = !ownerDoc.exists || existingData.role !== 'owner' || existingData.username !== 'SIDDIK';
                    if (needsUpdate) {
                        await db.collection('users').doc(user.email).set({
                            role: "owner",
                            username: "SIDDIK",
                            avatar: existingData.avatar || animeAvatars[3],
                            joinDate: existingData.joinDate || new Date().toISOString()
                        }, { merge: true });
                    }
                    usersDB[user.email] = usersDB[user.email] || {};
                    usersDB[user.email].role = 'owner';
                    usersDB[user.email].username = 'SIDDIK';
                    usersDB[user.email].avatar = usersDB[user.email].avatar || existingData.avatar || animeAvatars[3];
                    // Reveal admin navigation item for the owner
                    const adminNav = document.getElementById('admin-nav-item');
                    if (adminNav) adminNav.classList.remove('hidden');
                } catch(e) { console.error('Owner init error:', e); }
            }
            
            checkAuthStatus();
            // Refresh grid cards to reflect list status badges
            const grid = document.getElementById('anime-grid');
            if (grid && currentGridAnime.length > 0) renderGrid(currentGridAnime, grid);
        } else {
            state.currentUser = null;
            state.myList = [];
            localStorage.removeItem('anivult_remembered_user');
            checkAuthStatus();
            const grid = document.getElementById('anime-grid');
            if (grid && currentGridAnime.length > 0) renderGrid(currentGridAnime, grid);
        }
    });
}

async function syncAllData() {
    try {
        const usersSnap = await db.collection('users').get();
        usersSnap.forEach(doc => { usersDB[doc.id] = doc.data(); });
        
        // Ensure owner identity for abubakorsiddikpapel@gmail.com
        const ownerEmail = 'abubakorsiddikpapel@gmail.com';
        if (usersDB[ownerEmail]) {
            usersDB[ownerEmail].role = 'owner';
            if (!usersDB[ownerEmail].username || usersDB[ownerEmail].username === 'Papel') {
                usersDB[ownerEmail].username = 'SIDDIK';
            }
        }
        
        const listsSnap = await db.collection('lists').get();
        listsSnap.forEach(doc => { allUsersLists[doc.id] = doc.data().items || []; });
        
        if (state.currentUser && allUsersLists[state.currentUser]) {
            state.myList = allUsersLists[state.currentUser];
            try { localStorage.setItem('anivault_cached_vault', JSON.stringify(state.myList)); } catch(e){}
        } else if (!state.currentUser) {
            try {
                const cached = localStorage.getItem('anivault_cached_vault');
                if (cached) state.myList = JSON.parse(cached);
            } catch(e){}
        } else {
            state.myList = [];
        }
    } catch(err) { console.error("Sync error:", err); }
}

function getBadgeHtml(email) {
    if (!email) return '';
    const userList = allUsersLists[email] || [];
    const watchedCount = userList.filter(item => item.listStatus === 'watched').length;
    if (watchedCount >= 1000) return `<span class="user-badge" style="background: #ff4785; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.6rem; margin-left: 5px; white-space: nowrap;" title="Expert (1000+ Watched)">👑 Expert</span>`;
    if (watchedCount >= 500) return `<span class="user-badge" style="background: #a154f2; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.6rem; margin-left: 5px; white-space: nowrap;" title="Advanced (500+ Watched)">💎 Advanced</span>`;
    if (watchedCount >= 200) return `<span class="user-badge" style="background: #00c3ff; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.6rem; margin-left: 5px; white-space: nowrap;" title="Intermediate (200+ Watched)">🥇 Intermediate</span>`;
    if (watchedCount >= 50) return `<span class="user-badge" style="background: #4CAF50; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.6rem; margin-left: 5px; white-space: nowrap;" title="Elementary (50+ Watched)">🥈 Elementary</span>`;
    if (watchedCount >= 1) return `<span class="user-badge" style="background: #ffb300; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.6rem; margin-left: 5px; white-space: nowrap;" title="Beginner (1+ Watched)">🥉 Beginner</span>`;
    return '';
}

function getEmailFromUsername(username) {
    for (const email in usersDB) {
        if (usersDB[email] && usersDB[email].username === username) return email;
    }
    return null;
}

function checkAuthStatus() {
    renderUserProfile();
    
    // Show Admin Nav if Owner
    const me = state.currentUser ? usersDB[state.currentUser] : null;
    const isOwner = state.currentUser === 'abubakorsiddikpapel@gmail.com' || (me && me.role === 'owner');
    if (isOwner) {
        adminNavItem.classList.remove('hidden');
    } else {
        adminNavItem.classList.add('hidden');
    }

    if (logoutBtn) {
        if (state.currentUser) {
            logoutBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Logout
            `;
        } else {
            logoutBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                Login / Sign Up
            `;
        }
    }
}

function renderUserProfile() {
    if (!state.currentUser) {
        userProfileBadge.classList.remove('hidden');
        userProfileBadge.style.cursor = 'pointer';
        userProfileBadge.innerHTML = `
            <div class="profile-avatar" style="background: rgba(255,255,255,0.1); color: var(--text-muted); font-size: 1rem;">?</div>
            <div class="profile-info">
                <span class="profile-name">Guest User</span>
                <span class="profile-role" style="color: var(--accent-primary); font-size: 0.7rem;">Click to Sign In</span>
            </div>
        `;
        userProfileBadge.onclick = () => {
            showLoginPrompt('Sign in to track your anime journey.');
            closeDrawer();
        };
        return;
    }
    
    userProfileBadge.onclick = null;
    userProfileBadge.style.cursor = 'default';
    userProfileBadge.classList.remove('hidden');
    const userObj = usersDB[state.currentUser] || {};
    const isOwner = state.currentUser === 'abubakorsiddikpapel@gmail.com' || userObj.role === 'owner';
    const displayName = isOwner ? (userObj.username || 'SIDDIK') : (userObj.username || state.currentUser.split('@')[0]);
    const avatarContent = userObj.avatar ? `<img src="${userObj.avatar}" alt="Avatar">` : state.currentUser.charAt(0).toUpperCase();
    
    let roleClass = '';
    if (isOwner) roleClass = 'role-owner';
    else if (userObj.role === 'moderator') roleClass = 'role-moderator';
    else if (userObj.role === 'officer') roleClass = 'role-officer';
    else if (userObj.role === 'celebrity') roleClass = 'role-celebrity';

    userProfileBadge.innerHTML = `
        <div class="profile-avatar">${avatarContent}</div>
        <div class="profile-info">
            <span class="profile-name" title="${state.currentUser}" style="display:flex; align-items:center; gap: 6px;">
                <span>${displayName}</span>
                ${getBadgeHtml(state.currentUser)}
                ${isOwner ? '<span class="owner-tag">👑 Owner</span>' : ''}
            </span>
            <span class="profile-role ${roleClass}">${isOwner ? 'Owner' : (userObj.role || 'Member')}</span>
        </div>
    `;
}

async function handleAuth(email, password) {
    loginError.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = "Loading...";
    
    try {
        if (isLoginMode) {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            emailInput.value = ''; passwordInput.value = '';
            loginOverlay.classList.add('hidden');
            
            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-view="discover"]').classList.add('active');
            state.currentView = 'discover';
            searchInput.value = '';
        } else {
            await firebase.auth().createUserWithEmailAndPassword(email, password);
            const randomAvatar = animeAvatars[Math.floor(Math.random() * animeAvatars.length)];
            const newUserData = { 
                username: email.split('@')[0],
                avatar: randomAvatar,
                role: "member",
                joinDate: new Date().toISOString()
            };
            await db.collection('users').doc(email).set(newUserData);
            
            await firebase.auth().signOut();
            localStorage.removeItem('anivult_remembered_user');
            
            emailInput.value = ''; passwordInput.value = '';
            
            isLoginMode = true;
            tabLogin.classList.add('active'); tabRegister.classList.remove('active');
            submitBtn.textContent = 'Login';
            loginSubtitle.textContent = 'Account created! Please log in.';
            loginError.textContent = '✅ Account created successfully! Please log in.';
            loginError.classList.remove('hidden');
            loginError.style.color = '#4CAF50';
            loginError.style.background = 'rgba(76,175,80,0.1)';
        }
    } catch (error) {
        loginError.textContent = "Error: " + (error.message || "Please try again.");
        loginError.classList.remove('hidden');
        loginError.style.color = '#ff4785';
        loginError.style.background = 'rgba(255, 71, 133, 0.1)';
    } finally {
        submitBtn.disabled = false;
        if(isLoginMode) submitBtn.textContent = 'Login';
    }
}

async function logout() {
    try {
        localStorage.removeItem('anivult_remembered_user');
        await firebase.auth().signOut();
        navDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
    } catch (e) { console.error(e); }
}

async function saveList() {
    try {
        localStorage.setItem('anivault_cached_vault', JSON.stringify(state.myList));
    } catch (e) {}

    if (!state.currentUser) return;
    try {
        await db.collection('lists').doc(state.currentUser).set({ items: state.myList });
        allUsersLists[state.currentUser] = state.myList;
    } catch (e) { console.error("Could not save list:", e); }
}

function closeDrawer() {
    navDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
}

// Event Listeners
function setupEventListeners() {
    menuToggle.addEventListener('click', () => {
        navDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
    });

    closeDrawerBtn.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);

    if (guestBtn) {
        guestBtn.addEventListener('click', () => {
            loginOverlay.classList.add('hidden');
        });
    }

    tabLogin.addEventListener('click', () => {
        isLoginMode = true; tabLogin.classList.add('active'); tabRegister.classList.remove('active');
        submitBtn.textContent = 'Login'; loginSubtitle.textContent = 'Sign in to track your anime journey.';
        loginError.classList.add('hidden');
    });

    tabRegister.addEventListener('click', () => {
        isLoginMode = false; tabRegister.classList.add('active'); tabLogin.classList.remove('active');
        submitBtn.textContent = 'Create Account'; loginSubtitle.textContent = 'Create an account to start tracking.';
        loginError.classList.add('hidden');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        if (email && password) handleAuth(email, password);
    });

    logoutBtn.addEventListener('click', () => {
        if (state.currentUser) {
            logout();
        } else {
            showLoginPrompt('Sign in to track your anime journey.');
            closeDrawer();
        }
    });

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;
            if(!view) return;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            state.currentView = view;
            currentGenreId = null;
            
            if (view === 'discover') renderDiscoverView();
            else if (view === 'chat') {
                if (!state.currentUser) {
                    showLoginPrompt("Please sign in to join the Community Wall!");
                    closeDrawer();
                    return;
                }
                renderChatView();
            }
            else if (view === 'leaderboard') renderLeaderboardView();
            else if (view === 'settings') {
                if (!state.currentUser) {
                    showLoginPrompt("Please sign in to customize your profile!");
                    closeDrawer();
                    return;
                }
                renderPersonalizationView();
            }
            else if (view === 'genres') renderGenresView();
            else if (view === 'admin') renderAdminView();
            else if (view === 'vault') {
                if (!state.currentUser) {
                    showLoginPrompt("Please sign in to view and manage your Anime Vault!");
                    closeDrawer();
                    return;
                }
                renderVaultView();
            }
            else if (view === 'backup') renderBackupView();
            else if (view === 'badges') renderBadgesView();
            
            const bulkPanel = document.getElementById('global-bulk-panel');
            if (bulkPanel) bulkPanel.classList.add('hidden');
            
            closeDrawer();
        });
    });

    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearTimeout(debounceTimer);
        if (query.length < 2) {
            if (query.length === 0 && state.currentView === 'discover') renderDiscoverView();
            return;
        }
        debounceTimer = setTimeout(() => {
            if (state.currentView !== 'discover') {
                navItems.forEach(nav => nav.classList.remove('active'));
                const discTab = document.querySelector('[data-view="discover"]');
                if (discTab) discTab.classList.add('active');
                state.currentView = 'discover';
            }
            searchAnime(query);
        }, 400);
    });

    closeModal.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) hideModal(); });
}

// Views
function renderDiscoverView() {
    viewContent.innerHTML = `
        <div class="hero-section" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
            <div>
                <h2>Discover Anime</h2>
                <p>Find new shows to watch or search for your favorites.</p>
            </div>
            <button class="btn btn-secondary btn-sm" id="refresh-discover-btn" style="display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.05);">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                Refresh
            </button>
        </div>
        <div class="grid" id="anime-grid"></div>
        <div class="pagination-controls" style="display: flex; justify-content: center; align-items: center; gap: 1.5rem; margin-top: 3rem; padding-bottom: 8rem;">
            <button class="btn btn-secondary" id="prev-page-btn" ${discoverPage <= 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>Previous Page</button>
            <span style="font-weight: 800; font-size: 1.1rem; color: var(--text-main);">Page <span style="color: var(--accent-primary);">${discoverPage}</span></span>
            <button class="btn btn-primary" id="next-page-btn">Next Page</button>
        </div>
    `;

    const prevBtn = document.getElementById('prev-page-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (discoverPage > 1) {
                discoverPage--;
                renderDiscoverView();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    const nextBtn = document.getElementById('next-page-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            discoverPage++;
            renderDiscoverView();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const refreshBtn = document.getElementById('refresh-discover-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            fetchTopAnime(discoverPage);
        });
    }

    fetchTopAnime(discoverPage);
}

// Universal Anime Data Importer: parses AniVault JSON, generic anime JSON, MyAnimeList XML, or AniList JSON
function parseAnimeImportData(rawContent) {
    if (typeof rawContent !== 'string') return null;
    const trimmed = rawContent.trim();
    if (!trimmed) return null;

    // 1. MyAnimeList XML export (<myanimelist> or <anime>)
    if (trimmed.startsWith('<?xml') || trimmed.includes('<myanimelist>') || trimmed.includes('<anime>')) {
        const items = [];
        const animeRegex = /<anime>([\s\S]*?)<\/anime>/g;
        let match;
        while ((match = animeRegex.exec(trimmed)) !== null) {
            const block = match[1];
            const idMatch = block.match(/<series_animedb_id>(\d+)<\/series_animedb_id>/);
            const titleMatch = block.match(/<series_title><!\[CDATA\[(.*?)\]\]><\/series_title>/) || block.match(/<series_title>(.*?)<\/series_title>/);
            const scoreMatch = block.match(/<my_score>(\d+)<\/my_score>/);
            const statusMatch = block.match(/<my_status>(.*?)<\/my_status>/);
            const epMatch = block.match(/<series_episodes>(\d+)<\/series_episodes>/);

            if (idMatch) {
                const id = Number(idMatch[1]);
                const title = titleMatch ? titleMatch[1].trim() : 'Unknown Anime';
                const rawStatus = (statusMatch ? statusMatch[1] : '').toLowerCase();
                let listStatus = 'plan_to_watch';
                if (rawStatus.includes('watching')) listStatus = 'watching';
                else if (rawStatus.includes('completed')) listStatus = 'watched';
                else if (rawStatus.includes('plan')) listStatus = 'plan_to_watch';
                else if (rawStatus.includes('hold') || rawStatus.includes('dropped')) listStatus = 'watched';

                const score = (scoreMatch && scoreMatch[1] !== '0') ? scoreMatch[1] : 'N/A';
                const episodes = epMatch ? epMatch[1] : '?';

                items.push({
                    id: id,
                    title: title,
                    imageUrl: `https://wsrv.nl/?url=https%3A%2F%2Fcdn.myanimelist.net%2Fimages%2Fanime%2F${id}.jpg`,
                    rating: score,
                    listStatus: listStatus,
                    episodes: episodes,
                    year: 'N/A'
                });
            }
        }
        if (items.length > 0) return items;
    }

    // 2. JSON (AniVault Backup, AniList JSON, or custom JSON)
    try {
        const parsed = JSON.parse(trimmed);

        if (Array.isArray(parsed)) {
            return parsed.map((item, idx) => {
                const id = item.id || item.mal_id || item.anime_id || (idx + 10000);
                const title = item.title || item.name || item.anime_title || 'Unknown Anime';
                const img = item.imageUrl || item.image || item.images?.jpg?.image_url || item.coverImage?.large || '';
                const rating = item.rating || item.score || item.user_score || 'N/A';
                
                let st = 'plan_to_watch';
                const rawSt = (item.listStatus || item.status || '').toString().toLowerCase();
                if (rawSt.includes('watching') || rawSt === '1' || rawSt === 'current') st = 'watching';
                else if (rawSt.includes('watched') || rawSt.includes('completed') || rawSt === '2') st = 'watched';
                else if (rawSt.includes('plan') || rawSt === '6' || rawSt === 'planning') st = 'plan_to_watch';
                else if (rawSt.includes('drop') || rawSt.includes('hold') || rawSt === '3' || rawSt === '4') st = 'watched';

                return {
                    id: id,
                    title: title,
                    imageUrl: img,
                    rating: rating ? rating.toString() : 'N/A',
                    listStatus: st,
                    episodes: item.episodes || item.total_episodes || item.series_episodes || '?',
                    year: item.year || 'N/A'
                };
            });
        }

        const collection = parsed.data?.MediaListCollection || parsed.MediaListCollection || (parsed.lists ? parsed : null);
        if (collection && Array.isArray(collection.lists)) {
            const items = [];
            collection.lists.forEach(group => {
                (group.entries || []).forEach(entry => {
                    const m = entry.media || {};
                    const id = m.idMal || m.id || entry.mediaId;
                    const title = m.title?.english || m.title?.romaji || m.title?.userPreferred || 'Unknown Anime';
                    const img = m.coverImage?.large || m.coverImage?.medium || '';
                    const score = entry.score ? entry.score.toString() : (m.averageScore ? (m.averageScore / 10).toFixed(1) : 'N/A');
                    
                    let st = 'plan_to_watch';
                    const s = (entry.status || '').toUpperCase();
                    if (s === 'CURRENT') st = 'watching';
                    else if (s === 'COMPLETED' || s === 'DROPPED' || s === 'PAUSED') st = 'watched';
                    else if (s === 'PLANNING') st = 'plan_to_watch';

                    items.push({
                        id: id,
                        title: title,
                        imageUrl: img,
                        rating: score,
                        listStatus: st,
                        episodes: m.episodes || '?',
                        year: m.seasonYear || 'N/A'
                    });
                });
            });
            if (items.length > 0) return items;
        }

        if (Array.isArray(parsed.items)) {
            return parseAnimeImportData(JSON.stringify(parsed.items));
        }
    } catch(e) {}

    return null;
}

// Applies imported anime items to state.myList, persists locally & to Firestore
async function applyImportedAnime(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('No valid anime entries found.');
    }

    let addedCount = 0;
    let updatedCount = 0;

    items.forEach(newItem => {
        const idx = state.myList.findIndex(x => x.id == newItem.id || (x.title && newItem.title && x.title.toLowerCase() === newItem.title.toLowerCase()));
        if (idx !== -1) {
            state.myList[idx] = Object.assign({}, state.myList[idx], newItem);
            updatedCount++;
        } else {
            state.myList.push(newItem);
            addedCount++;
        }
    });

    await saveList();
    if (state.currentUser) {
        allUsersLists[state.currentUser] = state.myList;
    }

    return { total: items.length, added: addedCount, updated: updatedCount };
}

function renderPersonalizationView() {
    const userObj = (state.currentUser && usersDB[state.currentUser]) || {};
    const myListForUser = (state.currentUser && allUsersLists[state.currentUser]) || state.myList || [];
    const watchedCount = myListForUser.filter(i => i.listStatus === 'watched').length;
    const watchingCount = myListForUser.filter(i => i.listStatus === 'watching').length;
    const planCount = myListForUser.filter(i => i.listStatus === 'plan_to_watch').length;

    const isOwner = state.currentUser === 'abubakorsiddikpapel@gmail.com' || userObj.role === 'owner';
    const currentNickname = isOwner ? (userObj.username || 'SIDDIK') : (userObj.username || (state.currentUser ? state.currentUser.split('@')[0] : 'Guest'));
    const displayRole = isOwner ? 'Owner' : (userObj.role || 'Member');

    viewContent.innerHTML = `
        <div class="hero-section" style="margin-bottom: 1.5rem;">
            <h2>Personalization</h2>
            <p>Customize your AniVault presence.</p>
        </div>

        <!-- Profile Stats Card -->
        <div class="profile-stats-card">
            <div class="profile-stats-avatar" id="preview-avatar">
                ${userObj.avatar ? `<img src="${userObj.avatar}" alt="Avatar">` : (state.currentUser ? state.currentUser.charAt(0).toUpperCase() : '?')}
            </div>
            <div class="profile-stats-info">
                <div class="profile-stats-name" style="display:flex; align-items:center; gap: 8px;">
                    <span>${currentNickname}</span>
                    ${isOwner ? '<span class="owner-tag">👑 Owner</span>' : ''}
                </div>
                <div class="profile-stats-role ${isOwner ? 'role-owner' : ''}">${displayRole}</div>
                <div class="profile-stats-numbers">
                    <div class="stat-pill"><span id="stats-watched-num">${watchedCount}</span> Watched</div>
                    <div class="stat-pill"><span id="stats-watching-num">${watchingCount}</span> Watching</div>
                    <div class="stat-pill"><span id="stats-plan-num">${planCount}</span> Plan to Watch</div>
                </div>
                <!-- Connected Anime Accounts Badges -->
                <div id="profile-connected-badges" style="display:flex; gap:0.5rem; margin-top:0.6rem; flex-wrap:wrap;">
                    ${userObj.myanimelist ? `<a href="https://myanimelist.net/profile/${encodeURIComponent(userObj.myanimelist)}" target="_blank" rel="noopener" class="connected-pill"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg> MAL: ${userObj.myanimelist} ↗</a>` : ''}
                    ${userObj.anilist ? `<a href="https://anilist.co/user/${encodeURIComponent(userObj.anilist)}" target="_blank" rel="noopener" class="connected-pill anilist"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M24 17.53v2.421c0 .71-.391 1.101-1.1 1.101h-5c-.71 0-1.1-.391-1.1-1.101v-2.421c0-.71.391-1.101 1.1-1.101h5c.709 0 1.1.391 1.1 1.101zm-13.322 3.522h-3.565l4.87-13.913h3.565l4.87 13.913h-3.565l-.891-2.609h-4.393l-.891 2.609zm3.565-5.217l-1.304-3.826-1.304 3.826h2.608z"/></svg> AniList: ${userObj.anilist} ↗</a>` : ''}
                </div>
            </div>
        </div>

        <div class="settings-container" style="margin-top: 2rem;">
            <div class="settings-group">
                <h3>Nickname</h3>
                <input type="text" id="settings-nickname" class="settings-input" placeholder="Enter your nickname" maxlength="30" value="${currentNickname}">
                <div style="color: var(--text-muted); font-size: 0.8rem; margin-top: 0.4rem;">Max 30 characters. Displayed in chat & leaderboard.</div>
            </div>

            <!-- Connect Anime Accounts via Username & File Upload -->
            <div class="settings-group">
                <h3>Connect Anime Accounts</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.2rem;">Connect your MyAnimeList and AniList profiles via username, or import your watchlists directly into AniVault.</p>
                
                <div class="connect-accounts-container">
                    <!-- MyAnimeList Card -->
                    <div class="connect-account-card">
                        <div class="connect-account-header">
                            <div class="connect-account-icon mal-icon">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
                            </div>
                            <div>
                                <div class="connect-account-title">MyAnimeList</div>
                                <div class="connect-account-subtitle">Connect profile & import watchlist</div>
                            </div>
                        </div>
                        <div class="connect-account-body">
                            <label style="font-size:0.8rem; font-weight:600; color:var(--text-muted); display:block; margin-bottom:0.3rem;">MAL Username</label>
                            <div class="connect-input-row">
                                <input type="text" id="settings-mal-username" class="settings-input" placeholder="e.g. MyAnimeList username" value="${userObj.myanimelist || ''}">
                                <button type="button" class="btn btn-secondary btn-sm" id="btn-save-mal" style="white-space: nowrap;">Connect</button>
                            </div>
                            <div class="connect-btn-row">
                                <input type="file" id="mal-file-input" style="display: none;" accept=".xml,.json,.txt">
                                <button type="button" class="btn btn-primary btn-sm" id="btn-upload-mal" style="flex:1; justify-content:center;">
                                    📁 Upload MAL Export (.xml / .json)
                                </button>
                            </div>
                            <div class="connect-hint">
                                Tip: Download your export from <a href="https://myanimelist.net/panel.php?go=export" target="_blank" rel="noopener">myanimelist.net/panel.php?go=export ↗</a> and click Upload above for a 100% instant full sync!
                            </div>
                            <div id="mal-status-indicator" class="connect-status">
                                ${userObj.myanimelist ? `Connected as <a href="https://myanimelist.net/profile/${encodeURIComponent(userObj.myanimelist)}" target="_blank" rel="noopener">@${userObj.myanimelist} ↗</a>` : '<span style="color: var(--text-muted);">Not connected</span>'}
                            </div>
                        </div>
                    </div>

                    <!-- AniList Card -->
                    <div class="connect-account-card">
                        <div class="connect-account-header">
                            <div class="connect-account-icon anilist-icon">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M24 17.53v2.421c0 .71-.391 1.101-1.1 1.101h-5c-.71 0-1.1-.391-1.1-1.101v-2.421c0-.71.391-1.101 1.1-1.101h5c.709 0 1.1.391 1.1 1.101zm-13.322 3.522h-3.565l4.87-13.913h3.565l4.87 13.913h-3.565l-.891-2.609h-4.393l-.891 2.609zm3.565-5.217l-1.304-3.826-1.304 3.826h2.608z"/></svg>
                            </div>
                            <div>
                                <div class="connect-account-title">AniList</div>
                                <div class="connect-account-subtitle">Live API fetch & profile connection</div>
                            </div>
                        </div>
                        <div class="connect-account-body">
                            <label style="font-size:0.8rem; font-weight:600; color:var(--text-muted); display:block; margin-bottom:0.3rem;">AniList Username</label>
                            <div class="connect-input-row">
                                <input type="text" id="settings-anilist-username" class="settings-input" placeholder="e.g. AniList username" value="${userObj.anilist || ''}">
                                <button type="button" class="btn btn-secondary btn-sm" id="btn-import-anilist" style="white-space: nowrap;">Fetch & Import</button>
                            </div>
                            <div class="connect-btn-row">
                                <input type="file" id="anilist-file-input" style="display: none;" accept=".json,.xml,.txt">
                                <button type="button" class="btn btn-secondary btn-sm" id="btn-upload-anilist" style="flex:1; justify-content:center;">
                                    📁 Or Upload Backup File (.json)
                                </button>
                            </div>
                            <div class="connect-hint">
                                Connects via public AniList GraphQL API. Make sure your list is set to Public on AniList.
                            </div>
                            <div id="anilist-status-indicator" class="connect-status">
                                ${userObj.anilist ? `Connected as <a href="https://anilist.co/user/${encodeURIComponent(userObj.anilist)}" target="_blank" rel="noopener">@${userObj.anilist} ↗</a>` : '<span style="color: var(--text-muted);">Not connected</span>'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="settings-group">
                <h3>Bio <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 400;">— optional</span></h3>
                <textarea id="settings-bio" class="settings-input" placeholder="Tell the community about yourself..." maxlength="150" style="resize: none; height: 90px; padding-top: 0.8rem;"></textarea>
                <div id="bio-counter" style="color: var(--text-muted); font-size: 0.8rem; margin-top: 0.4rem; text-align: right;">0 / 150</div>
            </div>
            <div class="settings-group">
                <h3>Live Wallpaper</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.2rem;">Choose an animated background for AniVault.</p>
                <div class="wallpaper-grid" id="wallpaper-grid"></div>
            </div>
            <div class="settings-group">
                <h3>Choose Avatar</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.2rem;">Pick a character to represent you across AniVault.</p>
                <div id="avatar-category-tabs" class="avatar-category-tabs"></div>
                <div class="avatar-grid" id="settings-avatars"></div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                <button class="btn btn-primary" id="save-settings-btn">Save Changes</button>
                <div id="settings-success" class="settings-toast hidden">✓ Profile updated!</div>
                <div id="settings-error" class="settings-toast settings-toast-error hidden">✗ Could not save. Try again.</div>
            </div>
        </div>
    `;

    const nicknameInput = document.getElementById('settings-nickname');
    const bioInput = document.getElementById('settings-bio');
    const bioCounter = document.getElementById('bio-counter');
    const avatarGrid = document.getElementById('settings-avatars');
    const categoryTabs = document.getElementById('avatar-category-tabs');
    const malInput = document.getElementById('settings-mal-username');
    const anilistInput = document.getElementById('settings-anilist-username');
    const malStatusEl = document.getElementById('mal-status-indicator');
    const anilistStatusEl = document.getElementById('anilist-status-indicator');
    const btnSaveMal = document.getElementById('btn-save-mal');
    const btnUploadMal = document.getElementById('btn-upload-mal');
    const malFileInput = document.getElementById('mal-file-input');
    const btnImportAnilist = document.getElementById('btn-import-anilist');
    const btnUploadAnilist = document.getElementById('btn-upload-anilist');
    const anilistFileInput = document.getElementById('anilist-file-input');

    bioInput.value = userObj.bio || '';
    bioCounter.textContent = `${bioInput.value.length} / 150`;

    bioInput.addEventListener('input', () => {
        bioCounter.textContent = `${bioInput.value.length} / 150`;
    });

    // Helper to update profile stats pills on page
    function updateStatsNumbers() {
        const wEl = document.getElementById('stats-watched-num');
        const wgEl = document.getElementById('stats-watching-num');
        const pEl = document.getElementById('stats-plan-num');
        if (wEl) wEl.textContent = state.myList.filter(i => i.listStatus === 'watched').length;
        if (wgEl) wgEl.textContent = state.myList.filter(i => i.listStatus === 'watching').length;
        if (pEl) pEl.textContent = state.myList.filter(i => i.listStatus === 'plan_to_watch').length;
    }

    // Connect MAL Username
    btnSaveMal.addEventListener('click', async () => {
        const uName = malInput.value.trim();
        if (!uName) {
            malStatusEl.innerHTML = '<span style="color: #ff4785;">Please enter a MyAnimeList username.</span>';
            malInput.focus();
            return;
        }
        if (state.currentUser) {
            usersDB[state.currentUser] = usersDB[state.currentUser] || {};
            usersDB[state.currentUser].myanimelist = uName;
            try {
                await db.collection('users').doc(state.currentUser).set({ myanimelist: uName }, { merge: true });
            } catch(e) {}
        }
        malStatusEl.innerHTML = `<span style="color: #4CAF50;">✓ Connected as <a href="https://myanimelist.net/profile/${encodeURIComponent(uName)}" target="_blank" rel="noopener">@${uName} ↗</a></span>`;
    });

    // Upload MAL Export File
    btnUploadMal.addEventListener('click', () => malFileInput.click());
    malFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        malStatusEl.innerHTML = `<span style="color: var(--accent-primary);">Reading ${file.name}...</span>`;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            try {
                const raw = ev.target.result;
                const items = parseAnimeImportData(raw);
                if (!items || items.length === 0) {
                    throw new Error('Could not find anime data in this file. Please make sure it is a MyAnimeList XML or JSON export.');
                }
                const res = await applyImportedAnime(items);
                updateStatsNumbers();
                malStatusEl.innerHTML = `<span style="color: #4CAF50; font-weight:600;">✓ Successfully imported ${res.total} anime into your vault! (${res.added} added, ${res.updated} updated)</span>`;
                malFileInput.value = '';
            } catch(err) {
                console.error('MAL upload error:', err);
                malStatusEl.innerHTML = `<span style="color: #ff4785;">Import failed: ${err.message}</span>`;
            }
        };
        reader.readAsText(file);
    });

    // Fetch & Import from AniList API
    btnImportAnilist.addEventListener('click', async () => {
        const uName = anilistInput.value.trim();
        if (!uName) {
            anilistStatusEl.innerHTML = '<span style="color: #ff4785;">Please enter an AniList username first.</span>';
            anilistInput.focus();
            return;
        }
        btnImportAnilist.disabled = true;
        btnImportAnilist.textContent = 'Importing...';
        anilistStatusEl.innerHTML = '<span style="color: var(--accent-primary);">Fetching AniList watchlist for @' + uName + '...</span>';

        try {
            const query = `
                query ($userName: String) {
                    MediaListCollection(userName: $userName, type: ANIME) {
                        lists {
                            name
                            status
                            entries {
                                status
                                score(format: POINT_10)
                                media {
                                    id
                                    idMal
                                    title { romaji english native userPreferred }
                                    coverImage { large medium extraLarge }
                                    averageScore
                                    episodes
                                    format
                                    genres
                                    seasonYear
                                }
                            }
                        }
                    }
                }
            `;
            const resp = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ query, variables: { userName: uName } })
            });
            const data = await resp.json();
            if (data.errors && data.errors.length > 0) {
                const errMsg = data.errors[0]?.message || 'AniList query error';
                if (errMsg.toLowerCase().includes('private')) {
                    throw new Error('This AniList profile is set to Private. Please set your list to Public in AniList settings to import.');
                }
                if (errMsg.toLowerCase().includes('not found')) {
                    throw new Error(`AniList user '@${uName}' was not found. Please verify spelling.`);
                }
                throw new Error(errMsg);
            }
            
            const lists = data.data?.MediaListCollection?.lists || [];
            const items = [];
            
            lists.forEach(group => {
                (group.entries || []).forEach(entry => {
                    const media = entry.media;
                    if (!media) return;
                    
                    let mappedStatus = 'plan_to_watch';
                    const s = (entry.status || '').toUpperCase();
                    if (s === 'CURRENT') mappedStatus = 'watching';
                    else if (s === 'COMPLETED' || s === 'DROPPED' || s === 'PAUSED') mappedStatus = 'watched';
                    else if (s === 'PLANNING') mappedStatus = 'plan_to_watch';

                    const animeId = media.idMal || media.id;
                    const title = media.title?.english || media.title?.romaji || media.title?.userPreferred || 'Unknown Anime';
                    const img = media.coverImage?.large || media.coverImage?.medium || '';
                    const rating = media.averageScore ? (media.averageScore / 10).toFixed(1) : (entry.score ? entry.score.toString() : 'N/A');

                    items.push({
                        id: animeId,
                        title: title,
                        imageUrl: img,
                        rating: rating,
                        listStatus: mappedStatus,
                        episodes: media.episodes || '?',
                        year: media.seasonYear || 'N/A'
                    });
                });
            });

            if (items.length === 0) {
                throw new Error(`No anime found on @${uName}'s AniList public list.`);
            }

            const res = await applyImportedAnime(items);
            updateStatsNumbers();

            if (state.currentUser) {
                usersDB[state.currentUser] = usersDB[state.currentUser] || {};
                usersDB[state.currentUser].anilist = uName;
                try {
                    await db.collection('users').doc(state.currentUser).set({ anilist: uName }, { merge: true });
                } catch(e) {}
            }

            anilistStatusEl.innerHTML = `<span style="color: #4CAF50; font-weight:600;">✓ Successfully imported ${res.total} anime from AniList! (${res.added} added, ${res.updated} updated)</span>`;
        } catch (err) {
            console.error('AniList import error:', err);
            anilistStatusEl.innerHTML = `<span style="color: #ff4785;">${err.message || 'Could not fetch list.'}</span>`;
        } finally {
            btnImportAnilist.disabled = false;
            btnImportAnilist.textContent = 'Fetch & Import';
        }
    });

    // Upload AniList File
    btnUploadAnilist.addEventListener('click', () => anilistFileInput.click());
    anilistFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        anilistStatusEl.innerHTML = `<span style="color: var(--accent-primary);">Reading ${file.name}...</span>`;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            try {
                const raw = ev.target.result;
                const items = parseAnimeImportData(raw);
                if (!items || items.length === 0) {
                    throw new Error('Could not find anime data in this file. Please make sure it is an AniList JSON export or backup.');
                }
                const res = await applyImportedAnime(items);
                updateStatsNumbers();
                anilistStatusEl.innerHTML = `<span style="color: #4CAF50; font-weight:600;">✓ Successfully imported ${res.total} anime from file! (${res.added} added, ${res.updated} updated)</span>`;
                anilistFileInput.value = '';
            } catch(err) {
                console.error('AniList upload error:', err);
                anilistStatusEl.innerHTML = `<span style="color: #ff4785;">Import failed: ${err.message}</span>`;
            }
        };
        reader.readAsText(file);
    });

    let selectedAvatar = userObj.avatar || animeAvatars[0];
    let activeCategory = Object.keys(animeAvatarCategories)[0];

    function renderCategoryTabs() {
        categoryTabs.innerHTML = '';
        Object.keys(animeAvatarCategories).forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `avatar-cat-tab ${cat === activeCategory ? 'active' : ''}`;
            btn.textContent = cat;
            btn.addEventListener('click', () => {
                activeCategory = cat;
                renderCategoryTabs();
                renderAvatarsForCategory(cat);
            });
            categoryTabs.appendChild(btn);
        });
    }

    function renderAvatarsForCategory(cat) {
        avatarGrid.innerHTML = '';
        const avatarsInCat = animeAvatarCategories[cat] || [];
        avatarsInCat.forEach(({ url, name }) => {
            const div = document.createElement('div');
            div.className = 'avatar-option' + (selectedAvatar === url ? ' selected' : '');
            div.title = name;
            div.innerHTML = `
                <img src="${url}" alt="${name}">
                <div class="avatar-option-name">${name}</div>
            `;
            div.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                selectedAvatar = url;
                const preview = document.getElementById('preview-avatar');
                if (preview) preview.innerHTML = `<img src="${url}" alt="${name}">`;
            });
            avatarGrid.appendChild(div);
        });
    }

    renderCategoryTabs();
    renderAvatarsForCategory(activeCategory);

    const wallpaperGrid = document.getElementById('wallpaper-grid');
    if (wallpaperGrid) {
        wallpaperThemes.forEach(theme => {
            const card = document.createElement('div');
            card.className = 'wallpaper-option' + (activeWallpaper === theme.id ? ' selected' : '');
            card.innerHTML = `
                <div class="wallpaper-icon">${theme.icon}</div>
                <div class="wallpaper-name">${theme.name}</div>
                <div class="wallpaper-desc">${theme.desc}</div>
            `;
            card.addEventListener('click', () => {
                document.querySelectorAll('.wallpaper-option').forEach(el => el.classList.remove('selected'));
                card.classList.add('selected');
                applyWallpaperTheme(theme.id);
            });
            wallpaperGrid.appendChild(card);
        });
    }

    document.getElementById('save-settings-btn').addEventListener('click', async () => {
        if (!state.currentUser) {
            showLoginPrompt('Please sign in to save your settings!');
            return;
        }
        const newNickname = nicknameInput.value.trim();
        const newBio = bioInput.value.trim();
        const newMal = malInput.value.trim();
        const newAnilist = anilistInput.value.trim();

        if (!newNickname) { nicknameInput.focus(); return; }

        const successMsg = document.getElementById('settings-success');
        const errorMsg = document.getElementById('settings-error');

        usersDB[state.currentUser] = usersDB[state.currentUser] || {};
        usersDB[state.currentUser].username = newNickname;
        usersDB[state.currentUser].avatar = selectedAvatar;
        usersDB[state.currentUser].bio = newBio;
        usersDB[state.currentUser].myanimelist = newMal;
        usersDB[state.currentUser].anilist = newAnilist;

        try {
            await db.collection('users').doc(state.currentUser).set({
                username: newNickname,
                avatar: selectedAvatar,
                bio: newBio,
                myanimelist: newMal,
                anilist: newAnilist
            }, { merge: true });
            renderUserProfile();
            successMsg.classList.remove('hidden');
            errorMsg.classList.add('hidden');
            setTimeout(() => successMsg.classList.add('hidden'), 3000);
        } catch (e) {
            console.error("Error saving settings:", e);
            errorMsg.classList.remove('hidden');
            successMsg.classList.add('hidden');
            setTimeout(() => errorMsg.classList.add('hidden'), 3000);
        }
    });
}

async function renderGenresView() {
    viewContent.innerHTML = `
        <div class="hero-section">
            <h2>Genres</h2>
            <p>Browse anime by category.</p>
        </div>
        <div class="genre-filter-list" id="genre-filters">
            <div class="loading-spinner"></div>
        </div>
        <div class="grid" id="anime-grid"></div>
    `;

    const allowedGenres = ["Action", "Romance", "Fantasy", "Sci-Fi", "Slice of Life", "Horror", "Sports", "Comedy", "Drama", "Mystery", "Supernatural"];
    let targetGenres = [];

    try {
        const response = await fetchWithTimeout('https://api.jikan.moe/v4/genres/anime', {}, 3000);
        if (response.ok) {
            const data = await response.json();
            if (data && data.data) {
                targetGenres = data.data.filter(g => allowedGenres.includes(g.name));
            }
        }
    } catch (err) { }

    if (targetGenres.length === 0) {
        targetGenres = allowedGenres.map((name, i) => ({
            mal_id: name,
            name: name,
            count: 50 + (i * 12)
        }));
    }

    const filtersContainer = document.getElementById('genre-filters');
    if (!filtersContainer) return;
    filtersContainer.innerHTML = '';
    
    targetGenres.forEach(genre => {
        const btn = document.createElement('button');
        btn.className = `genre-filter-btn ${(currentGenreId === genre.mal_id || currentGenreId === genre.name) ? 'active' : ''}`;
        btn.innerHTML = `
            ${genre.name} 
            <span class="genre-count">${genre.count}</span>
        `;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.genre-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGenreId = genre.mal_id || genre.name;
            fetchAnimeByGenre(currentGenreId, genre.name);
        });
        filtersContainer.appendChild(btn);
    });

    if (!currentGenreId && targetGenres.length > 0) {
        currentGenreId = targetGenres[0].mal_id || targetGenres[0].name;
        if (filtersContainer.firstChild) filtersContainer.firstChild.classList.add('active');
        fetchAnimeByGenre(currentGenreId, targetGenres[0].name);
    } else if (currentGenreId) {
        const currentGenreObj = targetGenres.find(g => (g.mal_id || g.name) === currentGenreId);
        fetchAnimeByGenre(currentGenreId, currentGenreObj ? currentGenreObj.name : null);
    }
}

async function renderAdminView() {
    const me = state.currentUser ? usersDB[state.currentUser] : null;
    const isOwnerMe = state.currentUser === 'abubakorsiddikpapel@gmail.com' || (me && me.role === 'owner');
    if (!isOwnerMe) {
        viewContent.innerHTML = `<div class="hero-section"><h2>Access Denied</h2><p>You do not have permission to view this page.</p></div>`;
        return;
    }

    await syncAllData();

    const totalMembers = Object.keys(usersDB).length;
    let membersHtml = '';
    
    Object.keys(usersDB).forEach(email => {
        const user = usersDB[email];
        const joinDate = user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Unknown';
        const isOwner = email === 'abubakorsiddikpapel@gmail.com' || user.role === 'owner';
        const displayName = isOwner ? (user.username || 'SIDDIK') : (user.username || email.split('@')[0]);
        
        let roleOptions = `
            <select class="admin-role-select" data-email="${email}" ${isOwner ? 'disabled' : ''}>
                ${isOwner ? '<option value="owner" selected>Owner</option>' : `
                    <option value="member" ${user.role === 'member' || !user.role ? 'selected' : ''}>Member</option>
                    <option value="moderator" ${user.role === 'moderator' ? 'selected' : ''}>Moderator</option>
                    <option value="officer" ${user.role === 'officer' ? 'selected' : ''}>Officer</option>
                    <option value="celebrity" ${user.role === 'celebrity' ? 'selected' : ''}>Celebrity</option>
                    <option value="owner">Owner</option>
                `}
            </select>
        `;

        membersHtml += `
            <div class="admin-member-item">
                <div class="user-row-avatar"><img src="${user.avatar || animeAvatars[0]}" alt="Avatar"></div>
                <div class="admin-member-info">
                    <div class="admin-member-name" style="display:flex; align-items:center; gap: 8px;">
                        <span>${displayName}</span>
                        ${getBadgeHtml(email)}
                        ${isOwner ? '<span class="owner-tag">👑 Owner</span>' : ''}
                    </div>
                    <div class="admin-member-email">${email} • Joined: ${joinDate}</div>
                </div>
                <div class="admin-member-actions">
                    ${roleOptions}
                </div>
            </div>
        `;
    });

    viewContent.innerHTML = `
        <div class="hero-section">
            <h2>Admin Dashboard</h2>
            <p>Manage AniVault platform and members.</p>
        </div>
        <div class="admin-dashboard">
            <div class="admin-sidebar">
                <div class="admin-card admin-stat">
                    <div class="stat-number">${totalMembers}</div>
                    <div class="stat-label">Total Members</div>
                </div>
            </div>
            <div class="admin-main">
                <div class="admin-card">
                    <h3 style="margin-bottom: 1.5rem; color: white;">Member Management</h3>
                    <div class="admin-members-list">
                        ${membersHtml}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll('.admin-members-list .admin-role-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const email = e.target.dataset.email;
            if (!email) return;
            const newRole = e.target.value;
            try {
                await db.collection('users').doc(email).update({ role: newRole });
                usersDB[email] = usersDB[email] || {};
                usersDB[email].role = newRole;
            } catch (err) {
                console.error("Failed to update role", err);
                alert("Failed to update role.");
            }
        });
    });
}

function renderLeaderboardView() {
    viewContent.innerHTML = `
        <div class="hero-section">
            <h2>Leaderboard</h2>
            <p>See who has tracked the most anime!</p>
        </div>
        <div class="leaderboard-list" id="leaderboard-list"></div>
    `;
    
    const listContainer = document.getElementById('leaderboard-list');
    let rankings = [];
    
    for (const email in allUsersLists) {
        if(usersDB[email]) {
            rankings.push({
                email: email,
                count: allUsersLists[email].length,
                role: usersDB[email].role || 'member',
                username: usersDB[email].username,
                avatar: usersDB[email].avatar
            });
        }
    }
    
    rankings.sort((a, b) => b.count - a.count);
    
    if (rankings.length === 0) {
        listContainer.innerHTML = `<div class="no-results">No ranked users found. Start tracking to be #1!</div>`;
        return;
    }
    
    rankings.forEach((user, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        const rankClass = index < 3 ? `rank-${index + 1}` : '';
        const isOwner = user.email === 'abubakorsiddikpapel@gmail.com' || user.role === 'owner';
        const displayName = isOwner ? (user.username || 'SIDDIK') : (user.username || user.email.split('@')[0]);
        const avatarContent = user.avatar ? `<img src="${user.avatar}" alt="Avatar">` : user.email.charAt(0).toUpperCase();
        
        let roleBadge = '';
        if (isOwner) {
            roleBadge = `<span class="owner-tag" style="margin-top: 3px;">👑 Owner</span>`;
        } else if (user.role && user.role !== 'member') {
            roleBadge = `<span class="profile-role role-${user.role}">${user.role}</span>`;
        }

        item.innerHTML = `
            <div class="rank ${rankClass}">#${index + 1}</div>
            <div class="profile-avatar">${avatarContent}</div>
            <div class="leader-info">
                <div class="leader-name" style="display:flex; align-items:center; gap: 6px;">${displayName} ${getBadgeHtml(user.email)}</div>
                ${roleBadge}
            </div>
            <div class="leader-score">${user.count} <span>Anime</span></div>
        `;
        listContainer.appendChild(item);
    });
}

let chatUnsubscribe = null;
function renderChatView() {
    viewContent.innerHTML = `
        <div class="hero-section" style="margin-bottom: 1.5rem;">
            <h2>Community Wall</h2>
            <p>Chat with other AniVault users.</p>
        </div>
        <div class="chat-container">
            <div class="chat-messages" id="chat-messages"><div class="loading-spinner"></div></div>
            <form class="chat-input-container" id="chat-form">
                <input type="text" id="chat-input" class="chat-input" placeholder="Type a message..." required autocomplete="off">
                <button type="submit" class="btn btn-primary chat-send-btn">Send</button>
            </form>
        </div>
    `;
    
    if (chatUnsubscribe) chatUnsubscribe();
    
    chatUnsubscribe = db.collection('chat').doc('global').onSnapshot((doc) => {
        if (state.currentView !== 'chat') { 
            if (chatUnsubscribe) chatUnsubscribe(); 
            return; 
        }
        let chatDB = doc.exists ? doc.data().messages || [] : [];
        renderChatMessages(chatDB);
    });
    
    document.getElementById('chat-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!state.currentUser) {
            showLoginPrompt("Please sign in to join the Community Wall!");
            return;
        }
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        
        const userObj = usersDB[state.currentUser] || {};
        const isOwner = state.currentUser === 'abubakorsiddikpapel@gmail.com' || userObj.role === 'owner';
        const authorName = isOwner ? (userObj.username || 'SIDDIK') : (userObj.username || state.currentUser.split('@')[0]);
        const authorRole = isOwner ? 'owner' : (userObj.role || 'member');
        
        const newMessage = {
            author: authorName,
            avatar: userObj.avatar || animeAvatars[0],
            role: authorRole,
            text: text,
            time: new Date().toISOString()
        };
        
        try {
            const chatDocRef = db.collection('chat').doc('global');
            await db.runTransaction(async (transaction) => {
                const doc = await transaction.get(chatDocRef);
                let messages = doc.exists ? doc.data().messages || [] : [];
                messages.push(newMessage);
                if (messages.length > 100) messages = messages.slice(messages.length - 100);
                transaction.set(chatDocRef, { messages: messages });
            });
        } catch (err) { console.error("Chat error", err); }
    });
}

function renderChatMessages(chatDB) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
    container.innerHTML = '';
    
    if (chatDB.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:var(--text-muted); margin-top:2rem;">No messages yet. Say hello!</div>`;
        return;
    }
    
    const myName = (state.currentUser && usersDB[state.currentUser]) ? (usersDB[state.currentUser].username || state.currentUser.split('@')[0]) : '';
    
    chatDB.forEach(msg => {
        const isMe = msg.author === myName;
        const div = document.createElement('div');
        div.className = `chat-message ${isMe ? 'self' : ''}`;
        
        const isOwner = msg.role === 'owner' || msg.author === 'SIDDIK' || (msg.author && getEmailFromUsername(msg.author) === 'abubakorsiddikpapel@gmail.com');
        let roleBadge = '';
        if (isOwner) {
            roleBadge = `<span class="owner-tag" style="margin-left:0.4rem;">👑 Owner</span>`;
        } else if (msg.role && msg.role !== 'member') {
            roleBadge = `<span class="profile-role role-${msg.role}" style="font-size:0.6rem; margin-left:0.4rem;">${msg.role}</span>`;
        }
        
        const avatarContent = msg.avatar ? `<img src="${msg.avatar}" alt="Avatar">` : '?';
        
        let emailForBadge = getEmailFromUsername(msg.author);
        let badgeHtml = emailForBadge ? getBadgeHtml(emailForBadge) : '';
        
        div.innerHTML = `
            <div class="chat-author" style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem;">
                <div class="profile-avatar" style="width:24px; height:24px; font-size:0.7rem;">${avatarContent}</div>
                <span style="font-weight:600; display:flex; align-items:center; gap: 4px;">${msg.author} ${badgeHtml}</span> ${roleBadge}
            </div>
            <div class="chat-bubble">${msg.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        `;
        container.appendChild(div);
    });
    
    if (isAtBottom) container.scrollTop = container.scrollHeight;
}

let currentVaultTab = 'all';

function renderVaultView() {
    viewContent.innerHTML = `
        <div class="hero-section" style="margin-bottom: 1.5rem;">
            <h2>Your Vault</h2>
            <p>Manage your anime tracking list.</p>
        </div>
        
        <div class="vault-tabs" style="display: flex; gap: 1rem; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 0.5rem;">
            <button class="vault-tab btn ${currentVaultTab === 'all' ? 'btn-primary' : 'btn-secondary'}" data-tab="all">All</button>
            <button class="vault-tab btn ${currentVaultTab === 'watching' ? 'btn-primary' : 'btn-secondary'}" data-tab="watching">Watching</button>
            <button class="vault-tab btn ${currentVaultTab === 'watched' ? 'btn-primary' : 'btn-secondary'}" data-tab="watched">Watched</button>
            <button class="vault-tab btn ${currentVaultTab === 'plan_to_watch' ? 'btn-primary' : 'btn-secondary'}" data-tab="plan_to_watch">Plan to Watch</button>
        </div>
        
        <div class="grid" id="anime-grid"></div>
    `;

    document.querySelectorAll('.vault-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            currentVaultTab = e.target.dataset.tab;
            renderVaultView();
        });
    });

    let displayList = state.myList;
    if (currentVaultTab !== 'all') {
        displayList = state.myList.filter(item => item.listStatus === currentVaultTab);
    }
    
    const grid = document.getElementById('anime-grid');
    if (displayList.length === 0) {
        grid.innerHTML = `<div class="no-results" style="grid-column: 1/-1;">No anime found in this category. Go to Discover to add shows!</div>`;
    } else {
        renderGrid(displayList, grid);
    }
}

function renderBadgesView() {
    const bulkPanel = document.getElementById('global-bulk-panel');
    if (bulkPanel) bulkPanel.classList.add('hidden');

    const myListForUser = (state.currentUser && allUsersLists[state.currentUser]) || state.myList || [];
    const watchedCount = myListForUser.filter(i => i.listStatus === 'watched').length;
    const watchingCount = myListForUser.filter(i => i.listStatus === 'watching').length;
    const planCount = myListForUser.filter(i => i.listStatus === 'plan_to_watch').length;
    const totalTracked = myListForUser.length;

    const allBadges = [
        { id: 'first_watch', icon: '🥉', name: 'First Watch', desc: 'Mark your first anime as Watched.', tier: 'bronze', unlocked: watchedCount >= 1, progress: Math.min(watchedCount, 1), goal: 1, unit: 'watched' },
        { id: 'beginner', icon: '🌱', name: 'Beginner', desc: 'Watch 10 anime.', tier: 'bronze', unlocked: watchedCount >= 10, progress: Math.min(watchedCount, 10), goal: 10, unit: 'watched' },
        { id: 'dedicated', icon: '📺', name: 'Dedicated Viewer', desc: 'Watch 50 anime.', tier: 'silver', unlocked: watchedCount >= 50, progress: Math.min(watchedCount, 50), goal: 50, unit: 'watched' },
        { id: 'intermediate', icon: '🥇', name: 'Intermediate', desc: 'Watch 200 anime.', tier: 'gold', unlocked: watchedCount >= 200, progress: Math.min(watchedCount, 200), goal: 200, unit: 'watched' },
        { id: 'advanced', icon: '💎', name: 'Advanced', desc: 'Watch 500 anime.', tier: 'diamond', unlocked: watchedCount >= 500, progress: Math.min(watchedCount, 500), goal: 500, unit: 'watched' },
        { id: 'expert', icon: '👑', name: 'Expert', desc: 'Watch 1000 anime. Legendary.', tier: 'legendary', unlocked: watchedCount >= 1000, progress: Math.min(watchedCount, 1000), goal: 1000, unit: 'watched' },
        { id: 'list_starter', icon: '📋', name: 'List Starter', desc: 'Add 5 anime to your vault.', tier: 'bronze', unlocked: totalTracked >= 5, progress: Math.min(totalTracked, 5), goal: 5, unit: 'tracked' },
        { id: 'curator', icon: '🗂️', name: 'Curator', desc: 'Track 25 anime in any status.', tier: 'silver', unlocked: totalTracked >= 25, progress: Math.min(totalTracked, 25), goal: 25, unit: 'tracked' },
        { id: 'archivist', icon: '🏛️', name: 'Archivist', desc: 'Track 100 anime in your vault.', tier: 'gold', unlocked: totalTracked >= 100, progress: Math.min(totalTracked, 100), goal: 100, unit: 'tracked' },
        { id: 'planner', icon: '🔖', name: 'The Planner', desc: 'Add 10 anime to Plan to Watch.', tier: 'bronze', unlocked: planCount >= 10, progress: Math.min(planCount, 10), goal: 10, unit: 'planned' },
        { id: 'binge_watcher', icon: '🍿', name: 'Binge Watcher', desc: 'Have 5 anime in Watching at once.', tier: 'silver', unlocked: watchingCount >= 5, progress: Math.min(watchingCount, 5), goal: 5, unit: 'watching' },
        { id: 'completionist', icon: '✅', name: 'Completionist', desc: 'Watch 100 anime.', tier: 'gold', unlocked: watchedCount >= 100, progress: Math.min(watchedCount, 100), goal: 100, unit: 'watched' }
    ];

    const unlockedBadges = allBadges.filter(b => b.unlocked);
    const lockedBadges = allBadges.filter(b => !b.unlocked);

    const tierColors = {
        bronze: '#cd7f32',
        silver: '#a8a9ad',
        gold: '#ffd700',
        diamond: '#00e5ff',
        legendary: '#ff4785'
    };

    function badgeCardHtml(badge) {
        const color = tierColors[badge.tier] || '#aaa';
        const pct = Math.round((badge.progress / badge.goal) * 100);
        return `
            <div class="badge-card ${badge.unlocked ? 'badge-unlocked' : 'badge-locked'}" style="--badge-color: ${color};">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-tier-label" style="color: ${color};">${badge.tier.toUpperCase()}</div>
                <div class="badge-desc">${badge.desc}</div>
                ${!badge.unlocked ? `
                    <div class="badge-progress-bar-wrap">
                        <div class="badge-progress-bar" style="width: ${pct}%; background: ${color};"></div>
                    </div>
                    <div class="badge-progress-text">${badge.progress} / ${badge.goal} ${badge.unit}</div>
                ` : `<div class="badge-earned-label">✓ Earned</div>`}
            </div>
        `;
    }

    viewContent.innerHTML = `
        <div class="hero-section" style="margin-bottom: 1.5rem;">
            <h2>Badges</h2>
            <p>Earn badges by tracking and watching anime. Flex your collection!</p>
        </div>

        <div class="badges-summary-row">
            <div class="badges-summary-card">
                <div class="badges-summary-num" style="background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${unlockedBadges.length}</div>
                <div class="badges-summary-label">Badges Earned</div>
            </div>
            <div class="badges-summary-card">
                <div class="badges-summary-num" style="color: var(--text-muted);">${lockedBadges.length}</div>
                <div class="badges-summary-label">Locked</div>
            </div>
            <div class="badges-summary-card">
                <div class="badges-summary-num">${allBadges.length}</div>
                <div class="badges-summary-label">Total Badges</div>
            </div>
        </div>

        ${unlockedBadges.length > 0 ? `
        <div class="badges-section-title">
            <span>🏆 Earned Badges</span>
            <span class="badges-count-pill">${unlockedBadges.length}</span>
        </div>
        <div class="badges-grid">
            ${unlockedBadges.map(b => badgeCardHtml(b)).join('')}
        </div>
        ` : ''}

        <div class="badges-section-title" style="margin-top: ${unlockedBadges.length > 0 ? '2.5rem' : '0'};">
            <span>🔒 Locked Badges</span>
            <span class="badges-count-pill">${lockedBadges.length}</span>
        </div>
        <div class="badges-grid">
            ${lockedBadges.map(b => badgeCardHtml(b)).join('')}
        </div>
    `;
}

function renderBackupView() {
    const bulkPanel = document.getElementById('global-bulk-panel');
    if (bulkPanel) bulkPanel.classList.add('hidden');

    const totalAnime = state.myList.length;
    const watchedCount = state.myList.filter(i => i.listStatus === 'watched').length;
    const watchingCount = state.myList.filter(i => i.listStatus === 'watching').length;
    const planCount = state.myList.filter(i => i.listStatus === 'plan_to_watch').length;

    viewContent.innerHTML = `
        <div class="hero-section" style="margin-bottom: 1.5rem;">
            <h2>Backup & Restore</h2>
            <p>Export your anime list as a JSON file to keep it safe, or import an existing backup.</p>
        </div>

        <div class="backup-stats-row">
            <div class="backup-stat-card">
                <div class="backup-stat-num">${totalAnime}</div>
                <div class="backup-stat-label">Total Anime</div>
            </div>
            <div class="backup-stat-card">
                <div class="backup-stat-num" style="color: #4CAF50;">${watchedCount}</div>
                <div class="backup-stat-label">Watched</div>
            </div>
            <div class="backup-stat-card">
                <div class="backup-stat-num" style="color: var(--accent-primary);">${watchingCount}</div>
                <div class="backup-stat-label">Watching</div>
            </div>
            <div class="backup-stat-card">
                <div class="backup-stat-num" style="color: var(--accent-secondary);">${planCount}</div>
                <div class="backup-stat-label">Plan to Watch</div>
            </div>
        </div>

        <div id="backup-toast" class="backup-toast hidden"></div>

        <div class="settings-container" style="display: flex; flex-direction: column; gap: 2rem; max-width: 600px; margin: 1.5rem auto 0; background: rgba(255,255,255,0.02); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07);">
            <div class="settings-group" style="margin-bottom: 0;">
                <h3 style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.6rem;">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Export Backup
                </h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.9rem;">Download your entire anime vault to a local JSON file. You can use this file to restore your list later.</p>
                <button id="export-backup-btn" class="btn btn-primary" style="width: 100%; justify-content: center;">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Export JSON Backup (${totalAnime} anime)
                </button>
            </div>

            <div style="height: 1px; background: rgba(255,255,255,0.08); width: 100%;"></div>

            <div class="settings-group" style="margin-bottom: 0;">
                <h3 style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.6rem;">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Import Backup
                </h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.9rem;">Upload a previously exported JSON backup file. <strong style="color: var(--accent-secondary);">Warning:</strong> This will replace your current vault.</p>

                <div id="import-drop-zone" class="import-drop-zone">
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-muted); margin-bottom: 0.8rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    <div style="font-weight: 600; margin-bottom: 0.3rem; color: var(--text-main);">Drag & drop your backup file here</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">Supports AniVault JSON, MyAnimeList XML/JSON, or AniList JSON</div>
                    <div id="drop-zone-file-name" style="margin-top: 0.8rem; font-size: 0.85rem; color: var(--accent-primary); display: none;"></div>
                </div>
                <input type="file" id="import-backup-file" style="display: none;" accept=".json,.xml,.txt">

                <button id="import-backup-btn" class="btn btn-secondary" style="width: 100%; justify-content: center; margin-top: 1rem; opacity: 0.45; pointer-events: none;">
                    Import Selected File
                </button>
            </div>
        </div>
    `;

    function showBackupToast(msg, isError = false) {
        const toast = document.getElementById('backup-toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.className = `backup-toast ${isError ? 'backup-toast-error' : 'backup-toast-success'}`;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 4000);
    }

    document.getElementById('export-backup-btn').addEventListener('click', () => {
        if (!state.myList || state.myList.length === 0) {
            showBackupToast('Your vault is empty. Nothing to export.', true);
            return;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.myList, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        const date = new Date().toISOString().split('T')[0];
        downloadAnchorNode.setAttribute("download", `anivault_backup_${date}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        showBackupToast('Backup downloaded successfully!');
    });

    const importFileInput = document.getElementById('import-backup-file');
    const importBtn = document.getElementById('import-backup-btn');
    const dropZone = document.getElementById('import-drop-zone');
    const dropFileName = document.getElementById('drop-zone-file-name');
    let pendingImportFile = null;

    function handleFileSelected(file) {
        if (!file) return;
        pendingImportFile = file;
        dropFileName.textContent = '📄 ' + file.name;
        dropFileName.style.display = 'block';
        importBtn.style.opacity = '1';
        importBtn.style.pointerEvents = 'auto';
        importBtn.classList.remove('btn-secondary');
        importBtn.classList.add('btn-primary');
        dropZone.style.borderColor = 'var(--accent-primary)';
    }

    dropZone.addEventListener('click', () => importFileInput.click());
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files[0]) handleFileSelected(e.dataTransfer.files[0]);
    });
    importFileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) handleFileSelected(e.target.files[0]);
    });

    importBtn.addEventListener('click', () => {
        if (!pendingImportFile) {
            showBackupToast('Please select a backup file first.', true);
            return;
        }
        importBtn.textContent = 'Importing...';
        importBtn.style.opacity = '0.7';
        importBtn.style.pointerEvents = 'none';

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const raw = event.target.result;
                const items = parseAnimeImportData(raw);
                if (!items || items.length === 0) {
                    showBackupToast('Could not find recognizable anime data. Supports AniVault JSON, MAL XML/JSON, and AniList exports.', true);
                    importBtn.textContent = 'Import Selected File';
                    importBtn.style.opacity = '1';
                    importBtn.style.pointerEvents = 'auto';
                    return;
                }
                const res = await applyImportedAnime(items);
                showBackupToast(`✓ Imported ${res.total} anime successfully! (${res.added} added, ${res.updated} updated)`);
                pendingImportFile = null;
                importFileInput.value = '';
                dropFileName.style.display = 'none';
                importBtn.textContent = 'Import Selected File';
                importBtn.classList.add('btn-secondary');
                importBtn.classList.remove('btn-primary');
                importBtn.style.opacity = '0.45';
                importBtn.style.pointerEvents = 'none';
                dropZone.style.borderColor = '';
                setTimeout(() => renderBackupView(), 1600);
            } catch (err) {
                console.error('Import error:', err);
                showBackupToast(err.message || 'Unexpected error reading file. Please try again.', true);
                importBtn.textContent = 'Import Selected File';
                importBtn.style.opacity = '1';
                importBtn.style.pointerEvents = 'auto';
            }
        };
        reader.readAsText(pendingImportFile);
    });
}

// API Calls with fallback logic
async function fetchTopAnime(page = 1) {
    const grid = document.getElementById('anime-grid');
    if (!grid) return;
    grid.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div></div>`;
    
    // 1. Try Jikan API with 3.5s timeout
    try {
        const response = await fetchWithTimeout(`https://api.jikan.moe/v4/top/anime?limit=24&page=${page}`, {}, 3500);
        if (response.ok) {
            const data = await response.json();
            if (data && data.data && data.data.length > 0) {
                renderGrid(data.data, grid);
                return;
            }
        }
    } catch (error) {
        console.warn("Jikan API unreachable, switching to AniList:", error.message);
    }

    // 2. Try AniList GraphQL API (Fast, reliable, global CDN)
    try {
        const aniListData = await fetchFromAniList({ page, perPage: 24 });
        if (aniListData && aniListData.length > 0) {
            renderGrid(aniListData, grid);
            return;
        }
    } catch (error) {
        console.warn("AniList fallback also failed:", error.message);
    }

    // 3. Fallback to curated anime dataset (Instant, 0 latency, always works offline)
    const start = (page - 1) * 24;
    const fallbackSlice = curatedAnimeList.slice(start, start + 24);
    if (fallbackSlice.length > 0) {
        renderGrid(fallbackSlice, grid);
    } else {
        renderGrid(curatedAnimeList, grid);
    }
}

async function fetchAnimeByGenre(genreId, genreName = null) {
    const grid = document.getElementById('anime-grid');
    if (!grid) return;
    grid.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div></div>`;
    
    const resolvedName = genreName || (typeof genreId === 'string' ? genreId : 'Action');

    // 1. Try Jikan if numeric
    if (typeof genreId === 'number' || !isNaN(Number(genreId))) {
        try {
            const response = await fetchWithTimeout(`https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=score&sort=desc&limit=24`, {}, 3500);
            if (response.ok) {
                const data = await response.json();
                if (data && data.data && data.data.length > 0) {
                    renderGrid(data.data, grid);
                    return;
                }
            }
        } catch (error) {
            console.warn("Jikan genre fetch failed, using AniList:", error.message);
        }
    }

    // 2. Try AniList by genre name
    try {
        const aniListData = await fetchFromAniList({ page: 1, perPage: 24, genre: resolvedName });
        if (aniListData && aniListData.length > 0) {
            renderGrid(aniListData, grid);
            return;
        }
    } catch (e) {
        console.warn("AniList genre fetch failed:", e.message);
    }

    // 3. Curated filter fallback
    const filtered = curatedAnimeList.filter(a => a.genres && a.genres.some(g => (g.name || g).toLowerCase() === resolvedName.toLowerCase()));
    if (filtered.length > 0) {
        renderGrid(filtered, grid);
    } else {
        renderGrid(curatedAnimeList.slice(0, 12), grid);
    }
}

async function searchAnime(query) {
    searchSpinner.classList.remove('hidden');
    viewContent.innerHTML = `
        <div class="hero-section">
            <h2>Search Results</h2>
            <p>Results for "${query}"</p>
        </div>
        <div class="grid" id="anime-grid"></div>
    `;
    const grid = document.getElementById('anime-grid');
    grid.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div></div>`;

    // 1. Try Jikan search
    try {
        const response = await fetchWithTimeout(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=24`, {}, 3500);
        if (response.ok) {
            const data = await response.json();
            searchSpinner.classList.add('hidden');
            if (data && data.data && data.data.length > 0) {
                state.searchResults = data.data;
                renderGrid(data.data, grid);
                return;
            }
        }
    } catch (error) {
        console.warn("Jikan search failed, falling back to AniList:", error.message);
    }

    // 2. Try AniList search
    try {
        const aniListData = await fetchFromAniList({ page: 1, perPage: 24, search: query });
        searchSpinner.classList.add('hidden');
        if (aniListData && aniListData.length > 0) {
            state.searchResults = aniListData;
            renderGrid(aniListData, grid);
            return;
        }
    } catch (error) {
        console.warn("AniList search failed:", error.message);
    }

    searchSpinner.classList.add('hidden');

    // 3. Curated filter fallback
    const qLower = query.toLowerCase();
    const filtered = curatedAnimeList.filter(a => (a.title || '').toLowerCase().includes(qLower));
    if (filtered.length > 0) {
        state.searchResults = filtered;
        renderGrid(filtered, grid);
    } else {
        grid.innerHTML = `<div class="no-results">No results found for "${query}"</div>`;
    }
}

let currentGridAnime = [];

// Rendering
function renderGrid(animeArray, container) {
    currentGridAnime = animeArray;
    container.innerHTML = '';
    animeArray.forEach((anime, index) => {
        const card = document.createElement('div');
        card.className = 'anime-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        const id = anime.mal_id || anime.id;
        const title = anime.title || 'Unknown Title';
        const imageUrl = anime.images?.jpg?.image_url || anime.imageUrl || 'https://via.placeholder.com/225x318?text=No+Image';
        const score = anime.score || anime.rating || 'N/A';
        const year = anime.year || (anime.aired?.prop?.from?.year) || 'N/A';

        const listItem = state.myList.find(item => item.id == id);
        const listBadgeHtml = listItem ? `<div class="score-badge" style="top:auto; bottom:10px; right:10px; background:var(--accent-primary)">✓ ${formatListType(listItem.listStatus)}</div>` : '';

        let checkboxHtml = '';
        if (state.currentView === 'discover') {
            checkboxHtml = `<div class="bulk-checkbox-container" style="position: absolute; top: 10px; left: 10px; z-index: 10; background: rgba(0,0,0,0.7); border-radius: 4px; padding: 4px; display: flex; align-items: center; justify-content: center;"><input type="checkbox" class="bulk-checkbox" data-id="${id}" style="transform: scale(1.5); cursor: pointer; margin: 0; accent-color: var(--accent-primary);"></div>`;
        }

        card.innerHTML = `
            <div class="card-img-container" style="position: relative;">
                ${checkboxHtml}
                <img src="${imageUrl}" alt="${title}" loading="lazy">
                <div class="score-badge">★ ${score}</div>
                ${listBadgeHtml}
            </div>
            <div class="card-content">
                <div class="anime-title" title="${title}">${title}</div>
                <div class="anime-meta">
                    <span>${anime.type || 'TV'}</span>
                    <span>${year}</span>
                </div>
            </div>
        `;
        const checkbox = card.querySelector('.bulk-checkbox');
        if (checkbox) {
            checkbox.addEventListener('click', (e) => e.stopPropagation());
            checkbox.addEventListener('change', () => {
                if (typeof updateGlobalBulkPanel === 'function') updateGlobalBulkPanel();
            });
        }

        card.addEventListener('click', () => showAnimeDetails(id, anime));
        container.appendChild(card);
    });
}

function formatListType(type) {
    if (!type) return '';
    if (type === 'plan_to_watch') return 'Plan to Watch';
    return type.charAt(0).toUpperCase() + type.slice(1);
}

// Anime Modal View
async function showAnimeDetails(id, preloadedData) {
    modal.classList.remove('hidden');
    modalBody.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div></div>`;
    
    let animeData = null;
    let reviewsData = [];

    // 1. Try Jikan full details
    try {
        const detailsRes = await fetchWithTimeout(`https://api.jikan.moe/v4/anime/${id}/full`, {}, 3500);
        if (detailsRes.ok) {
            animeData = (await detailsRes.json()).data;
        }
    } catch (err) {
        console.warn("Detail fetch failed:", err.message);
    }

    // 2. If details failed, fallback to preloadedData or AniList
    if (!animeData) {
        if (preloadedData && (preloadedData.title || preloadedData.synopsis)) {
            animeData = preloadedData;
        } else {
            try {
                animeData = await fetchSingleFromAniList(id);
            } catch (e) { }
        }
    }

    // 3. Try reviews independently (never crashes modal)
    try {
        const reviewsRes = await fetchWithTimeout(`https://api.jikan.moe/v4/anime/${id}/reviews?limit=3`, {}, 2500);
        if (reviewsRes.ok) {
            reviewsData = (await reviewsRes.json()).data || [];
        }
    } catch (e) { }

    if (!animeData) {
        modalBody.innerHTML = `<div class="no-results">Failed to load details. Please try another anime.</div>`;
        return;
    }

    const title = animeData.title || 'Unknown Title';
    const titleJp = animeData.title_japanese || '';
    const imageUrl = animeData.images?.jpg?.large_image_url || animeData.images?.jpg?.image_url || animeData.imageUrl || '';
    const synopsis = animeData.synopsis || animeData.desc || 'No synopsis available.';
    const score = animeData.score || animeData.rating || 'N/A';
    const episodes = animeData.episodes || '?';
    const status = animeData.status || 'Unknown';
    
    const existingItem = state.myList.find(item => item.id == id);
    const currentListStatus = existingItem ? existingItem.listStatus : 'none';

    // Top Priority Area: Status Chooser
    const chooserHtml = `
        <div class="status-chooser-container">
            <div class="status-chooser" id="modal-status-chooser">
                <button class="status-btn ${currentListStatus === 'watched' ? 'active' : ''}" data-status="watched">Watched</button>
                <button class="status-btn ${currentListStatus === 'watching' ? 'active' : ''}" data-status="watching">Watching</button>
                <button class="status-btn ${currentListStatus === 'plan_to_watch' ? 'active' : ''}" data-status="plan_to_watch">Plan to Watch</button>
                <button class="status-btn ${currentListStatus === 'none' ? 'active' : ''}" data-status="none">Remove</button>
            </div>
        </div>
    `;

    // User lists for each status
    let usersWatching = [], usersWatched = [], usersPlan = [];
    Object.keys(allUsersLists).forEach(email => {
        const uList = allUsersLists[email];
        if (Array.isArray(uList)) {
            const uItem = uList.find(i => i.id == id);
            if (uItem) {
                const uData = Object.assign({ email: email }, usersDB[email] || { username: email.split('@')[0] });
                if (uItem.listStatus === 'watching') usersWatching.push(uData);
                else if (uItem.listStatus === 'watched') usersWatched.push(uData);
                else if (uItem.listStatus === 'plan_to_watch') usersPlan.push(uData);
            }
        }
    });

    const renderUsersBlock = (blockTitle, users) => {
        if (users.length === 0) return '';
        let rows = users.map(u => {
            const isOwner = u.email === 'abubakorsiddikpapel@gmail.com' || u.role === 'owner';
            const name = isOwner ? (u.username || 'SIDDIK') : (u.username || 'User');
            return `
                <div class="user-row">
                    <div class="user-row-avatar"><img src="${u.avatar || animeAvatars[0]}" alt="Avatar"></div>
                    <div class="user-row-name" style="display:flex; align-items:center; gap: 6px;">
                        <span>${name}</span>
                        ${isOwner ? '<span class="owner-tag">👑 Owner</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');
        return `<div class="status-users-section"><div class="status-users-title">${blockTitle} (${users.length})</div><div class="user-list-compact">${rows}</div></div>`;
    };

    const usersListsHtml = `
        <div class="anime-users-display">
            ${renderUsersBlock('Watching', usersWatching)}
            ${renderUsersBlock('Watched', usersWatched)}
            ${renderUsersBlock('Plan to Watch', usersPlan)}
        </div>
    `;

    const genresHtml = animeData.genres?.map(g => `<span class="genre-tag">${g.name || g}</span>`).join('') || '';

    // Reviews section
    let reviewsHtml = '<div class="modal-section-title" style="margin-top: 3rem;">Reviews & Ratings</div><div class="reviews-list">';
    if (reviewsData && reviewsData.length > 0) {
        reviewsData.forEach(rev => {
            const revImg = rev.user?.images?.jpg?.image_url || 'https://via.placeholder.com/32?text=U';
            const revName = rev.user?.username || 'Reviewer';
            const revScore = rev.score || 'N/A';
            const revText = rev.review ? rev.review.substring(0, 200) + '...' : 'Great show.';
            reviewsHtml += `
                <div class="review-item">
                    <div class="review-author">
                        <img src="${revImg}" alt="${revName}">
                        <span>${revName}</span>
                        <span class="review-score">★ ${revScore}</span>
                    </div>
                    <div class="review-content">${revText}</div>
                </div>
            `;
        });
    } else {
        reviewsHtml += '<div class="no-results" style="padding: 1.5rem 0;">No reviews available for this title.</div>';
    }
    reviewsHtml += '</div>';

    modalBody.innerHTML = `
        <div class="modal-left">
            <img src="${imageUrl}" alt="${title}" class="modal-poster">
            ${usersListsHtml}
        </div>
        <div class="modal-right">
            ${chooserHtml}
            
            <h2 class="modal-title">${title}</h2>
            <div class="modal-title-jp">${titleJp}</div>
            
            <div class="genre-container">${genresHtml}</div>

            <div class="modal-stats">
                <div class="stat-item"><span class="stat-label">Score</span><span class="stat-value">★ ${score}</span></div>
                <div class="stat-item"><span class="stat-label">Episodes</span><span class="stat-value">${episodes}</span></div>
                <div class="stat-item"><span class="stat-label">Status</span><span class="stat-value">${status}</span></div>
            </div>
            
            <div class="modal-synopsis">${synopsis}</div>
            
            ${reviewsHtml}
        </div>
    `;

    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!state.currentUser) {
                showLoginPrompt("Please sign in to track anime in your Vault!");
                return;
            }
            document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateAnimeList(id, animeData, e.target.dataset.status);
        });
    });
}

function updateAnimeList(id, animeData, newStatus) {
    if (!state.currentUser) {
        showLoginPrompt("Please sign in to track anime in your Vault!");
        return;
    }
    const existingIndex = state.myList.findIndex(item => item.id == id);
    
    if (newStatus === 'none') {
        if (existingIndex !== -1) state.myList.splice(existingIndex, 1);
    } else {
        const listItem = {
            id: id,
            title: animeData.title || 'Unknown',
            imageUrl: animeData.images?.jpg?.image_url || animeData.imageUrl || '',
            rating: animeData.score || animeData.rating || 'N/A',
            listStatus: newStatus,
            type: animeData.type || 'TV',
            year: animeData.year || (animeData.aired?.prop?.from?.year) || '',
            genres: animeData.genres || []
        };
        
        if (existingIndex !== -1) state.myList[existingIndex] = listItem;
        else state.myList.push(listItem);
    }
    
    saveList();
    
    if (state.currentView === 'discover') {
        const grid = document.getElementById('anime-grid');
        if (grid && currentGridAnime.length > 0) renderGrid(currentGridAnime, grid);
    }
    else if (state.currentView === 'genres') {
        const grid = document.getElementById('anime-grid');
        if (grid && currentGridAnime.length > 0) renderGrid(currentGridAnime, grid);
    }
    else if (state.currentView === 'vault') renderVaultView();
}

function hideModal() {
    modal.classList.add('hidden');
    setTimeout(() => { if (modal.classList.contains('hidden')) modalBody.innerHTML = ''; }, 300);
}

// Global Bulk Action Logic
function updateGlobalBulkPanel() {
    if (!state.currentUser) return;

    const checkedBoxes = document.querySelectorAll('.bulk-checkbox:checked');
    const panel = document.getElementById('global-bulk-panel');
    const countDisplay = document.getElementById('global-bulk-count');
    const applyBtn = document.getElementById('global-bulk-apply');
    const select = document.getElementById('global-bulk-status');
    
    if (!panel) return;
    
    if (checkedBoxes.length > 0) {
        panel.classList.remove('hidden');
        countDisplay.textContent = `${checkedBoxes.length} Selected`;
        applyBtn.disabled = !select.value;
    } else {
        panel.classList.add('hidden');
        select.value = "";
    }
}

function setupBulkListeners() {
    const select = document.getElementById('global-bulk-status');
    const applyBtn = document.getElementById('global-bulk-apply');
    const cancelBtn = document.getElementById('global-bulk-cancel');
    
    if (!select) return;

    select.addEventListener('change', () => {
        applyBtn.disabled = !select.value;
    });

    cancelBtn.addEventListener('click', () => {
        document.querySelectorAll('.bulk-checkbox').forEach(cb => cb.checked = false);
        updateGlobalBulkPanel();
    });

    applyBtn.addEventListener('click', () => {
        if (!state.currentUser) {
            showLoginPrompt("Please sign in to track anime in your Vault!");
            return;
        }
        const newStatus = select.value;
        if (!newStatus) return;

        const checkedBoxes = document.querySelectorAll('.bulk-checkbox:checked');
        if (checkedBoxes.length === 0) return;

        let hasChanges = false;
        checkedBoxes.forEach(cb => {
            const id = cb.dataset.id;
            const existingIndex = state.myList.findIndex(item => item.id == id);
            
            if (newStatus === 'none') {
                if (existingIndex !== -1) {
                    state.myList.splice(existingIndex, 1);
                    hasChanges = true;
                }
            } else {
                if (existingIndex !== -1) {
                    if (state.myList[existingIndex].listStatus !== newStatus) {
                        state.myList[existingIndex].listStatus = newStatus;
                        hasChanges = true;
                    }
                } else {
                    const animeData = currentGridAnime.find(a => (a.mal_id || a.id) == id);
                    if (animeData) {
                        state.myList.push({
                            id: id,
                            title: animeData.title || 'Unknown',
                            imageUrl: animeData.images?.jpg?.image_url || animeData.imageUrl || '',
                            rating: animeData.score || animeData.rating || 'N/A',
                            listStatus: newStatus,
                            type: animeData.type || 'TV',
                            year: animeData.year || (animeData.aired?.prop?.from?.year) || '',
                            genres: animeData.genres || []
                        });
                        hasChanges = true;
                    }
                }
            }
        });

        if (hasChanges) {
            saveList();
            document.querySelectorAll('.bulk-checkbox').forEach(cb => cb.checked = false);
            updateGlobalBulkPanel();
            
            const grid = document.getElementById('anime-grid');
            if (grid && currentGridAnime.length > 0) renderGrid(currentGridAnime, grid);
        }
    });
}

function applyWallpaperTheme(themeId) {
    activeWallpaper = themeId;
    localStorage.setItem('anivault_wallpaper', themeId);
    if (wallpaperAnimFrame) {
        cancelAnimationFrame(wallpaperAnimFrame);
        wallpaperAnimFrame = null;
    }
    const canvas = document.getElementById('live-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    const bgMap = {
        'particles': "url('https://media1.tenor.com/m/m57iT-Q100kAAAAd/demon-slayer-tengen.gif') center/cover no-repeat fixed",
        'sakura': 'linear-gradient(135deg, #0a0612 0%, #1a0a1a 50%, #0d0a18 100%)',
        'matrix': 'linear-gradient(135deg, #000a00 0%, #001500 100%)',
        'aurora': 'linear-gradient(135deg, #050818 0%, #0a0a20 50%, #050c18 100%)',
        'fire': 'linear-gradient(135deg, #0f0500 0%, #1a0800 50%, #0f0200 100%)',
        'ocean': 'linear-gradient(135deg, #00080f 0%, #000d18 50%, #000510 100%)'
    };
    document.body.style.background = bgMap[themeId] || bgMap['particles'];
    initLiveBackground(themeId);
}

// Live Background Animation Setup
let bgInitialized = false;
let bgTheme = 'particles';
let bgWidth = window.innerWidth;
let bgHeight = window.innerHeight;
let bgParticles = [];
let bgTime = 0;

function resizeBg() {
    const canvas = document.getElementById('live-bg');
    if (!canvas) return;
    bgWidth = canvas.width = window.innerWidth;
    bgHeight = canvas.height = window.innerHeight;
}

function initLiveBackground(themeOverride) {
    bgTheme = themeOverride || activeWallpaper || 'particles';
    const canvas = document.getElementById('live-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (!bgInitialized) {
        bgInitialized = true;
        window.addEventListener('resize', () => {
            resizeBg();
            reinitBgParticles();
        });
    }
    resizeBg();

    function makeParticle() {
        const isPink = Math.random() > 0.5;
        return {
            x: Math.random() * bgWidth, y: Math.random() * bgHeight,
            size: Math.random() * 2 + 0.5,
            speedX: Math.random() * 1 - 0.5, speedY: Math.random() * 1 - 0.5,
            life: Math.random() * 100 + 50,
            color: isPink ? `rgba(255,71,133,${Math.random()*0.5+0.2})` : `rgba(161,84,242,${Math.random()*0.5+0.2})`
        };
    }

    function makePetal() {
        return {
            x: Math.random() * bgWidth, y: -20,
            size: Math.random() * 8 + 4,
            speedX: Math.random() * 1 - 0.3,
            speedY: Math.random() * 1.5 + 0.5,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.05,
            opacity: Math.random() * 0.5 + 0.3,
            color: `hsl(${340 + Math.random()*20},80%,${75+Math.random()*15}%)`
        };
    }

    const matrixCols = Math.floor((window.innerWidth || 800) / 16);
    const matrixDrops = Array(matrixCols).fill(1);
    const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';

    const auroraBands = Array.from({length: 5}, (_, i) => ({
        offset: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.003,
        hue: 180 + i * 40
    }));

    function makeEmber() {
        return {
            x: Math.random() * bgWidth,
            y: bgHeight + 10,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 1.2,
            speedY: -(Math.random() * 2 + 1),
            life: 1.0,
            decay: Math.random() * 0.01 + 0.005
        };
    }

    function makeOceanParticle() {
        return {
            x: Math.random() * bgWidth,
            y: Math.random() * bgHeight,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 0.4 - 0.2,
            speedY: Math.random() * 0.3 - 0.15,
            opacity: Math.random() * 0.4 + 0.1,
            phase: Math.random() * Math.PI * 2,
            phaseSpeed: 0.01 + Math.random() * 0.02
        };
    }

    function reinitBgParticles() {
        bgParticles = [];
        const count = Math.min(Math.floor((bgWidth * bgHeight) / 10000), 120);
        if (bgTheme === 'particles') for (let i = 0; i < count; i++) bgParticles.push(makeParticle());
        else if (bgTheme === 'sakura') for (let i = 0; i < 80; i++) { const p = makePetal(); p.y = Math.random() * bgHeight; bgParticles.push(p); }
        else if (bgTheme === 'fire') for (let i = 0; i < 150; i++) { const e = makeEmber(); e.y = Math.random() * bgHeight; e.life = Math.random(); bgParticles.push(e); }
        else if (bgTheme === 'ocean') for (let i = 0; i < count; i++) bgParticles.push(makeOceanParticle());
    }
    reinitBgParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, bgWidth, bgHeight);
        bgTime += 0.005;

        const xOffset = Math.sin(bgTime) * 100;
        let grad = ctx.createLinearGradient(xOffset, 0, bgWidth - xOffset, bgHeight);
        grad.addColorStop(0, 'rgba(161,84,242,0.06)');
        grad.addColorStop(0.5, 'transparent');
        grad.addColorStop(1, 'rgba(255,71,133,0.06)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, bgWidth, bgHeight);

        bgParticles.forEach(p => {
            p.x += p.speedX; p.y += p.speedY;
            if (p.x < 0) p.x = bgWidth; if (p.x > bgWidth) p.x = 0;
            if (p.y < 0) p.y = bgHeight; if (p.y > bgHeight) p.y = 0;
            p.life -= 0.5;
            if (p.life <= 0) { Object.assign(p, makeParticle()); }
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
        });

        ctx.lineWidth = 0.5;
        for (let i = 0; i < bgParticles.length; i++) {
            for (let j = i+1; j < bgParticles.length; j++) {
                const dx = bgParticles[i].x - bgParticles[j].x, dy = bgParticles[i].y - bgParticles[j].y;
                const d2 = dx*dx + dy*dy;
                if (d2 < 10000) {
                    ctx.strokeStyle = `rgba(255,255,255,${0.1 - Math.sqrt(d2)/1000})`;
                    ctx.beginPath(); ctx.moveTo(bgParticles[i].x, bgParticles[i].y);
                    ctx.lineTo(bgParticles[j].x, bgParticles[j].y); ctx.stroke();
                }
            }
        }
        wallpaperAnimFrame = requestAnimationFrame(animateParticles);
    }

    function animateSakura() {
        ctx.clearRect(0, 0, bgWidth, bgHeight);
        bgParticles.forEach(p => {
            p.x += p.speedX + Math.sin(bgTime + p.y * 0.01) * 0.3;
            p.y += p.speedY;
            p.rotation += p.rotSpeed;
            if (p.y > bgHeight + 20) { Object.assign(p, makePetal()); }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        });
        bgTime += 0.01;
        wallpaperAnimFrame = requestAnimationFrame(animateSakura);
    }

    function animateMatrix() {
        ctx.fillStyle = 'rgba(0,10,0,0.05)';
        ctx.fillRect(0, 0, bgWidth, bgHeight);
        ctx.font = '14px monospace';
        matrixDrops.forEach((y, i) => {
            const ch = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            ctx.fillStyle = `rgba(0,255,65,${Math.random() * 0.5 + 0.3})`;
            ctx.fillText(ch, i * 16, y * 16);
            if (y * 16 > bgHeight && Math.random() > 0.975) matrixDrops[i] = 0;
            matrixDrops[i]++;
        });
        wallpaperAnimFrame = requestAnimationFrame(animateMatrix);
    }

    function animateAurora() {
        ctx.clearRect(0, 0, bgWidth, bgHeight);
        auroraBands.forEach((band, i) => {
            band.offset += band.speed;
            for (let x = 0; x < bgWidth; x += 4) {
                const wave = Math.sin(x * 0.005 + band.offset) * bgHeight * 0.12 + bgHeight * (0.2 + i * 0.12);
                const bandHeight = 80 + Math.sin(x * 0.003 + band.offset * 0.7) * 40;
                const grad = ctx.createLinearGradient(x, wave - bandHeight, x, wave + bandHeight);
                grad.addColorStop(0, 'transparent');
                grad.addColorStop(0.5, `hsla(${band.hue},80%,60%,0.12)`);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(x, wave - bandHeight, 4, bandHeight * 2);
            }
        });
        wallpaperAnimFrame = requestAnimationFrame(animateAurora);
    }

    function animateFire() {
        ctx.clearRect(0, 0, bgWidth, bgHeight);
        const baseGrad = ctx.createLinearGradient(0, bgHeight * 0.6, 0, bgHeight);
        baseGrad.addColorStop(0, 'transparent');
        baseGrad.addColorStop(1, 'rgba(255,60,0,0.08)');
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, bgWidth, bgHeight);

        bgParticles.forEach((p, idx) => {
            p.x += p.speedX + Math.sin(bgTime * 2 + idx) * 0.3;
            p.y += p.speedY;
            p.life -= p.decay;
            if (p.life <= 0 || p.y < -10) Object.assign(p, makeEmber());

            const alpha = p.life * 0.8;
            const hue = p.life > 0.6 ? 40 : p.life > 0.3 ? 20 : 0;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = `hsl(${hue},100%,${50 + p.life * 30}%)`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI*2); ctx.fill();
        });
        ctx.globalAlpha = 1;
        bgTime += 0.02;
        wallpaperAnimFrame = requestAnimationFrame(animateFire);
    }

    function animateOcean() {
        ctx.clearRect(0, 0, bgWidth, bgHeight);
        for (let layer = 0; layer < 3; layer++) {
            ctx.beginPath();
            ctx.moveTo(0, bgHeight);
            for (let x = 0; x <= bgWidth; x += 8) {
                const y = bgHeight * (0.4 + layer * 0.2) +
                    Math.sin(x * 0.006 + bgTime + layer * 1.2) * 40 +
                    Math.sin(x * 0.003 + bgTime * 0.7 + layer) * 20;
                x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.lineTo(bgWidth, bgHeight); ctx.closePath();
            ctx.fillStyle = `rgba(0,${80 + layer * 30},${150 + layer * 20},0.07)`;
            ctx.fill();
        }
        bgParticles.forEach(p => {
            p.phase += p.phaseSpeed;
            p.x += p.speedX; p.y += p.speedY + Math.sin(p.phase) * 0.2;
            if (p.x < 0) p.x = bgWidth; if (p.x > bgWidth) p.x = 0;
            if (p.y < 0) p.y = bgHeight; if (p.y > bgHeight) p.y = 0;
            ctx.globalAlpha = p.opacity * (0.5 + Math.sin(p.phase) * 0.5);
            ctx.fillStyle = `hsl(${180 + Math.sin(p.phase)*20},100%,65%)`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
        });
        ctx.globalAlpha = 1;
        bgTime += 0.008;
        wallpaperAnimFrame = requestAnimationFrame(animateOcean);
    }

    const animMap = {
        particles: animateParticles,
        sakura: animateSakura,
        matrix: animateMatrix,
        aurora: animateAurora,
        fire: animateFire,
        ocean: animateOcean
    };
    (animMap[bgTheme] || animateParticles)();
}

// Start application and live background
init();
applyWallpaperTheme(activeWallpaper);
