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
let allUsersLists = {}; // To store everyone's list for the social features

// Extended Working Avatars (Using Anilist CDN for reliable hotlinking)
// Organized by category for the personalization section
const animeAvatarCategories = {
    "Shonen Legends": [
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb40-qx20f5uWvJ8U.png&w=200&h=200&fit=cover&output=webp", name: "Luffy" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb62-nluA6tNlOQEI.png&w=200&h=200&fit=cover&output=webp", name: "Zoro" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb17-81Q1y0280sV7.png&w=200&h=200&fit=cover&output=webp", name: "Naruto" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb1-dVgdEfJt3ozR.png&w=200&h=200&fit=cover&output=webp", name: "Goku" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb27-L1d3h65p7K8A.png&w=200&h=200&fit=cover&output=webp", name: "Killua" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb11-R2D2Kx6uL3qg.png&w=200&h=200&fit=cover&output=webp", name: "Edward Elric" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb30-ZGiPIE6GQY3N.png&w=200&h=200&fit=cover&output=webp", name: "Ichigo" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb72-vJA9D7DzANTn.png&w=200&h=200&fit=cover&output=webp", name: "Natsu" },
    ],
    "Dark & Serious": [
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb45627-1KqSntI4kXfA.png&w=200&h=200&fit=cover&output=webp", name: "Levi" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb85-gDXXr92U2Irt.png&w=200&h=200&fit=cover&output=webp", name: "Kakashi" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb71-sBf1j1L92g42.png&w=200&h=200&fit=cover&output=webp", name: "Light Yagami" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb88-bKCkQv52MuUB.png&w=200&h=200&fit=cover&output=webp", name: "Itachi" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb417-puDGvuGT7RB6.png&w=200&h=200&fit=cover&output=webp", name: "Kaneki" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb118737-M3tHfDJF6Hpd.jpg&w=200&h=200&fit=cover&output=webp", name: "Eren" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb56986-fzL5VRFiVImW.png&w=200&h=200&fit=cover&output=webp", name: "Madara" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb74-vT5FhVXWVD64.png&w=200&h=200&fit=cover&output=webp", name: "L Lawliet" },
    ],
    "Demon Slayer": [
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb126071-0A861lB7Qp05.png&w=200&h=200&fit=cover&output=webp", name: "Tanjiro" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127518-nJ1Q9IerM3y6.jpg&w=200&h=200&fit=cover&output=webp", name: "Nezuko" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb128336-1eH83nNqfV70.jpg&w=200&h=200&fit=cover&output=webp", name: "Gojo" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127540-D9YIyvJfWHIX.png&w=200&h=200&fit=cover&output=webp", name: "Zenitsu" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127541-2m7cCrFhqxMH.png&w=200&h=200&fit=cover&output=webp", name: "Inosuke" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127542-mBq2gFZQnvhQ.png&w=200&h=200&fit=cover&output=webp", name: "Rengoku" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb147421-tCWoTu9HPVBH.png&w=200&h=200&fit=cover&output=webp", name: "Douma" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127561-8P0cFHAqioC0.png&w=200&h=200&fit=cover&output=webp", name: "Shinobu" },
    ],
    "Iconic Girls": [
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb13701-vEVbKByGv6bD.png&w=200&h=200&fit=cover&output=webp", name: "Mikasa" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb20-lIcHoKHHDKsh.png&w=200&h=200&fit=cover&output=webp", name: "Hinata" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb120792-cg1Gn3bfKwz7.jpg&w=200&h=200&fit=cover&output=webp", name: "Yor Forger" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb114737-IHLJEXBjm42m.png&w=200&h=200&fit=cover&output=webp", name: "Zero Two" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb116281-IFxy8s6De60R.png&w=200&h=200&fit=cover&output=webp", name: "Raphtalia" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb100811-2OZKfEpFkiX6.png&w=200&h=200&fit=cover&output=webp", name: "Rem" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb79067-Vc2RiGb6B8dL.png&w=200&h=200&fit=cover&output=webp", name: "Asuna" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb36511-Q02kCk2rYZLf.png&w=200&h=200&fit=cover&output=webp", name: "Erza" },
    ],
    "Jujutsu Kaisen": [
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127505-K6q0Z3PLUVLT.png&w=200&h=200&fit=cover&output=webp", name: "Yuji Itadori" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127506-ux5S3xWTGyrT.png&w=200&h=200&fit=cover&output=webp", name: "Megumi Fushiguro" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127507-mjnsBGXQI3SZ.png&w=200&h=200&fit=cover&output=webp", name: "Nobara" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb128509-0fLjJbqPTbFX.jpg&w=200&h=200&fit=cover&output=webp", name: "Ryomen Sukuna" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127508-vwuXQqMaRY8K.png&w=200&h=200&fit=cover&output=webp", name: "Nanami" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb127509-E3o6DXIxZkRd.jpg&w=200&h=200&fit=cover&output=webp", name: "Toge Inumaki" },
    ],
    "Classic & Retro": [
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb3-4z5CSFHkgIam.png&w=200&h=200&fit=cover&output=webp", name: "Spike Spiegel" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb5-JbJBzLBY8ZXg.png&w=200&h=200&fit=cover&output=webp", name: "Vash" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb70-MiGEp8P8Izf3.png&w=200&h=200&fit=cover&output=webp", name: "Yusuke Urameshi" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb32-ZpMPjzGFxYUt.png&w=200&h=200&fit=cover&output=webp", name: "Inuyasha" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb55-YiLNUqeRH9mN.png&w=200&h=200&fit=cover&output=webp", name: "Roy Mustang" },
        { url: "https://wsrv.nl/?url=https%3A%2F%2Fs4.anilist.co%2Ffile%2Fanilistcdn%2Fcharacter%2Flarge%2Fb31-iicLIXHoIBWD.png&w=200&h=200&fit=cover&output=webp", name: "Vegeta" },
    ],
};

