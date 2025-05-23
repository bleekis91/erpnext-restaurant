// Self-executing function with Frappe availability check
(function initKitchenAlerts() {
    // Only initialize once
    if (window.kitchenAlertsInitialized) return;
    
    // Wait for Frappe to be available
    const checkFrappe = setInterval(() => {
        if (window.frappe && frappe.realtime) {
            clearInterval(checkFrappe);
            
            console.log("Kitchen alert system initialized");
            
            frappe.realtime.on('order_items_sent', (data) => {
                console.log("Alert triggered for:", data.order_id);
                
                // Audio with click fallback
                const audio = new Audio('/files/oalert.mp3');
                audio.play().catch(() => {
                    const clickHandler = () => {
                        audio.play();
                        document.removeEventListener('click', clickHandler);
                    };
                    document.addEventListener('click', clickHandler, { once: true });
                });
                
                // Visual alert
                frappe.show_alert({
                    message: `${data.count} items sent from ${data.table}`,
                    indicator: 'green'
                }, 5);
            });
            
            window.kitchenAlertsInitialized = true;
        }
    }, 100);
})();
