// Use localhost instead of 10.0.2.2 for better stability
const API_BASE_URL = 'http://localhost:4000';

export interface Order {
  _id: string;
  userId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  amount: number;
  address: {
    street?: string;
    city?: string;
    province?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  status: string;
  payment: boolean;
  date: string;
}

export const orderService = {
  // Poll for orders with "Food Processing" status (payment completed)
  startListening(onNewOrder: (order: Order) => void): () => void {
    let isActive = true;
    
    const checkForOrders = async () => {
      if (!isActive) return;
      
      try {
        console.log('Checking for orders...');
        
        const response = await fetch(`${API_BASE_URL}/api/order/list`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(5000),
        });
        
        if (!response.ok) {
          console.log(`HTTP ${response.status}: ${response.statusText}`);
          return;
        }
        
        const data = await response.json();
        console.log('✅ Connected to backend successfully');
        
        if (data.success && data.data && data.data.length > 0) {
          const processingOrders = data.data.filter((order: Order) => 
            order.status === 'Food Processing' && order.payment === true
          );
          
          if (processingOrders.length > 0) {
            const latestOrder = processingOrders[0];
            console.log('🔔 New order found:', latestOrder._id);
            onNewOrder(latestOrder);
          }
        }
      } catch (error: any) {
        // Don't spam console with errors, just log once every few attempts
        if (Math.random() < 0.1) {
          console.log('❌ Backend connection failed (this is normal during development)');
        }
      }
    };

    // Check immediately, then every 10 seconds
    checkForOrders();
    const interval = setInterval(checkForOrders, 10000);

    // Return cleanup function
    return () => {
      isActive = false;
      clearInterval(interval);
    };
  },

  async acceptOrder(orderId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/order/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: 'Out for Delivery'
        }),
        signal: AbortSignal.timeout(5000),
      });
      
      const data = await response.json();
      return { success: data.success };
    } catch (error: any) {
      console.error('Error accepting order:', error);
      return { success: false };
    }
  },

  async denyOrder(orderId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/order/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: 'Cancelled'
        }),
      });
      
      const data = await response.json();
      return { success: data.success };
    } catch (error) {
      console.error('Error denying order:', error);
      return { success: false };
    }
  }
};