// Flat array for backwards compatibility (random selection on signup)
const animeAvatars = Object.values(animeAvatarCategories).flat().map(a => a.url);

const state = {
    currentUser: currentUser,
    currentView: 'discover',
    searchResults: [],
    myList: []
};

// Request tracker to prevent race conditions
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

let isLoginMode = true;

// Initialize
async function init() {
    setupBulkListeners();
    try {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } catch (e) { console.warn("Persistence error:", e); }
    
    if (state.currentUser) {
        loginOverlay.classList.add('hidden');
        document.querySelector('.app-container').style.display = 'flex';
    }
    
    setupEventListeners();
    
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            state.currentUser = user.email;
            localStorage.setItem('anivult_remembered_user', user.email);
            
            // Sync all users and lists for social features (admin & modal user lists)
            await syncAllData();
            
            // Ensure owner
            if (user.email === 'abubakorsiddikpapel@gmail.com') {
                try {
                    const ownerDoc = await db.collection('users').doc(user.email).get();
                    if (!ownerDoc.exists || ownerDoc.data().role !== 'owner') {
                        await db.collection('users').doc(user.email).set({
                            role: "owner",
                            username: "Papel",
                            avatar: animeAvatars[3],
                            joinDate: new Date().toISOString()
                        }, { merge: true });
                        usersDB[user.email].role = 'owner';
                    }
                } catch(e) { }
            }
            
            checkAuthStatus();
        } else {
            state.currentUser = null;
            state.myList = [];
            localStorage.removeItem('anivult_remembered_user');
            checkAuthStatus();
        }
    });
}

async function syncAllData() {
    try {
        const usersSnap = await db.collection('users').get();
        usersSnap.forEach(doc => { usersDB[doc.id] = doc.data(); });
        
        const listsSnap = await db.collection('lists').get();
        listsSnap.forEach(doc => { allUsersLists[doc.id] = doc.data().items || []; });
        
        if (state.currentUser && allUsersLists[state.currentUser]) {
            state.myList = allUsersLists[state.currentUser];
        } else {
            state.myList = [];
        }
    } catch(err) { console.error("Sync error:", err); }
}

function getBadgeHtml(email) {
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
        if (usersDB[email].username === username) return email;
    }
    return null;
}

function checkAuthStatus() {
    const appContainer = document.querySelector('.app-container');
    if (state.currentUser) {
        loginOverlay.classList.add('hidden');
        if (appContainer) appContainer.style.display = 'flex';
        renderUserProfile();
        
        // Show Admin Nav if Owner
        const me = usersDB[state.currentUser];
        if (me && me.role === 'owner') {
            adminNavItem.classList.remove('hidden');
        } else {
            adminNavItem.classList.add('hidden');
        }

        if (state.currentView === 'discover' && !document.getElementById('anime-grid')) {
            renderDiscoverView();
        }
    } else {
        loginOverlay.classList.remove('hidden');
        if (appContainer) appContainer.style.display = 'none';
        emailInput.focus();
    }
}

