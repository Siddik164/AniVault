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
const animeAvatars = [
    "https://s4.anilist.co/file/anilistcdn/character/large/b40-qx20f5uWvJ8U.png", // Luffy
    "https://s4.anilist.co/file/anilistcdn/character/large/b62-nluA6tNlOQEI.png", // Zoro
    "https://s4.anilist.co/file/anilistcdn/character/large/b17-81Q1y0280sV7.png", // Naruto
    "https://s4.anilist.co/file/anilistcdn/character/large/b45627-1KqSntI4kXfA.png", // Levi
    "https://s4.anilist.co/file/anilistcdn/character/large/b128336-1eH83nNqfV70.jpg", // Gojo
    "https://s4.anilist.co/file/anilistcdn/character/large/b127518-nJ1Q9IerM3y6.jpg", // Nezuko
    "https://s4.anilist.co/file/anilistcdn/character/large/b126071-0A861lB7Qp05.png", // Tanjiro
    "https://s4.anilist.co/file/anilistcdn/character/large/b27-L1d3h65p7K8A.png", // Killua
    "https://s4.anilist.co/file/anilistcdn/character/large/b11-R2D2Kx6uL3qg.png", // Edward Elric
    "https://s4.anilist.co/file/anilistcdn/character/large/b85-gDXXr92U2Irt.png", // Kakashi
    "https://s4.anilist.co/file/anilistcdn/character/large/b71-sBf1j1L92g42.png", // Light
    "https://s4.anilist.co/file/anilistcdn/character/large/b40-qx20f5uWvJ8U.png"  // Luffy Duplicate for spacing if needed
];

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
            <span class="profile-name" title="${state.currentUser}">${displayName}</span>
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
    viewContent.innerHTML = `
        <div class="hero-section" style="margin-bottom: 1.5rem;">
            <h2>Personalization</h2>
            <p>Customize your AniVult presence.</p>
        </div>
        <div class="settings-container">
            <div class="settings-group">
                <h3>Nickname</h3>
                <input type="text" id="settings-nickname" class="settings-input" placeholder="Enter your nickname">
            </div>
            <div class="settings-group">
                <h3>Choose Avatar</h3>
                <div class="avatar-grid" id="settings-avatars"></div>
            </div>
            <button class="btn btn-primary" id="save-settings-btn" style="align-self: flex-start; margin-top: 1rem;">Save Changes</button>
            <div id="settings-success" style="color: #4CAF50; font-size: 0.9rem; display: none; margin-top: 1rem;">Settings saved successfully!</div>
        </div>
    `;

    const userObj = usersDB[state.currentUser] || {};
    const nicknameInput = document.getElementById('settings-nickname');
    const avatarGrid = document.getElementById('settings-avatars');
    
    nicknameInput.value = userObj.username || state.currentUser.split('@')[0];
    let selectedAvatar = userObj.avatar || animeAvatars[0];

    animeAvatars.forEach((avatarUrl) => {
        const div = document.createElement('div');
        div.className = 'avatar-option' + (selectedAvatar === avatarUrl ? ' selected' : '');
        div.innerHTML = `<img src="${avatarUrl}" alt="Avatar">`;
        
        div.addEventListener('click', () => {
            document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            selectedAvatar = avatarUrl;
        });
        avatarGrid.appendChild(div);
    });

    document.getElementById('save-settings-btn').addEventListener('click', async () => {
        const newNickname = nicknameInput.value.trim();
        if (!newNickname) return;
        
        usersDB[state.currentUser].username = newNickname;
        usersDB[state.currentUser].avatar = selectedAvatar;
        
        try {
            await db.collection('users').doc(state.currentUser).update({
                username: newNickname,
                avatar: selectedAvatar
            });
            renderUserProfile();
            
            const successMsg = document.getElementById('settings-success');
            successMsg.style.display = 'block';
            setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
        } catch (e) {
            console.error("Error saving settings:", e);
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
                    <div class="admin-member-name">${user.username || email.split('@')[0]}</div>
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
                <div class="leader-name">${displayName}</div>
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
        
        div.innerHTML = `
            <div class="chat-author" style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem;">
                <div class="profile-avatar" style="width:24px; height:24px; font-size:0.7rem;">${avatarContent}</div>
                <span style="font-weight:600;">${msg.author}</span> ${roleBadge}
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

        const checkboxHtml = `<div class="bulk-checkbox-container" style="position: absolute; top: 10px; left: 10px; z-index: 10; background: rgba(0,0,0,0.7); border-radius: 4px; padding: 4px; display: flex; align-items: center; justify-content: center;"><input type="checkbox" class="bulk-checkbox" data-id="${id}" style="transform: scale(1.5); cursor: pointer; margin: 0; accent-color: var(--accent-primary);"></div>`;

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
        checkbox.addEventListener('click', (e) => e.stopPropagation());
        checkbox.addEventListener('change', () => {
            if (typeof updateGlobalBulkPanel === 'function') updateGlobalBulkPanel();
        });

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

// Live Background Animation
function initLiveBackground() {
    const canvas = document.getElementById('live-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.life = Math.random() * 100 + 50;
            
            // Theme accent colors: Primary (#a154f2) and Secondary (#ff4785)
            const isPink = Math.random() > 0.5;
            this.color = isPink ? `rgba(255, 71, 133, ${Math.random() * 0.5 + 0.2})` : `rgba(161, 84, 242, ${Math.random() * 0.5 + 0.2})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
            
            this.life -= 0.5;
            if (this.life <= 0) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.life = Math.random() * 100 + 50;
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        // Dynamically adjust particle count based on screen size for performance
        // Slightly reduced density for better optimization
        const numParticles = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 100);
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }
    
    // Re-init particles on significant resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initParticles, 300);
    });
    
    initParticles();
    
    let time = 0;
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Subtle moving aurora gradient effect
        time += 0.005;
        const xOffset = Math.sin(time) * 100;
        let gradient = ctx.createLinearGradient(0 + xOffset, 0, width - xOffset, height);
        gradient.addColorStop(0, 'rgba(161, 84, 242, 0.08)');
        gradient.addColorStop(0.5, 'transparent');
        gradient.addColorStop(1, 'rgba(255, 71, 133, 0.08)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw and update particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        // Faint lines between nearby particles for a "constellation" effect
        // Optimized with squared distance instead of Math.sqrt
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distSq = dx * dx + dy * dy;
                
                // 100 * 100 = 10000
                if (distSq < 10000) {
                    const distance = Math.sqrt(distSq);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance / 1000})`;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }
    
    animate();
}

// Start background
initLiveBackground();
