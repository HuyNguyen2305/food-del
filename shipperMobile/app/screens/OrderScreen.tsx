import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Modal,
  SafeAreaView 
} from 'react-native';

const OrderScreen = ({ onLogout }: { onLogout?: () => void }) => {
  const [hasOrder, setHasOrder] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    clientAddress: '',
    orderId: '',
  });

  // Simulate incoming order
  const simulateOrder = () => {
    setOrderDetails({
      clientAddress: '123 Main Street, Downtown Area',
      orderId: 'ORD-' + Math.floor(Math.random() * 1000),
    });
    setHasOrder(true);
  };

  const handleAccept = () => {
    Alert.alert('Order Accepted', `Order ${orderDetails.orderId} has been accepted`);
    setHasOrder(false);
  };

  const handleDeny = () => {
    Alert.alert('Order Denied', `Order ${orderDetails.orderId} has been denied`);
    setHasOrder(false);
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
        <Text style={styles.waitingText}>Waiting for orders...</Text>
        
        {/* Simulate order button for testing */}
        <TouchableOpacity style={styles.simulateButton} onPress={simulateOrder}>
          <Text style={styles.simulateText}>Simulate Order</Text>
        </TouchableOpacity>
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
            <Text style={styles.orderAddress}>Client Address:</Text>
            <Text style={styles.addressText}>{orderDetails.clientAddress}</Text>
            <Text style={styles.orderId}>Order ID: {orderDetails.orderId}</Text>
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
  simulateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  simulateText: {
    color: '#fff',
    fontSize: 16,
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