function renderUserProfile() {
    if (!state.currentUser) {
        userProfileBadge.classList.add('hidden');
        return;
    }
    
    userProfileBadge.classList.remove('hidden');
    const userObj = usersDB[state.currentUser] || {};
    const displayName = userObj.username || state.currentUser.split('@')[0];
    const avatarContent = userObj.avatar ? `<img src="${userObj.avatar}" alt="Avatar">` : state.currentUser.charAt(0).toUpperCase();
    
    let roleClass = '';
    if (userObj.role === 'owner') roleClass = 'role-owner';
    else if (userObj.role === 'moderator') roleClass = 'role-moderator';
    else if (userObj.role === 'officer') roleClass = 'role-officer';
    else if (userObj.role === 'celebrity') roleClass = 'role-celebrity';

    userProfileBadge.innerHTML = `
        <div class="profile-avatar">${avatarContent}</div>
        <div class="profile-info">
            <span class="profile-name" title="${state.currentUser}" style="display:flex; align-items:center;">${displayName} ${getBadgeHtml(state.currentUser)}</span>
            <span class="profile-role ${roleClass}">${userObj.role || 'Member'}</span>
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
    if (!state.currentUser) return;
    try {
        await db.collection('lists').doc(state.currentUser).set({ items: state.myList });
        allUsersLists[state.currentUser] = state.myList; // update local cache
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

    logoutBtn.addEventListener('click', logout);

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;
            if(!view) return;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            state.currentView = view;
            currentGenreId = null; // reset filter
            
            if (view === 'discover') renderDiscoverView();
            else if (view === 'chat') renderChatView();
            else if (view === 'leaderboard') renderLeaderboardView();
            else if (view === 'settings') renderPersonalizationView();
            else if (view === 'genres') renderGenresView();
            else if (view === 'admin') renderAdminView();
            else if (view === 'vault') renderVaultView();
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
        if (query.length < 3) {
            if (query.length === 0 && state.currentView === 'discover') renderDiscoverView();
            return;
        }
        debounceTimer = setTimeout(() => {
            if (state.currentView !== 'discover') {
                navItems.forEach(nav => nav.classList.remove('active'));
                document.querySelector('[data-view="discover"]').classList.add('active');
                state.currentView = 'discover';
            }
            searchAnime(query);
        }, 500);
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

    document.getElementById('prev-page-btn').addEventListener('click', () => {
        if (discoverPage > 1) {
            discoverPage--;
            renderDiscoverView();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    document.getElementById('next-page-btn').addEventListener('click', () => {
        discoverPage++;
        renderDiscoverView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('refresh-discover-btn').addEventListener('click', () => {
        fetchTopAnime(discoverPage);
    });

    fetchTopAnime(discoverPage);
}

function renderPersonalizationView() {
    const userObj = usersDB[state.currentUser] || {};
    const watchedCount = (allUsersLists[state.currentUser] || []).filter(i => i.listStatus === 'watched').length;
    const watchingCount = (allUsersLists[state.currentUser] || []).filter(i => i.listStatus === 'watching').length;
    const planCount = (allUsersLists[state.currentUser] || []).filter(i => i.listStatus === 'plan_to_watch').length;

    viewContent.innerHTML = `
        <div class="hero-section" style="margin-bottom: 1.5rem;">
            <h2>Personalization</h2>
            <p>Customize your AniVult presence.</p>
        </div>

        <!-- Profile Stats Card -->
        <div class="profile-stats-card">
            <div class="profile-stats-avatar" id="preview-avatar">
                ${userObj.avatar ? `<img src="${userObj.avatar}" alt="Avatar">` : (state.currentUser.charAt(0).toUpperCase())}
            </div>
            <div class="profile-stats-info">
                <div class="profile-stats-name">${userObj.username || state.currentUser.split('@')[0]}</div>
                <div class="profile-stats-role">${userObj.role || 'Member'}</div>
                <div class="profile-stats-numbers">
                    <div class="stat-pill"><span>${watchedCount}</span> Watched</div>
                    <div class="stat-pill"><span>${watchingCount}</span> Watching</div>
                    <div class="stat-pill"><span>${planCount}</span> Plan to Watch</div>
                </div>
            </div>
        </div>

        <div class="settings-container" style="margin-top: 2rem;">
            <div class="settings-group">
                <h3>Nickname</h3>
                <input type="text" id="settings-nickname" class="settings-input" placeholder="Enter your nickname" maxlength="30">
                <div style="color: var(--text-muted); font-size: 0.8rem; margin-top: 0.4rem;">Max 30 characters. Displayed in chat & leaderboard.</div>
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

    nicknameInput.value = userObj.username || state.currentUser.split('@')[0];
    bioInput.value = userObj.bio || '';
    bioCounter.textContent = `${bioInput.value.length} / 150`;

    bioInput.addEventListener('input', () => {
        bioCounter.textContent = `${bioInput.value.length} / 150`;
    });

    let selectedAvatar = userObj.avatar || animeAvatars[0];
    let activeCategory = Object.keys(animeAvatarCategories)[0];

    // Render category tabs
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

    // Render avatars for a category
    function renderAvatarsForCategory(cat) {
        avatarGrid.innerHTML = '';
        const avatarsInCat = animeAvatarCategories[cat];
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
                // Update live preview
                const preview = document.getElementById('preview-avatar');
                if (preview) preview.innerHTML = `<img src="${url}" alt="${name}">`;
            });
            avatarGrid.appendChild(div);
        });
    }

    renderCategoryTabs();
    renderAvatarsForCategory(activeCategory);

    // Wallpaper theme picker
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
        const newNickname = nicknameInput.value.trim();
        const newBio = bioInput.value.trim();
        if (!newNickname) { nicknameInput.focus(); return; }

        const successMsg = document.getElementById('settings-success');
        const errorMsg = document.getElementById('settings-error');

        usersDB[state.currentUser] = usersDB[state.currentUser] || {};
        usersDB[state.currentUser].username = newNickname;
        usersDB[state.currentUser].avatar = selectedAvatar;
        usersDB[state.currentUser].bio = newBio;

        try {
            await db.collection('users').doc(state.currentUser).update({
                username: newNickname,
                avatar: selectedAvatar,
                bio: newBio
            });
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

    try {
        const response = await fetch('https://api.jikan.moe/v4/genres/anime');
        const data = await response.json();
        
        if (data && data.data) {
            const allowedGenres = ["Action", "Romance", "Isekai", "Thriller", "Fantasy", "Sci-Fi", "Slice of Life", "Horror", "Sports"];
            // Isekai might not be a top-level genre in Jikan, usually it's "Boys Love", "Gourmet", etc. or a theme. 
            // We will filter by name if exists.
            let targetGenres = data.data.filter(g => allowedGenres.includes(g.name));
            
            const filtersContainer = document.getElementById('genre-filters');
            filtersContainer.innerHTML = '';
            
            targetGenres.forEach(genre => {
                const btn = document.createElement('button');
                btn.className = `genre-filter-btn ${currentGenreId === genre.mal_id ? 'active' : ''}`;
                btn.innerHTML = `
                    ${genre.name} 
                    <span class="genre-count">${genre.count}</span>
                `;
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.genre-filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentGenreId = genre.mal_id;
                    fetchAnimeByGenre(currentGenreId);
                });
                filtersContainer.appendChild(btn);
            });

            // Load first genre by default if none selected
            if (!currentGenreId && targetGenres.length > 0) {
                currentGenreId = targetGenres[0].mal_id;
                filtersContainer.firstChild.classList.add('active');
                fetchAnimeByGenre(currentGenreId);
            } else if (currentGenreId) {
                fetchAnimeByGenre(currentGenreId);
            }
        }
    } catch (err) {
        document.getElementById('genre-filters').innerHTML = 'Failed to load genres.';
    }
}

