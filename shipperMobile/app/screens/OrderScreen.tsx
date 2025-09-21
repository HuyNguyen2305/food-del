import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Modal,
  SafeAreaView 
} from 'react-native';
import { orderService, Order } from '../services/orderService';

const OrderScreen = ({ onLogout }: { onLogout?: () => void }) => {
  const [hasOrder, setHasOrder] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Start listening for orders when component mounts
    const stopListening = orderService.startListening((order: Order) => {
      setCurrentOrder(order);
      setHasOrder(true);
    });

    // Cleanup listener when component unmounts
    return stopListening;
  }, []);

  const handleAccept = async () => {
    if (!currentOrder) return;
    
    const result = await orderService.acceptOrder(currentOrder._id);
    if (result.success) {
      Alert.alert('Order Accepted', `Order has been accepted for delivery`);
      setHasOrder(false);
      setCurrentOrder(null);
    } else {
      Alert.alert('Error', 'Failed to accept order');
    }
  };

  const handleDeny = async () => {
    if (!currentOrder) return;
    
    const result = await orderService.denyOrder(currentOrder._id);
    if (result.success) {
      Alert.alert('Order Denied', `Order has been cancelled`);
      setHasOrder(false);
      setCurrentOrder(null);
    } else {
      Alert.alert('Error', 'Failed to deny order');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: onLogout }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with logout button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.waitingText}>
          {hasOrder ? 'New order received!' : 'Waiting for orders...'}
        </Text>
      </View>

      {/* Order Popup Modal */}
      <Modal
        visible={hasOrder}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.orderPopup}>
            <Text style={styles.orderTitle}>Order Pending</Text>
            <Text style={styles.orderAddress}>Client: {currentOrder?.address?.firstName} {currentOrder?.address?.lastName}</Text>
            <Text style={styles.addressText}>
              {currentOrder?.address?.street}, {currentOrder?.address?.city}, {currentOrder?.address?.province}
            </Text>
            <Text style={styles.orderTotal}>Total: ${currentOrder?.amount}</Text>
            <Text style={styles.orderId}>Items: {currentOrder?.items?.length}</Text>
          </View>
        </View>
      </Modal>

      {/* Footer with Accept/Deny buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.footerButton, 
            hasOrder ? styles.acceptButton : styles.disabledButton
          ]}
          onPress={handleAccept}
          disabled={!hasOrder}
        >
          <Text style={styles.footerButtonText}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.footerButton, 
            hasOrder ? styles.denyButton : styles.disabledButton
          ]}
          onPress={handleDeny}
          disabled={!hasOrder}
        >
          <Text style={styles.footerButtonText}>Deny</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  logoutText: {
    color: '#333',
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  waitingText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderPopup: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  orderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  orderAddress: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#555',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  orderId: {
    fontSize: 14,
    color: '#888',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f8f8',
  },
  footerButton: {
    flex: 1,
    height: 50,
    marginHorizontal: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  acceptButton: {
    backgroundColor: '#28a745',
  },
  denyButton: {
    backgroundColor: '#dc3545',
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderScreen;
