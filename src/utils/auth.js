const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

// Admin Credentials
const ADMIN_EMAIL = 'sanjana@kpmg.com';
const ADMIN_PASSWORD = 'Welcome@1234';

/**
 * Get all registered users
 */
export const getUsers = () => {
    try {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error parsing users from localStorage', error);
        return [];
    }
};

/**
 * Save users array to localStorage
 */
export const saveUsers = (users) => {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error('Error saving users to localStorage', error);
    }
};

/**
 * Register a new Leader or Employee
 */
export const registerUser = (userData) => {
    const users = getUsers();

    // Prevent duplicate registration
    const existingUser = users.find(u => u.email === userData.email && u.role === userData.role);
    if (existingUser) {
        return { success: false, message: 'Account already exists for this role.' };
    }

    // Save new user
    users.push({
        email: userData.email,
        password: userData.password,
        role: userData.role
    });
    saveUsers(users);

    // Auto-login after registration
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email: userData.email, role: userData.role }));
    return { success: true };
};

/**
 * Login a user (Admin, Leader, or Employee)
 */
export const loginUser = (email, password, role) => {
    // Hardcoded Admin logic
    if (role === 'admin') {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email, role: 'admin' }));
            return { success: true };
        }
        return { success: false, message: 'Invalid IT Admin credentials.' };
    }

    // Leader / Employee logic
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password && u.role === role);

    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email, role }));
        return { success: true };
    }

    return { success: false, message: 'Invalid credentials or account does not exist.' };
};

/**
 * Logout the current user
 */
export const logoutUser = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

/**
 * Get the currently logged in user
 */
export const getCurrentUser = () => {
    try {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        return null;
    }
};