async function renderAdminView() {
    const me = usersDB[state.currentUser];
    if (!me || me.role !== 'owner') {
        viewContent.innerHTML = `<div class="hero-section"><h2>Access Denied</h2><p>You do not have permission to view this page.</p></div>`;
        return;
    }

    await syncAllData(); // Ensure latest data

    const totalMembers = Object.keys(usersDB).length;
    let membersHtml = '';
    
    Object.keys(usersDB).forEach(email => {
        const user = usersDB[email];
        const joinDate = user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Unknown';
        const isOwner = email === 'abubakorsiddikpapel@gmail.com';
        
        let roleOptions = `
            <select class="admin-role-select" data-email="${email}" ${isOwner ? 'disabled' : ''}>
                <option value="member" ${user.role === 'member' || !user.role ? 'selected' : ''}>Member</option>
                <option value="moderator" ${user.role === 'moderator' ? 'selected' : ''}>Moderator</option>
                <option value="officer" ${user.role === 'officer' ? 'selected' : ''}>Officer</option>
                <option value="celebrity" ${user.role === 'celebrity' ? 'selected' : ''}>Celebrity</option>
                ${isOwner ? '<option value="owner" selected>Owner</option>' : ''}
            </select>
        `;

        membersHtml += `
            <div class="admin-member-item">
                <div class="user-row-avatar"><img src="${user.avatar || animeAvatars[0]}" alt="Avatar"></div>
                <div class="admin-member-info">
                    <div class="admin-member-name" style="display:flex; align-items:center;">${user.username || email.split('@')[0]} ${getBadgeHtml(email)}</div>
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
            <p>Manage AniVult platform and members.</p>
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

    document.querySelectorAll('.admin-role-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const email = e.target.dataset.email;
            const newRole = e.target.value;
            try {
                await db.collection('users').doc(email).update({ role: newRole });
                usersDB[email].role = newRole;
                // Visual feedback can be added here
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
        listContainer.innerHTML = `<div class="no-results">No users found.</div>`;
        return;
    }
    
    rankings.forEach((user, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        const rankClass = index < 3 ? `rank-${index + 1}` : '';
        const displayName = user.username || user.email.split('@')[0];
        const avatarContent = user.avatar ? `<img src="${user.avatar}" alt="Avatar">` : user.email.charAt(0).toUpperCase();
        
        let roleBadge = '';
        if (user.role !== 'member') {
            roleBadge = `<span class="profile-role role-${user.role}">${user.role}</span>`;
        }

        item.innerHTML = `
            <div class="rank ${rankClass}">#${index + 1}</div>
            <div class="profile-avatar">${avatarContent}</div>
            <div class="leader-info">
                <div class="leader-name" style="display:flex; align-items:center;">${displayName} ${getBadgeHtml(user.email)}</div>
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
            <p>Chat with other AniVult users.</p>
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
        if (state.currentView !== 'chat') { chatUnsubscribe(); return; }
        let chatDB = doc.exists ? doc.data().messages || [] : [];
        renderChatMessages(chatDB);
    });
    
    document.getElementById('chat-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        
        const userObj = usersDB[state.currentUser] || {};
        
        const newMessage = {
            author: userObj.username || state.currentUser.split('@')[0],
            avatar: userObj.avatar,
            role: userObj.role || 'member',
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
        container.innerHTML = `<div style="text-align:center; color:var(--text-muted); margin-top:2rem;">No messages yet.</div>`;
        return;
    }
    
    const myName = (usersDB[state.currentUser] || {}).username || (state.currentUser ? state.currentUser.split('@')[0] : '');
    
    chatDB.forEach(msg => {
        const isMe = msg.author === myName;
        const div = document.createElement('div');
        div.className = `chat-message ${isMe ? 'self' : ''}`;
        
        let roleBadge = '';
        if (msg.role && msg.role !== 'member') {
            roleBadge = `<span class="profile-role role-${msg.role}" style="font-size:0.6rem; margin-left:0.4rem;">${msg.role}</span>`;
        }
        
        const avatarContent = msg.avatar ? `<img src="${msg.avatar}" alt="Avatar">` : '?';
        
        let emailForBadge = getEmailFromUsername(msg.author);
        let badgeHtml = emailForBadge ? getBadgeHtml(emailForBadge) : '';
        
        div.innerHTML = `
            <div class="chat-author" style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem;">
                <div class="profile-avatar" style="width:24px; height:24px; font-size:0.7rem;">${avatarContent}</div>
                <span style="font-weight:600; display:flex; align-items:center;">${msg.author} ${badgeHtml}</span> ${roleBadge}
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
        grid.innerHTML = `<div class="no-results" style="grid-column: 1/-1;">No anime found in this category.</div>`;
    } else {
        renderGrid(displayList, grid);
    }
}

function renderBadgesView() {
    const bulkPanel = document.getElementById('global-bulk-panel');
    if (bulkPanel) bulkPanel.classList.add('hidden');

    const myListForUser = allUsersLists[state.currentUser] || [];
    const watchedCount = myListForUser.filter(i => i.listStatus === 'watched').length;
    const watchingCount = myListForUser.filter(i => i.listStatus === 'watching').length;
    const planCount = myListForUser.filter(i => i.listStatus === 'plan_to_watch').length;
    const totalTracked = myListForUser.length;

    // Define all badges with tiers, icons, unlock conditions
    const allBadges = [
        // --- Watcher tiers ---
        {
            id: 'first_watch', icon: '🥉', name: 'First Watch', desc: 'Mark your first anime as Watched.',
            tier: 'bronze', unlocked: watchedCount >= 1,
            progress: Math.min(watchedCount, 1), goal: 1, unit: 'watched'
        },
        {
            id: 'beginner', icon: '🌱', name: 'Beginner', desc: 'Watch 10 anime.',
            tier: 'bronze', unlocked: watchedCount >= 10,
            progress: Math.min(watchedCount, 10), goal: 10, unit: 'watched'
        },
        {
            id: 'dedicated', icon: '📺', name: 'Dedicated Viewer', desc: 'Watch 50 anime.',
            tier: 'silver', unlocked: watchedCount >= 50,
            progress: Math.min(watchedCount, 50), goal: 50, unit: 'watched'
        },
        {
            id: 'intermediate', icon: '🥇', name: 'Intermediate', desc: 'Watch 200 anime.',
            tier: 'gold', unlocked: watchedCount >= 200,
            progress: Math.min(watchedCount, 200), goal: 200, unit: 'watched'
        },
        {
            id: 'advanced', icon: '💎', name: 'Advanced', desc: 'Watch 500 anime.',
            tier: 'diamond', unlocked: watchedCount >= 500,
            progress: Math.min(watchedCount, 500), goal: 500, unit: 'watched'
        },
        {
            id: 'expert', icon: '👑', name: 'Expert', desc: 'Watch 1000 anime. Legendary.',
            tier: 'legendary', unlocked: watchedCount >= 1000,
            progress: Math.min(watchedCount, 1000), goal: 1000, unit: 'watched'
        },
        // --- Tracker tiers ---
        {
            id: 'list_starter', icon: '📋', name: 'List Starter', desc: 'Add 5 anime to your vault.',
            tier: 'bronze', unlocked: totalTracked >= 5,
            progress: Math.min(totalTracked, 5), goal: 5, unit: 'tracked'
        },
        {
            id: 'curator', icon: '🗂️', name: 'Curator', desc: 'Track 25 anime in any status.',
            tier: 'silver', unlocked: totalTracked >= 25,
            progress: Math.min(totalTracked, 25), goal: 25, unit: 'tracked'
        },
        {
            id: 'archivist', icon: '🏛️', name: 'Archivist', desc: 'Track 100 anime in your vault.',
            tier: 'gold', unlocked: totalTracked >= 100,
            progress: Math.min(totalTracked, 100), goal: 100, unit: 'tracked'
        },
        // --- Watchlist tiers ---
        {
            id: 'planner', icon: '🔖', name: 'The Planner', desc: 'Add 10 anime to Plan to Watch.',
            tier: 'bronze', unlocked: planCount >= 10,
            progress: Math.min(planCount, 10), goal: 10, unit: 'planned'
        },
        {
            id: 'binge_watcher', icon: '🍿', name: 'Binge Watcher', desc: 'Have 5 anime in Watching at once.',
            tier: 'silver', unlocked: watchingCount >= 5,
            progress: Math.min(watchingCount, 5), goal: 5, unit: 'watching'
        },
        {
            id: 'completionist', icon: '✅', name: 'Completionist', desc: 'Watch 100 anime.',
            tier: 'gold', unlocked: watchedCount >= 100,
            progress: Math.min(watchedCount, 100), goal: 100, unit: 'watched'
        },
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

        <!-- Summary row -->
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
                <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.9rem;">Upload a previously exported JSON backup file. <strong style="color: var(--accent-secondary);">Warning:</strong> This will replace your current vault. Export first if needed.</p>

                <div id="import-drop-zone" class="import-drop-zone">
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-muted); margin-bottom: 0.8rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    <div style="font-weight: 600; margin-bottom: 0.3rem; color: var(--text-main);">Drag & drop your backup file here</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">or click to browse (.json)</div>
                    <div id="drop-zone-file-name" style="margin-top: 0.8rem; font-size: 0.85rem; color: var(--accent-primary); display: none;"></div>
                </div>
                <input type="file" id="import-backup-file" style="display: none;" accept=".json,.txt">

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
        // Enable button using style (NOT the disabled attribute which blocks click events)
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
                let importedData;
                try {
                    importedData = JSON.parse(raw);
                } catch (parseErr) {
                    showBackupToast('Could not parse file — make sure it is a valid JSON backup.', true);
                    importBtn.textContent = 'Import Selected File';
                    importBtn.style.opacity = '1';
                    importBtn.style.pointerEvents = 'auto';
                    return;
                }
                if (!Array.isArray(importedData)) {
                    showBackupToast('Invalid format — expected a JSON array of anime items.', true);
                    importBtn.textContent = 'Import Selected File';
                    importBtn.style.opacity = '1';
                    importBtn.style.pointerEvents = 'auto';
                    return;
                }
                // Relax validation: only require at least 'id' or 'title' to handle various backup formats
                const isValid = importedData.length === 0 || importedData.some(item => item && (item.id !== undefined || item.title));
                if (!isValid) {
                    showBackupToast('File appears corrupted — no recognizable anime data found.', true);
                    importBtn.textContent = 'Import Selected File';
                    importBtn.style.opacity = '1';
                    importBtn.style.pointerEvents = 'auto';
                    return;
                }
                state.myList = importedData;
                await saveList();
                allUsersLists[state.currentUser] = state.myList;
                showBackupToast('✓ Imported ' + importedData.length + ' anime successfully! Your vault is updated.');
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
                showBackupToast('Unexpected error reading file. Please try again.', true);
                importBtn.textContent = 'Import Selected File';
                importBtn.style.opacity = '1';
                importBtn.style.pointerEvents = 'auto';
            }
        };
        reader.onerror = () => {
            showBackupToast('Could not read file. Please try again.', true);
            importBtn.textContent = 'Import Selected File';
            importBtn.style.opacity = '1';
            importBtn.style.pointerEvents = 'auto';
        };
        reader.readAsText(pendingImportFile);
    });
}

// API Calls
async function fetchTopAnime(page = 1) {
    const grid = document.getElementById('anime-grid');
    if (!grid) return;
    grid.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div></div>`;
    
    try {
        const response = await fetch(`https://api.jikan.moe/v4/top/anime?limit=24&page=${page}`);
        const data = await response.json();
        if (data && data.data) renderGrid(data.data, grid);
    } catch (error) {
        grid.innerHTML = `<div class="no-results">Failed to fetch anime.</div>`;
    }
}

async function fetchAnimeByGenre(genreId) {
    const grid = document.getElementById('anime-grid');
    if (!grid) return;
    grid.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div></div>`;
    
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=score&sort=desc&limit=24`);
        const data = await response.json();
        if (data && data.data) renderGrid(data.data, grid);
    } catch (error) {
        grid.innerHTML = `<div class="no-results">Failed to fetch anime for genre.</div>`;
    }
}

async function searchAnime(query) {
    searchSpinner.classList.remove('hidden');
    let grid = document.getElementById('anime-grid');
    if (!grid) {
        viewContent.innerHTML = `<div class="hero-section"><h2>Search Results</h2><p>Results for "${query}"</p></div><div class="grid" id="anime-grid"></div>`;
        grid = document.getElementById('anime-grid');
    }
    
    grid.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div></div>`;

    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=24`);
        const data = await response.json();
        searchSpinner.classList.add('hidden');
        if (data && data.data) {
            state.searchResults = data.data;
            if (data.data.length === 0) grid.innerHTML = `<div class="no-results">No results found for "${query}"</div>`;
            else renderGrid(data.data, grid);
        }
    } catch (error) {
        searchSpinner.classList.add('hidden');
        grid.innerHTML = `<div class="no-results">Search failed.</div>`;
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
    if (type === 'plan_to_watch') return 'Plan to Watch';
    return type.charAt(0).toUpperCase() + type.slice(1);
}

