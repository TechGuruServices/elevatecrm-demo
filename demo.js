/**
 * ElevateCRM Demo JavaScript
 * Handles all interactive functionality for the demo
 */

// Global state management
let currentSection = 'dashboard';
let orderCounter = 4;
let leadCounter = 5;
let scanHistory = [];

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeDemo();
    
    // Show initial status message
    showStatusMessage('ElevateCRM Demo loaded successfully!', 'success');
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            
            // Update active navigation button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
            
            currentSection = targetSection;
            
            // Trigger section-specific initialization
            initializeSection(targetSection);
        });
    });
}

/**
 * Initialize demo data and functionality
 */
function initializeDemo() {
    // Set up real-time dashboard updates
    setInterval(updateDashboardMetrics, 30000); // Update every 30 seconds
    
    // Initialize barcode scanner animation
    initializeScannerAnimation();
}

/**
 * Initialize section-specific functionality
 */
function initializeSection(sectionName) {
    switch(sectionName) {
        case 'dashboard':
            updateDashboardMetrics();
            break;
        case 'barcode':
            resetScannerViewport();
            break;
        default:
            break;
    }
}

/**
 * DASHBOARD FUNCTIONALITY
 */

/**
 * Update dashboard metrics with simulated real-time data
 */
function updateDashboardMetrics() {
    const metrics = document.querySelectorAll('.metric');
    
    // Simulate small changes in metrics
    metrics.forEach((metric, index) => {
        const currentValue = parseInt(metric.textContent.replace(/[^\d]/g, ''));
        let newValue;
        
        switch(index) {
            case 0: // Active Leads
                newValue = currentValue + Math.floor(Math.random() * 3) - 1;
                break;
            case 1: // Inventory Items
                newValue = Math.max(1500, currentValue + Math.floor(Math.random() * 10) - 5);
                break;
            case 2: // Pending Orders
                newValue = Math.max(0, currentValue + Math.floor(Math.random() * 3) - 1);
                break;
            case 3: // Monthly Revenue
                newValue = currentValue + Math.floor(Math.random() * 1000) - 500;
                break;
        }
        
        if (index === 3) {
            metric.textContent = `$${newValue.toLocaleString()}`;
        } else {
            metric.textContent = newValue.toLocaleString();
        }
    });
}

/**
 * LEAD FLOW FUNCTIONALITY
 */

/**
 * Promote a lead card to the next stage
 */
function promoteCard(button, targetStage) {
    const card = button.closest('.lead-card');
    const currentStage = card.closest('.lead-stage');
    const targetStageElement = document.querySelector(`.lead-stage:nth-child(${getStageIndex(targetStage)})`);
    
    if (!targetStageElement) {
        showStatusMessage('Error: Target stage not found', 'error');
        return;
    }
    
    // Clone the card
    const clonedCard = card.cloneNode(true);
    
    // Update button based on new stage
    updateLeadButton(clonedCard, targetStage);
    
    // Add promotion animation
    card.style.transform = 'translateX(100px)';
    card.style.opacity = '0.5';
    
    setTimeout(() => {
        // Remove original card
        card.remove();
        
        // Add to target stage
        targetStageElement.appendChild(clonedCard);
        
        // Animate new card in
        clonedCard.style.transform = 'translateX(-100px)';
        clonedCard.style.opacity = '0.5';
        
        setTimeout(() => {
            clonedCard.style.transform = 'translateX(0)';
            clonedCard.style.opacity = '1';
        }, 50);
        
        showStatusMessage(`Lead promoted to ${targetStage}!`, 'success');
    }, 300);
}

/**
 * Get stage index for targeting
 */
function getStageIndex(stageName) {
    const stageMap = {
        'qualified': 2,
        'proposal': 3,
        'closed': 4
    };
    return stageMap[stageName] || 1;
}

/**
 * Update lead button based on stage
 */
function updateLeadButton(card, stage) {
    const button = card.querySelector('button');
    
    switch(stage) {
        case 'qualified':
            button.textContent = 'Send Proposal';
            button.className = 'btn btn-success';
            button.setAttribute('onclick', "promoteCard(this, 'proposal')");
            break;
        case 'proposal':
            button.textContent = 'Close Deal';
            button.className = 'btn btn-warning';
            button.setAttribute('onclick', "promoteCard(this, 'closed')");
            break;
        case 'closed':
            button.textContent = 'Completed';
            button.className = 'btn btn-secondary';
            button.disabled = true;
            button.removeAttribute('onclick');
            break;
    }
}

/**
 * INVENTORY FUNCTIONALITY
 */

/**
 * Reserve stock for an inventory item
 */
