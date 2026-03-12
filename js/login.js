/**
 * Login logic for Flower Shop
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('loginPassword');

    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('bi-eye');
            togglePassword.classList.toggle('bi-eye-slash');
        });
    }

    // Handle Login submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            console.log('Đang đăng nhập với:', email);

            // Simple Admin Check
            if (email === 'admin@flowershop.com' && password === 'admin123') {
                const adminUser = {
                    email: email,
                    role: 'admin',
                    name: 'Quản trị viên'
                };
                localStorage.setItem('currentUser', JSON.stringify(adminUser));
                alert('Đăng nhập Quản trị viên thành công!');
                window.location.href = 'index.html';
            } else if (email && password) {
                // Normal User
                const normalUser = {
                    email: email,
                    role: 'user',
                    name: 'Khách hàng'
                };
                localStorage.setItem('currentUser', JSON.stringify(normalUser));
                alert('Đăng nhập Khách hàng thành công!');
                window.location.href = 'index.html';
            }
        });
    }
});