// Anime Modal View (Priority structure requested by user)
async function showAnimeDetails(id, preloadedData) {
    modal.classList.remove('hidden');
    modalBody.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div></div>`;
    
    let animeData = null;
    let reviewsData = null;

    try {
        const [detailsRes, reviewsRes] = await Promise.all([
            fetch(`https://api.jikan.moe/v4/anime/${id}/full`),
            fetch(`https://api.jikan.moe/v4/anime/${id}/reviews?limit=3`)
        ]);
        animeData = (await detailsRes.json()).data;
        reviewsData = (await reviewsRes.json()).data;
    } catch (err) { console.error("Detail error", err); }

    if (!animeData) {
        modalBody.innerHTML = `<div class="no-results">Failed to load details.</div>`;
        return;
    }

    const title = animeData.title;
    const titleJp = animeData.title_japanese || '';
    const imageUrl = animeData.images?.jpg?.large_image_url || animeData.imageUrl || '';
    const synopsis = animeData.synopsis || animeData.desc || 'No synopsis available.';
    const score = animeData.score || animeData.rating || 'N/A';
    const episodes = animeData.episodes || '?';
    const status = animeData.status || 'Unknown';
    
    const existingItem = state.myList.find(item => item.id == id);
    const currentListStatus = existingItem ? existingItem.listStatus : 'none';

    // 1. Top Priority Area: Status Chooser
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

    // 2. User lists for each status
    let usersWatching = [], usersWatched = [], usersPlan = [];
    Object.keys(allUsersLists).forEach(email => {
        const uList = allUsersLists[email];
        const uItem = uList.find(i => i.id == id);
        if (uItem) {
            const uData = usersDB[email] || { username: email.split('@')[0] };
            if (uItem.listStatus === 'watching') usersWatching.push(uData);
            else if (uItem.listStatus === 'watched') usersWatched.push(uData);
            else if (uItem.listStatus === 'plan_to_watch') usersPlan.push(uData);
        }
    });

    const renderUsersBlock = (title, users) => {
        if (users.length === 0) return '';
        let rows = users.map(u => `
            <div class="user-row">
                <div class="user-row-avatar"><img src="${u.avatar || animeAvatars[0]}" alt="Avatar"></div>
                <div class="user-row-name">${u.username}</div>
            </div>
        `).join('');
        return `<div class="status-users-section"><div class="status-users-title">${title} (${users.length})</div><div class="user-list-compact">${rows}</div></div>`;
    };

    const usersListsHtml = `
        <div class="anime-users-display">
            ${renderUsersBlock('Watching', usersWatching)}
            ${renderUsersBlock('Watched', usersWatched)}
            ${renderUsersBlock('Plan to Watch', usersPlan)}
        </div>
    `;

    // 3. Main Content
    const genresHtml = animeData.genres?.map(g => `<span class="genre-tag">${g.name}</span>`).join('') || '';

    // 4. Reviews Bottom
    let reviewsHtml = '<div class="modal-section-title" style="margin-top: 3rem;">Reviews & Ratings</div><div class="reviews-list">';
    if (reviewsData && reviewsData.length > 0) {
        reviewsData.forEach(rev => {
            reviewsHtml += `
                <div class="review-item">
                    <div class="review-author">
                        <img src="${rev.user.images.jpg.image_url}" alt="${rev.user.username}">
                        <span>${rev.user.username}</span>
                        <span class="review-score">★ ${rev.score}</span>
                    </div>
                    <div class="review-content">${rev.review.substring(0, 200)}...</div>
                </div>
            `;
        });
    } else {
        reviewsHtml += '<div class="no-reviews">No reviews found.</div>';
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

    // Status Selector Logic
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateAnimeList(id, animeData, e.target.dataset.status);
        });
    });
}

