const API_BASE_URL = 'http://10.0.2.2:4000/api'; // Android emulator IP

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
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/order/list`);
        const data = await response.json();
        
        if (response.ok && data.success && data.data && data.data.length > 0) {
          // Look for orders with "Food Processing" status
          const processingOrders = data.data.filter((order: Order) => order.status === 'Food Processing');
          if (processingOrders.length > 0) {
            const latestOrder = processingOrders[0];
            onNewOrder(latestOrder);
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  },

  async acceptOrder(orderId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/order/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: 'Out for Delivery'
        }),
      });
      
      const data = await response.json();
      return { success: data.success };
    } catch (error) {
      console.error('Error accepting order:', error);
      return { success: false };
    }
  },

  async denyOrder(orderId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/order/status`, {
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