function reserveStock(button) {
    const item = button.closest('.inventory-item');
    const stockElement = item.querySelector('.stock-level');
    const currentStock = parseInt(stockElement.textContent);
    
    if (currentStock <= 0) {
        showStatusMessage('Cannot reserve - item out of stock!', 'error');
        return;
    }
    
    // Decrease stock by 1
    const newStock = currentStock - 1;
    stockElement.textContent = `${newStock} units`;
    
    // Update stock level class
    updateStockLevelClass(stockElement, newStock);
    
    // Disable button temporarily
    button.disabled = true;
    button.textContent = 'Reserved...';
    
    setTimeout(() => {
        button.disabled = false;
        button.textContent = 'Reserve Stock';
    }, 2000);
    
    const itemName = item.querySelector('h4').textContent;
    showStatusMessage(`Reserved 1 unit of ${itemName}`, 'success');
}

/**
 * Update stock level visual indicator
 */
function updateStockLevelClass(element, stock) {
    element.className = 'stock-level';
    
    if (stock >= 50) {
        element.classList.add('high');
    } else if (stock >= 20) {
        element.classList.add('medium');
    } else {
        element.classList.add('low');
    }
}

/**
 * Add new inventory item (simulation)
 */
function addInventoryItem() {
    const grid = document.querySelector('.inventory-grid');
    const newItem = createInventoryItem();
    
    grid.appendChild(newItem);
    
    // Animate in
    newItem.style.transform = 'scale(0.8)';
    newItem.style.opacity = '0';
    
    setTimeout(() => {
        newItem.style.transform = 'scale(1)';
        newItem.style.opacity = '1';
    }, 50);
    
    showStatusMessage('New inventory item added!', 'success');
}

/**
 * Create a new inventory item element
 */
function createInventoryItem() {
    const items = [
        { name: 'Super Widget E', sku: 'SWE-005', stock: 75, price: 79.99 },
        { name: 'Mega Gadget F', sku: 'MGF-006', stock: 42, price: 159.99 },
        { name: 'Ultra Tool G', sku: 'UTG-007', stock: 18, price: 249.99 }
    ];
    
    const randomItem = items[Math.floor(Math.random() * items.length)];
    
    const div = document.createElement('div');
    div.className = 'inventory-item';
    div.style.transition = 'all 0.3s ease';
    
    div.innerHTML = `
        <h4>${randomItem.name}</h4>
        <p>SKU: ${randomItem.sku}</p>
        <p>Stock: <span class="stock-level ${getStockClass(randomItem.stock)}">${randomItem.stock} units</span></p>
        <p>Price: $${randomItem.price}</p>
        <button class="btn btn-secondary" onclick="reserveStock(this)">Reserve Stock</button>
    `;
    
    return div;
}

/**
 * Get stock class based on quantity
 */
function getStockClass(stock) {
    if (stock >= 50) return 'high';
    if (stock >= 20) return 'medium';
    return 'low';
}

/**
 * ORDER MANAGEMENT FUNCTIONALITY
 */

/**
 * Create a new order (simulation)
 */
function createNewOrder() {
    const ordersList = document.querySelector('.orders-list');
    const newOrder = createOrderElement();
    
    ordersList.insertBefore(newOrder, ordersList.firstChild);
    
    // Animate in
    newOrder.style.transform = 'translateY(-20px)';
    newOrder.style.opacity = '0';
    
    setTimeout(() => {
        newOrder.style.transform = 'translateY(0)';
        newOrder.style.opacity = '1';
    }, 50);
    
    showStatusMessage('New order created successfully!', 'success');
}

/**
 * Create a new order element
 */
function createOrderElement() {
    const customers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'];
    const items = [
        'Widget Pro A (1)',
        'Gadget Deluxe B (2)',
        'Tool Master C (1)',
        'Device Ultra D (3)'
    ];
    
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const item = items[Math.floor(Math.random() * items.length)];
    const total = (Math.random() * 500 + 50).toFixed(2);
    
    const div = document.createElement('div');
    div.className = 'order-card';
    div.style.transition = 'all 0.3s ease';
    
    div.innerHTML = `
        <div class="order-header">
            <h4>Order #ORD-${String(orderCounter).padStart(3, '0')}</h4>
            <span class="status pending">Pending</span>
        </div>
        <p>Customer: ${customer}</p>
        <p>Items: ${item}</p>
        <p>Total: $${total}</p>
        <button class="btn btn-success" onclick="processOrder(this)">Process Order</button>
    `;
    
    orderCounter++;
    return div;
}

/**
 * Process an order
 */
function processOrder(button) {
    const orderCard = button.closest('.order-card');
    const statusElement = orderCard.querySelector('.status');
    
    statusElement.textContent = 'Processing';
    statusElement.className = 'status processing';
    
    button.textContent = 'Ship Order';
    button.className = 'btn btn-warning';
    button.setAttribute('onclick', 'shipOrder(this)');
    
    showStatusMessage('Order moved to processing!', 'info');
}