function updateAnimeList(id, animeData, newStatus) {
    const existingIndex = state.myList.findIndex(item => item.id == id);
    
    if (newStatus === 'none') {
        if (existingIndex !== -1) state.myList.splice(existingIndex, 1);
    } else {
        const listItem = {
            id: id,
            title: animeData.title,
            imageUrl: animeData.images?.jpg?.image_url || animeData.imageUrl,
            rating: animeData.score || animeData.rating,
            listStatus: newStatus,
            type: animeData.type,
            year: animeData.year || (animeData.aired?.prop?.from?.year) || '',
            genres: animeData.genres || []
        };
        
        if (existingIndex !== -1) state.myList[existingIndex] = listItem;
        else state.myList.push(listItem);
    }
    
    saveList();
    
    // We don't hide modal immediately to allow users to see the button active state
    // Just refresh the background grid if needed
    if (state.currentView === 'discover') renderDiscoverView();
    else if (state.currentView === 'genres') fetchAnimeByGenre(currentGenreId);
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
                            imageUrl: animeData.images?.jpg?.image_url || animeData.imageUrl,
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
            
            if (state.currentView === 'discover') renderDiscoverView();
            else if (state.currentView === 'genres') fetchAnimeByGenre(currentGenreId);
            else if (state.currentView === 'vault') renderVaultView();
            else {
                 const grid = document.getElementById('anime-grid');
                 if (grid) renderGrid(currentGridAnime, grid);
            }
        }
    });
}

