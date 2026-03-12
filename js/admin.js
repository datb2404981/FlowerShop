/**
 * Flower Shop Admin - Product Management Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const tableBody = document.getElementById('productTableBody');
    const loadingPlaceholder = document.getElementById('loadingPlaceholder');
    const searchInput = document.getElementById('searchInput');

    let allProducts = [];

    // 2. Sidebar Toggle for Mobile
    const toggleSidebar = () => {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
    };

    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // 3. Price Formatter (Vietnamese format: 1.500.000đ)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount).replace('₫', 'đ');
    };

    // 4. Render Products into Table
    const renderAdminProducts = (products) => {
        if (!tableBody) return;
        
        // Hide loading state
        if (loadingPlaceholder) loadingPlaceholder.style.display = 'none';

        // Clear existing rows
        tableBody.innerHTML = '';

        if (products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">Không tìm thấy sản phẩm nào.</td></tr>';
            return;
        }

        // Generate rows using .map()
        const rows = products.map(product => {
            // Get the first image as thumbnail
            const thumbnail = (product.images && product.images.length > 0) 
                ? product.images[0] 
                : 'assets/images/placeholder.jpg';
            
            // Join categories if it's an array
            const categoryText = Array.isArray(product.category) 
                ? product.category.join(', ') 
                : product.category;

            return `
                <tr>
                    <td><strong>#${product.id}</strong></td>
                    <td>
                        <img src="${thumbnail}" alt="${product.name}" class="product-thumbnail">
                    </td>
                    <td>
                        <div class="fw-bold">${product.name}</div>
                        <small class="text-muted">${product.description ? product.description.substring(0, 50) + '...' : ''}</small>
                    </td>
                    <td class="fw-bold text-danger">${formatCurrency(product.price)}</td>
                    <td><span class="badge-category">${categoryText}</span></td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-action btn-edit" title="Chỉnh sửa (Chưa cài đặt)">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                            <button class="btn-action btn-delete" title="Xóa (Chưa cài đặt)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Inject into table
        tableBody.innerHTML = rows;
    };

    // 5. Fetch Data from products.json
    const fetchProducts = async () => {
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            allProducts = await response.json();
            renderAdminProducts(allProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            if (loadingPlaceholder) {
                loadingPlaceholder.innerHTML = `
                    <div class="text-danger">
                        <i class="bi bi-exclamation-triangle-fill fs-1"></i>
                        <p class="mt-2 text-dark">Lỗi tải dữ liệu. Hãy kiểm tra file products.json!</p>
                    </div>
                `;
            }
        }
    };

    // 6. Basic Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const filteredProducts = allProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm) || 
                p.id.toString().includes(searchTerm) ||
                (Array.isArray(p.category) ? p.category.join(' ').toLowerCase().includes(searchTerm) : p.category.toLowerCase().includes(searchTerm))
            );
            renderAdminProducts(filteredProducts);
        });
    }

    // Initialize
    fetchProducts();
});