/**
 * Ship an order
 */
function shipOrder(button) {
    const orderCard = button.closest('.order-card');
    const statusElement = orderCard.querySelector('.status');
    const orderContent = orderCard.querySelector('.order-header').nextElementSibling;
    
    statusElement.textContent = 'Shipped';
    statusElement.className = 'status shipped';
    
    // Add tracking info
    const trackingInfo = document.createElement('p');
    trackingInfo.textContent = `Tracking: TRK${Math.random().toString().substr(2, 9)}`;
    orderCard.insertBefore(trackingInfo, button);
    
    button.remove();
    
    showStatusMessage('Order shipped successfully!', 'success');
}

/**
 * BARCODE/QR SCANNER FUNCTIONALITY
 */

/**
 * Initialize scanner animation
 */
function initializeScannerAnimation() {
    // Scanner is already animated via CSS
}

/**
 * Reset scanner viewport
 */
function resetScannerViewport() {
    const scanResult = document.getElementById('scanResult');
    const scanData = document.getElementById('scanData');
    const scanActions = document.getElementById('scanActions');
    
    scanData.textContent = 'No scan performed yet';
    scanActions.style.display = 'none';
}

/**
 * Simulate a barcode/QR scan
 */
function simulateScan() {
    const scanTypes = [
        { type: 'SKU', data: 'WPA-001', description: 'Widget Pro A' },
        { type: 'SKU', data: 'GDB-002', description: 'Gadget Deluxe B' },
        { type: 'SKU', data: 'TMC-003', description: 'Tool Master C' },
        { type: 'QR', data: 'ORD-001', description: 'Order Lookup' },
        { type: 'QR', data: 'ORD-002', description: 'Order Lookup' },
        { type: 'Barcode', data: '1234567890123', description: 'Generic Product' }
    ];
    
    const randomScan = scanTypes[Math.floor(Math.random() * scanTypes.length)];
    
    // Simulate scanning delay
    const scanData = document.getElementById('scanData');
    const scanActions = document.getElementById('scanActions');
    
    scanData.textContent = 'Scanning...';
    scanActions.style.display = 'none';
    
    setTimeout(() => {
        scanData.textContent = `${randomScan.type}: ${randomScan.data} - ${randomScan.description}`;
        scanActions.style.display = 'flex';
        
        // Add to scan history
        addToScanHistory(randomScan);
        
        showStatusMessage(`Scanned: ${randomScan.description}`, 'success');
    }, 1500);
}

/**
 * Add scan to history
 */
function addToScanHistory(scanData) {
    const historyList = document.getElementById('scanHistoryList');
    const now = new Date();
    const timeString = `${now.getMinutes()} minutes ago`;
    
    const newScan = document.createElement('li');
    newScan.textContent = `${scanData.type}: ${scanData.data} - ${scanData.description} (${timeString})`;
    
    historyList.insertBefore(newScan, historyList.firstChild);
    
    // Keep only last 5 items
    while (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
    }
}

/**
 * Toggle camera (simulation)
 */
function toggleCamera() {
    const viewport = document.querySelector('.scanner-viewport');
    
    if (viewport.style.background === 'linear-gradient(45deg, #333, #666)') {
        viewport.style.background = '#000';
        showStatusMessage('Camera activated', 'info');
    } else {
        viewport.style.background = 'linear-gradient(45deg, #333, #666)';
        showStatusMessage('Camera deactivated', 'info');
    }
}

/**
 * Add scanned item to inventory
 */
function addToInventory() {
    showStatusMessage('Item added to inventory tracking', 'success');
    
    // Simulate adding to inventory
    setTimeout(() => {
        if (currentSection === 'inventory') {
            addInventoryItem();
        }
    }, 1000);
}

/**
 * View details of scanned item
 */
function viewDetails() {
    const scanData = document.getElementById('scanData').textContent;
    showStatusMessage(`Viewing details for: ${scanData}`, 'info');
    
    // In a real app, this would open a detailed view
    setTimeout(() => {
        showStatusMessage('Details view would open here', 'info');
    }, 1500);
}

/**
 * UTILITY FUNCTIONS
 */

/**
 * Show status message to user
 */
function showStatusMessage(message, type = 'info') {
    const statusElement = document.getElementById('statusMessage');
    
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
    statusElement.classList.add('show');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        statusElement.classList.remove('show');
    }, 3000);
}

/**
 * Format numbers with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Generate random ID
 */
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Animate element entrance
 */
function animateIn(element, delay = 0) {
    setTimeout(() => {
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
    }, delay);
}

// Export functions for global access (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        promoteCard,
        reserveStock,
        addInventoryItem,
        createNewOrder,
        processOrder,
        shipOrder,
        simulateScan,
        toggleCamera,
        addToInventory,
        viewDetails,
        showStatusMessage
    };
}