init();

// ===== WALLPAPER THEMES =====
const wallpaperThemes = [
    {
        id: 'particles',
        name: 'Void Particles',
        icon: '✨',
        desc: 'Purple & pink floating constellation',
        bgCss: 'none'
    },
    {
        id: 'sakura',
        name: 'Sakura Storm',
        icon: '🌸',
        desc: 'Falling cherry blossom petals',
        bgCss: 'none'
    },
    {
        id: 'matrix',
        name: 'Digital Rain',
        icon: '💻',
        desc: 'Green matrix-style code rain',
        bgCss: 'none'
    },
    {
        id: 'aurora',
        name: 'Aurora Wave',
        icon: '🌌',
        desc: 'Flowing northern lights colors',
        bgCss: 'none'
    },
    {
        id: 'fire',
        name: 'Soul Flame',
        icon: '🔥',
        desc: 'Rising fire embers and sparks',
        bgCss: 'none'
    },
    {
        id: 'ocean',
        name: 'Dark Ocean',
        icon: '🌊',
        desc: 'Deep ocean waves rippling',
        bgCss: 'none'
    }
];

let activeWallpaper = localStorage.getItem('anivault_wallpaper') || 'particles';
let wallpaperAnimFrame = null;

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
    // Update body background based on theme
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
// ===== END WALLPAPER THEMES =====

