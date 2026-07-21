// =========================================================================
// NexBoard - Authentication & Session Management Module
// =========================================================================

const DEFAULT_USERS = {
    'admin@nexboard.com': {
        id: 'admin',
        name: 'Admin User',
        email: 'admin@nexboard.com',
        password: 'admin123',
        role: 'Project Manager',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0d9488&color=fff&bold=true',
        status: 'online'
    }
};

/**
 * Retrieves user accounts database from LocalStorage
 */
export function getUsers() {
    try {
        const saved = localStorage.getItem('nexboard_users');
        return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch(e) {
        return DEFAULT_USERS;
    }
}

/**
 * Saves user accounts dictionary to LocalStorage
 */
function saveUsers(users) {
    try {
        localStorage.setItem('nexboard_users', JSON.stringify(users));
    } catch(e) {
        console.error('Failed to save users:', e);
    }
}

/**
 * Gets currently authenticated active user profile
 */
export function getCurrentUser() {
    try {
        const saved = localStorage.getItem('nexboard_current_user');
        return saved ? JSON.parse(saved) : null;
    } catch(e) {
        return null;
    }
}

/**
 * Authenticates user with email and password
 */
export function loginUser(email, password) {
    const users = getUsers();
    const cleanEmail = email.toLowerCase().trim();
    
    const user = users[cleanEmail];
    if (!user || user.password !== password) {
        return { success: false, message: 'Invalid email or password. Please try again.' };
    }

    try {
        localStorage.setItem('nexboard_current_user', JSON.stringify(user));
    } catch(e) {
        console.error('Failed to save current user:', e);
    }

    return { success: true, user: user };
}

/**
 * Registers a new user account
 */
export function registerUser(name, email, password, role = 'Developer') {
    const users = getUsers();
    const cleanEmail = email.toLowerCase().trim();

    if (users[cleanEmail]) {
        return { success: false, message: 'An account with this email already exists.' };
    }

    const userId = name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user_' + Date.now();
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true`;

    const newUser = {
        id: userId,
        name: name,
        email: cleanEmail,
        password: password,
        role: role,
        avatar: avatarUrl,
        status: 'online'
    };

    users[cleanEmail] = newUser;
    saveUsers(users);

    try {
        localStorage.setItem('nexboard_current_user', JSON.stringify(newUser));
    } catch(e) {
        console.error('Failed to set current user:', e);
    }

    return { success: true, user: newUser };
}

/**
 * Clears active user session
 */
export function logoutUser() {
    try {
        localStorage.removeItem('nexboard_current_user');
    } catch(e) {
        console.error('Failed to logout:', e);
    }
}
