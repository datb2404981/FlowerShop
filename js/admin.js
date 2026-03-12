/**
 * Flower Shop Admin - Main Dashboard Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const mainTableHead = document.getElementById('mainTableHead');
    const mainTableBody = document.getElementById('mainTableBody');
    const mainTitle = document.getElementById('mainTitle');
    const mainSubtitle = document.getElementById('mainSubtitle');
    const btnAddMain = document.getElementById('btnAddMain');
    const loadingPlaceholder = document.getElementById('loadingPlaceholder');
    const searchInput = document.getElementById('searchInput');
    const paginationContainer = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    // Menu links
    const menuOverview = document.getElementById('menuOverview');
    const menuProducts = document.getElementById('menuProducts');
    const menuOrders = document.getElementById('menuOrders');

    const overviewSection = document.getElementById('overviewSection');
    const tableSection = document.getElementById('tableSection');

    const addProductForm = document.getElementById('addProductForm');
    const addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'));
    const addProductModalLabel = document.getElementById('addProductModalLabel');
    const orderDetailModal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
    const orderDetailContent = document.getElementById('orderDetailContent');
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');
    const categoryFilter = document.getElementById('categoryFilter');

    let currentView = 'overview'; 
    let productsData = []; 
    let ordersData = [];   
    let filteredData = [];
    let currentPage = 1;
    let itemsPerPage = 8;
    let productIdToDelete = null;

    // 2. Sidebar Toggle for Mobile
    const toggleSidebar = () => {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
    };

    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // 3. Formatter Functions
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount).replace('₫', 'đ');
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Đã hoàn thành': return 'badge bg-success';
            case 'Đang giao': return 'badge bg-primary';
            case 'Chờ xác nhận': return 'badge bg-warning text-dark';
            case 'Đã hủy': return 'badge bg-danger';
            default: return 'badge bg-secondary';
        }
    };

    // 4. Render Pagination Controls
    const renderPagination = () => {
        if (!paginationContainer || currentView === 'overview') return;

        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) {
            paginationInfo.textContent = `Đang hiển thị tất cả ${filteredData.length} mục`;
            return;
        }

        const addPageItem = (page, text = page, isDisabled = false, isActive = false) => {
            const li = document.createElement('li');
            li.className = `page-item ${isDisabled ? 'disabled' : ''} ${isActive ? 'active' : ''}`;
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.innerHTML = text;
            if (!isDisabled && !isActive) {
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = page;
                    renderMainTable();
                });
            } else {
                a.addEventListener('click', e => e.preventDefault());
            }
            li.appendChild(a);
            paginationContainer.appendChild(li);
        };

        addPageItem(currentPage - 1, '<i class="bi bi-chevron-left"></i>', currentPage === 1);

        const delta = 1;
        const range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) range.push(i);
        if (currentPage - delta > 2) range.unshift('...');
        range.unshift(1);
        if (currentPage + delta < totalPages - 1) range.push('...');
        if (totalPages > 1) range.push(totalPages);

        range.forEach(p => {
            if (p === '...') {
                const li = document.createElement('li');
                li.className = 'page-item disabled';
                li.innerHTML = `<span class="page-link">...</span>`;
                paginationContainer.appendChild(li);
            } else {
                addPageItem(p, p, false, currentPage === p);
            }
        });

        addPageItem(currentPage + 1, '<i class="bi bi-chevron-right"></i>', currentPage === totalPages);

        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, filteredData.length);
        paginationInfo.textContent = `Đang hiển thị ${start}-${end} trên ${filteredData.length} mục`;
    };

    // 5. Render Table Content
    const renderMainTable = () => {
        if (!mainTableBody) return;
        if (loadingPlaceholder) loadingPlaceholder.style.display = 'none';

        if (currentView === 'overview') {
            overviewSection.classList.remove('d-none');
            tableSection.classList.add('d-none');
            paginationContainer.parentElement.parentElement.classList.add('d-none');
            return;
        } else {
            overviewSection.classList.add('d-none');
            tableSection.classList.remove('d-none');
            paginationContainer.parentElement.parentElement.classList.remove('d-none');
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const pageData = filteredData.slice(startIndex, startIndex + itemsPerPage);

        mainTableBody.innerHTML = '';

        if (currentView === 'products') {
            mainTableHead.innerHTML = `
                <tr>
                    <th width="80">ID</th>
                    <th width="100">Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá bán</th>
                    <th>Số lượng</th>
                    <th>Danh mục</th>
                    <th width="120">Hành động</th>
                </tr>
            `;

            if (filteredData.length === 0) {
                mainTableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4">Không tìm thấy sản phẩm nào.</td></tr>';
            } else {
                mainTableBody.innerHTML = pageData.map(p => `
                    <tr>
                        <td><strong>#${p.id}</strong></td>
                        <td><img src="${p.images[0]}" class="product-thumbnail"></td>
                        <td>
                            <div class="fw-bold">${p.name}</div>
                            <small class="text-muted">${p.description ? p.description.substring(0, 40) + '...' : ''}</small>
                        </td>
                        <td class="fw-bold text-danger">${formatCurrency(p.price)}</td>
                        <td><span class="badge ${p.stock < 20 ? 'bg-warning text-dark' : 'bg-light text-dark'}">${p.stock}</span></td>
                        <td><span class="badge-category">${Array.isArray(p.category) ? p.category[0] : p.category}</span></td>
                        <td>
                            <div class="action-btns">
                                <button class="btn-action btn-edit" onclick="window.editProduct(${p.id})"><i class="bi bi-pencil-square"></i></button>
                                <button class="btn-action btn-delete" onclick="window.confirmDeleteProduct(${p.id})"><i class="bi bi-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        } else if (currentView === 'orders') {
            mainTableHead.innerHTML = `
                <tr>
                    <th>Mã ĐH</th>
                    <th>Khách hàng</th>
                    <th>Ngày đặt</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Sản phẩm</th>
                    <th width="80">Xem</th>
                </tr>
            `;

            if (filteredData.length === 0) {
                mainTableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4">Chưa có đơn hàng nào.</td></tr>';
            } else {
                mainTableBody.innerHTML = pageData.map(o => `
                    <tr>
                        <td><strong>${o.id}</strong></td>
                        <td>${o.customer}</td>
                        <td><small>${o.date}</small></td>
                        <td class="fw-bold text-primary">${formatCurrency(o.total)}</td>
                        <td><span class="${getStatusClass(o.status)}">${o.status}</span></td>
                        <td><small>${o.items.join(', ')}</small></td>
                        <td>
                            <button class="btn-action btn-edit" onclick="window.viewOrder('${o.id}')"><i class="bi bi-eye"></i></button>
                        </td>
                    </tr>
                `).join('');
            }
        }

        renderPagination();
    };

    // 6. Data Management (LocalStorage Persistence)
    const saveToStorage = () => {
        localStorage.setItem('admin_products', JSON.stringify(productsData));
        localStorage.setItem('admin_orders', JSON.stringify(ordersData));
    };

    const fetchData = async (view) => {
        currentView = view;
        if (loadingPlaceholder) loadingPlaceholder.style.display = 'block';
        
        // 1. Try to get data from LocalStorage first
        const storedProducts = localStorage.getItem('admin_products');
        const storedOrders = localStorage.getItem('admin_orders');

        // 2. Initial load from JSON files if LocalStorage is empty
        if (!storedProducts || !storedOrders) {
            try {
                const [prodRes, orderRes] = await Promise.all([
                    fetch('data/products.json'),
                    fetch('data/orders.json')
                ]);
                productsData = await prodRes.json();
                ordersData = await orderRes.json();
                
                // Save to storage for future use
                saveToStorage();
            } catch (error) {
                console.error('Fetch error:', error);
            }
        } else {
            // Use existing storage data
            productsData = JSON.parse(storedProducts);
            ordersData = JSON.parse(storedOrders);
        }

        if (view === 'overview') {
            // Calculate stats
            document.getElementById('statTotalOrders').textContent = ordersData.length;
            const totalStock = productsData.reduce((acc, p) => acc + (p.stock || 0), 0);
            document.getElementById('statImported').textContent = totalStock + 200; 
            
            let totalSold = 0;
            ordersData.forEach(o => {
                o.items.forEach(itemStr => {
                    const qtyMatch = itemStr.match(/\((\d+)\)/);
                    totalSold += qtyMatch ? parseInt(qtyMatch[1]) : 1;
                });
            });
            document.getElementById('statSold').textContent = totalSold;

            mainTitle.textContent = 'Tổng quan Dashboard';
            mainSubtitle.textContent = 'Chào mừng bạn trở lại, đây là thống kê của tháng này';
            document.getElementById('headerActions').classList.add('d-none');
            
        renderMainTable();
        return;
    }

    if (view === 'products') {
        filteredData = [...productsData];
        mainTitle.textContent = 'Danh sách Sản phẩm';
        mainSubtitle.textContent = 'Quản lý các sản phẩm hoa trong hệ thống';
        btnAddMain.style.display = 'flex';
        categoryFilter.classList.remove('d-none');
    } else {
        filteredData = [...ordersData];
        mainTitle.textContent = 'Quản lý Đơn hàng';
        mainSubtitle.textContent = 'Theo dõi trạng thái đặt hàng của khách';
        btnAddMain.style.display = 'none';
        categoryFilter.classList.add('d-none');
    }
    
    document.getElementById('headerActions').classList.remove('d-none');
    currentPage = 1;
    renderMainTable();
};

    // 7. Actions (Add, Edit, Delete, View)
    
    // Custom Toast Function
    const showToast = (message, type = 'success') => {
        const toastEl = document.getElementById('adminToast');
        const toastMsg = document.getElementById('toastMessage');
        const toastIcon = document.getElementById('toastIcon');
        
        toastMsg.textContent = message;
        
        if (type === 'success') {
            toastEl.style.backgroundColor = 'var(--primary-color)';
            toastIcon.className = 'bi bi-check-circle-fill me-2';
        } else if (type === 'danger') {
            toastEl.style.backgroundColor = '#dc3545';
            toastIcon.className = 'bi bi-exclamation-triangle-fill me-2';
        }

        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    };

    // Add/Save Product
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('productIdHidden').value;
        const newProduct = {
            id: id ? parseInt(id) : productsData.length > 0 ? Math.max(...productsData.map(p => p.id)) + 1 : 1,
            name: document.getElementById('productName').value,
            price: parseInt(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            images: [document.getElementById('productImage').value],
            category: [document.getElementById('productCategory').value],
            description: document.getElementById('productDesc').value
        };

        if (id) {
            // Edit
            const index = productsData.findIndex(p => p.id === parseInt(id));
            if (index !== -1) productsData[index] = newProduct;
            showToast('Cập nhật sản phẩm thành công!');
        } else {
            // Add
            productsData.unshift(newProduct);
            showToast('Thêm sản phẩm mới thành công!');
        }

        // Persist to LocalStorage
        saveToStorage();

        addProductModal.hide();
        if (currentView === 'products') {
            allData = productsData;
            filteredData = [...allData];
            renderMainTable();
        }
    });

    // Image Preview logic
    const productImageInput = document.getElementById('productImage');
    const imagePreviewArea = document.getElementById('imagePreviewArea');
    const imgPreview = document.getElementById('imgPreview');

    productImageInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (url) {
            imgPreview.src = url;
            imagePreviewArea.classList.remove('d-none');
            imgPreview.onerror = () => imagePreviewArea.classList.add('d-none');
        } else {
            imagePreviewArea.classList.add('d-none');
        }
    });

    // Reset form when modal closes or opens for adding
    document.getElementById('addProductModal').addEventListener('hidden.bs.modal', () => {
        addProductForm.reset();
        document.getElementById('productIdHidden').value = '';
        addProductModalLabel.textContent = 'Thêm sản phẩm mới';
        imagePreviewArea.classList.add('d-none');
    });

    btnAddMain.addEventListener('click', () => {
        addProductModalLabel.textContent = 'Thêm sản phẩm mới';
    });

    // CRUD Global Functions for Button Clicks
    window.editProduct = (id) => {
        const product = productsData.find(p => p.id === id);
        if (!product) return;

        document.getElementById('productIdHidden').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock || 0;
        document.getElementById('productImage').value = product.images[0] || '';
        document.getElementById('productCategory').value = Array.isArray(product.category) ? product.category[0] : product.category;
        document.getElementById('productDesc').value = product.description || '';

        // Trigger preview
        productImageInput.dispatchEvent(new Event('input'));

        addProductModalLabel.textContent = 'Chỉnh sửa sản phẩm: #' + id;
        addProductModal.show();
    };

    // Custom Delete logic
    window.confirmDeleteProduct = (id) => {
        productIdToDelete = id;
        deleteConfirmModal.show();
    };

    btnConfirmDelete.addEventListener('click', () => {
        if (productIdToDelete !== null) {
            productsData = productsData.filter(p => p.id !== productIdToDelete);
            saveToStorage();
            if (currentView === 'products') {
                applyFilters();
            }
            deleteConfirmModal.hide();
            showToast('Đã xóa sản phẩm thành công!', 'danger');
            productIdToDelete = null;
        }
    });

    window.viewOrder = (id) => {
        const order = ordersData.find(o => o.id === id);
        if (!order) return;

        orderDetailContent.innerHTML = `
            <div class="mb-3"><strong>Mã đơn hàng:</strong> <span class="text-primary">${order.id}</span></div>
            <div class="mb-3"><strong>Khách hàng:</strong> ${order.customer}</div>
            <div class="mb-3"><strong>Ngày đặt:</strong> ${order.date}</div>
            <div class="mb-3"><strong>Tổng tiền:</strong> <span class="text-danger fw-bold">${formatCurrency(order.total)}</span></div>
            <div class="mb-3"><strong>Trạng thái:</strong> <span class="${getStatusClass(order.status)}">${order.status}</span></div>
            <hr>
            <h6>Danh sách sản phẩm:</h6>
            <ul class="list-group list-group-flush">
                ${order.items.map(item => `<li class="list-group-item px-0"><i class="bi bi-dot"></i> ${item}</li>`).join('')}
            </ul>
        `;
        orderDetailModal.show();
    };

    // 8. Event Listeners for switching views
    if (menuOverview) {
        menuOverview.addEventListener('click', (e) => {
            e.preventDefault();
            [menuProducts, menuOrders].forEach(m => m.classList.remove('active'));
            menuOverview.classList.add('active');
            fetchData('overview');
        });
    }

    if (menuProducts) {
        menuProducts.addEventListener('click', (e) => {
            e.preventDefault();
            [menuOverview, menuOrders].forEach(m => m.classList.remove('active'));
            menuProducts.classList.add('active');
            fetchData('products');
        });
    }

    if (menuOrders) {
        menuOrders.addEventListener('click', (e) => {
            e.preventDefault();
            [menuOverview, menuProducts].forEach(m => m.classList.remove('active'));
            menuOrders.classList.add('active');
            fetchData('orders');
        });
    }

    // Filter and Search Combination logic
    const applyFilters = () => {
        const term = searchInput.value.toLowerCase().trim();
        const category = categoryFilter.value;
        const sourceData = (currentView === 'products') ? productsData : ordersData;

        filteredData = sourceData.filter(item => {
            const matchesSearch = (currentView === 'products') 
                ? (item.name.toLowerCase().includes(term) || item.id.toString().includes(term))
                : (item.customer.toLowerCase().includes(term) || item.id.toLowerCase().includes(term));
            
            const matchesCategory = (currentView === 'products')
                ? (category === 'all' || (Array.isArray(item.category) ? item.category.includes(category) : item.category === category))
                : true;

            return matchesSearch && matchesCategory;
        });

        currentPage = 1;
        renderMainTable();
    };

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);

    // Initialize
    fetchData('overview');
});