// Live Background Animation — Multi-theme
function initLiveBackground(themeOverride) {
    const theme = themeOverride || activeWallpaper || 'particles';
    const canvas = document.getElementById('live-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, particles = [], time = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => { resize(); initParticles(); }, 300);
    });

    const COUNT = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 10000), 120);

    // ---- PARTICLES (Void) ----
    function makeParticle() {
        const isPink = Math.random() > 0.5;
        return {
            x: Math.random() * width, y: Math.random() * height,
            size: Math.random() * 2 + 0.5,
            speedX: Math.random() * 1 - 0.5, speedY: Math.random() * 1 - 0.5,
            life: Math.random() * 100 + 50,
            color: isPink ? `rgba(255,71,133,${Math.random()*0.5+0.2})` : `rgba(161,84,242,${Math.random()*0.5+0.2})`
        };
    }

    // ---- SAKURA ----
    function makePetal() {
        return {
            x: Math.random() * width, y: -20,
            size: Math.random() * 8 + 4,
            speedX: Math.random() * 1 - 0.3,
            speedY: Math.random() * 1.5 + 0.5,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.05,
            opacity: Math.random() * 0.5 + 0.3,
            color: `hsl(${340 + Math.random()*20},80%,${75+Math.random()*15}%)`
        };
    }

    // ---- MATRIX ----
    const matrixCols = Math.floor((window.innerWidth || 800) / 16);
    const matrixDrops = Array(matrixCols).fill(1);
    const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';

    // ---- AURORA ----
    const auroraBands = Array.from({length: 5}, (_, i) => ({
        offset: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.003,
        hue: 180 + i * 40
    }));

    // ---- FIRE / EMBER ----
    function makeEmber() {
        return {
            x: Math.random() * width,
            y: height + 10,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 1.2,
            speedY: -(Math.random() * 2 + 1),
            life: 1.0,
            decay: Math.random() * 0.01 + 0.005
        };
    }

    // ---- OCEAN ----
    function makeOceanParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 0.4 - 0.2,
            speedY: Math.random() * 0.3 - 0.15,
            opacity: Math.random() * 0.4 + 0.1,
            phase: Math.random() * Math.PI * 2,
            phaseSpeed: 0.01 + Math.random() * 0.02
        };
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 10000), 120);
        if (theme === 'particles') for (let i = 0; i < count; i++) particles.push(makeParticle());
        else if (theme === 'sakura') for (let i = 0; i < 80; i++) { const p = makePetal(); p.y = Math.random() * height; particles.push(p); }
        else if (theme === 'fire') for (let i = 0; i < 150; i++) { const e = makeEmber(); e.y = Math.random() * height; e.life = Math.random(); particles.push(e); }
        else if (theme === 'ocean') for (let i = 0; i < count; i++) particles.push(makeOceanParticle());
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        time += 0.005;

        // Ambient overlay
        const xOffset = Math.sin(time) * 100;
        let grad = ctx.createLinearGradient(xOffset, 0, width - xOffset, height);
        grad.addColorStop(0, 'rgba(161,84,242,0.06)');
        grad.addColorStop(0.5, 'transparent');
        grad.addColorStop(1, 'rgba(255,71,133,0.06)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.speedX; p.y += p.speedY;
            if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
            p.life -= 0.5;
            if (p.life <= 0) { Object.assign(p, makeParticle()); }
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
        });

        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i+1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                const d2 = dx*dx + dy*dy;
                if (d2 < 10000) {
                    ctx.strokeStyle = `rgba(255,255,255,${0.1 - Math.sqrt(d2)/1000})`;
                    ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
                }
            }
        }
        wallpaperAnimFrame = requestAnimationFrame(animateParticles);
    }

    function animateSakura() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.speedX + Math.sin(time + p.y * 0.01) * 0.3;
            p.y += p.speedY;
            p.rotation += p.rotSpeed;
            if (p.y > height + 20) { Object.assign(p, makePetal()); }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            // Petal shape
            ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        });
        time += 0.01;
        wallpaperAnimFrame = requestAnimationFrame(animateSakura);
    }

    function animateMatrix() {
        ctx.fillStyle = 'rgba(0,10,0,0.05)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#00ff41';
        ctx.font = '14px monospace';
        matrixDrops.forEach((y, i) => {
            const ch = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            ctx.fillStyle = `rgba(0,255,65,${Math.random() * 0.5 + 0.3})`;
            ctx.fillText(ch, i * 16, y * 16);
            if (y * 16 > height && Math.random() > 0.975) matrixDrops[i] = 0;
            matrixDrops[i]++;
        });
        wallpaperAnimFrame = requestAnimationFrame(animateMatrix);
    }

    function animateAurora() {
        ctx.clearRect(0, 0, width, height);
        auroraBands.forEach((band, i) => {
            band.offset += band.speed;
            for (let x = 0; x < width; x += 4) {
                const wave = Math.sin(x * 0.005 + band.offset) * height * 0.12 + height * (0.2 + i * 0.12);
                const bandHeight = 80 + Math.sin(x * 0.003 + band.offset * 0.7) * 40;
                const grad = ctx.createLinearGradient(x, wave - bandHeight, x, wave + bandHeight);
                grad.addColorStop(0, 'transparent');
                grad.addColorStop(0.5, `hsla(${band.hue},80%,60%,0.12)`);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(x, wave - bandHeight, 4, bandHeight * 2);
            }
        });
        // Stars
        if (!animateAurora._stars) {
            animateAurora._stars = Array.from({length: 120}, () => ({
                x: Math.random() * 99999 % width,
                y: Math.random() * height * 0.6,
                r: Math.random() * 1.2 + 0.3,
                twinkle: Math.random() * Math.PI * 2
            }));
        }
        animateAurora._stars.forEach(s => {
            s.twinkle += 0.02;
            ctx.globalAlpha = 0.3 + Math.sin(s.twinkle) * 0.3;
            ctx.fillStyle = 'white';
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
        });
        ctx.globalAlpha = 1;
        wallpaperAnimFrame = requestAnimationFrame(animateAurora);
    }

    function animateFire() {
        ctx.clearRect(0, 0, width, height);
        // Base glow
        const baseGrad = ctx.createLinearGradient(0, height * 0.6, 0, height);
        baseGrad.addColorStop(0, 'transparent');
        baseGrad.addColorStop(1, 'rgba(255,60,0,0.08)');
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p, idx) => {
            p.x += p.speedX + Math.sin(time * 2 + idx) * 0.3;
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
        time += 0.02;
        wallpaperAnimFrame = requestAnimationFrame(animateFire);
    }

    function animateOcean() {
        ctx.clearRect(0, 0, width, height);
        // Wave layers
        for (let layer = 0; layer < 3; layer++) {
            ctx.beginPath();
            ctx.moveTo(0, height);
            for (let x = 0; x <= width; x += 8) {
                const y = height * (0.4 + layer * 0.2) +
                    Math.sin(x * 0.006 + time + layer * 1.2) * 40 +
                    Math.sin(x * 0.003 + time * 0.7 + layer) * 20;
                x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.lineTo(width, height); ctx.closePath();
            ctx.fillStyle = `rgba(0,${80 + layer * 30},${150 + layer * 20},0.07)`;
            ctx.fill();
        }
        // Bioluminescent particles
        particles.forEach(p => {
            p.phase += p.phaseSpeed;
            p.x += p.speedX; p.y += p.speedY + Math.sin(p.phase) * 0.2;
            if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
            ctx.globalAlpha = p.opacity * (0.5 + Math.sin(p.phase) * 0.5);
            ctx.fillStyle = `hsl(${180 + Math.sin(p.phase)*20},100%,65%)`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
        });
        ctx.globalAlpha = 1;
        time += 0.008;
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
    (animMap[theme] || animateParticles)();
}

// Start background with saved or default theme
applyWallpaperTheme(activeWallpaper);
