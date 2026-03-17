const CURRENT_USER_KEY = 'currentUser';
const API_URL = 'http://localhost:3001/users';

// Admin Credentials
const ADMIN_EMAIL = 'sanjana@kpmg.com';
const ADMIN_PASSWORD = 'Welcome@1234';

/**
 * Get all registered users from json-server
 */
export const getUsers = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    } catch (error) {
        console.error('Error fetching users from json-server', error);
        return [];
    }
};

/**
 * Register a new Leader or Employee
 */
export const registerUser = async (userData) => {
    try {
        const users = await getUsers();

        // Prevent duplicate registration
        const existingUser = users.find(u => u.email === userData.email && u.role === userData.role);
        if (existingUser) {
            return { success: false, message: 'Account already exists for this role.' };
        }

        // Save new user via POST request
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userData.email,
                password: userData.password,
                role: userData.role
            })
        });

        if (!response.ok) throw new Error('Failed to register user');

        // Auto-login after registration
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email: userData.email, role: userData.role }));
        return { success: true };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'An error occurred during registration.' };
    }
};

/**
 * Login a user (Admin, Leader, or Employee)
 */
export const loginUser = async (email, password, role) => {
    // Hardcoded Admin logic
    if (role === 'admin') {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email, role: 'admin' }));
            return { success: true };
        }
        return { success: false, message: 'Invalid IT Admin credentials.' };
    }

    // Leader / Employee logic
    try {
        const users = await getUsers();
        const user = users.find(u => u.email === email && u.password === password && u.role === role);

        if (user) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email, role }));
            return { success: true };
        }

        return { success: false, message: 'Invalid credentials or account does not exist.' };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'An error occurred during login.' };
    }
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
