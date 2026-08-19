import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList
} from "react-native";;
import Icon from "react-native-vector-icons/MaterialIcons";

const WalletScreen = () => {
  const [balance, setBalance] = useState(1245.67);
  const [currency] = useState("USD");
  const [transactions, setTransactions] = useState([]);

  // Mock transaction data
  useEffect(() => {
    const mockTransactions = [
      {id: "1",
  type: "received",
  amount: 250.0,
  from: "John Smith",
  date: "Dec 25, 2025",
  status: "completed"
      },
      {id: "2",
  type: "sent",
  amount: 45.5,
  to: "Sarah Johnson",
  date: "Dec 24, 2025",
  status: "completed"
      },
      {id: "3",
  type: "received",
  amount: 120.0,
  from: "Gift Bonus",
  date: "Dec 23, 2025",
  status: "completed"
      },
      {id: "4",
  type: "sent",
  amount: 89.99,
  to: "Online Store",
  date: "Dec 22, 2025",
  status: "completed"
      },
      {id: "5",
  type: "received",
  amount: 300.0,
  from: "Project Payment",
  date: "Dec 20, 2025",
  status: "completed"
      }
    ];
    setTransactions(mockTransactions);
  }, []);

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIconContainer}>
        <Icon
          name={item.type === "received" ? "arrow-downward" : "arrow-upward"}
          size={20}
          color={item.type === "received" ? "#4caf50" : "#f44336"}
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>
          {item.type === "received" ? `,
From: ${item.from}` : `,
To: ${item.to}`}
        </Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          {color: item.type === "received" ? "#4caf50" : "#f44336" }
        ]}
      >
        {item.type === "received" ? "+" : "-"}${item.amount.toFixed(2)}
      </Text>
    </View>;
  );

  return (
    <ScrollView style={styles.container}>
      {/* Wallet Header */}
      <View style={styles.walletHeader}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          <Text style={styles.balanceCurrency}>{currency}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="add" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="send" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="history" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.quickAction}>
          <Icon name="credit-card" size={30} color="#6200ee" />
          <Text style={styles.quickActionText}>Cards</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Icon name="account-balance" size={30} color="#6200ee" />
          <Text style={styles.quickActionText}>Bank</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Icon name="qr-code" size={30} color="#6200ee" />
          <Text style={styles.quickActionText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Icon name="toll" size={30} color="#6200ee" />
          <Text style={styles.quickActionText}>Pay</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction History */}
      <View style={styles.transactionContainer}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>;
  );
};

const styles = StyleSheet.create({container: {,
  flex: 1,
  backgroundColor: "#f5f5f5"
  },
walletHeader: {backgroundColor: "#6200ee",
  padding: 20,
  paddingTop: 40,
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20
  },
balanceContainer: {alignItems: "center",
  marginBottom: 25
  },
balanceLabel: {fontSize: 16,
  color: "rgba(255, 255, 255, 0.8)",
  marginBottom: 5
  },
balanceAmount: {fontSize: 36,
  fontWeight: "bold",
  color: "#fff",
  marginBottom: 5
  },
balanceCurrency: {fontSize: 16,
  color: "rgba(255, 255, 255, 0.8)"
  },
actionButtons: {flexDirection: "row",
  justifyContent: "space-around"
  },
actionButton: {alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 20,
  minWidth: 70
  },
actionButtonText: {color: "#fff",
  fontSize: 12,
  fontWeight: "bold",
  marginTop: 5
  },
quickActionsContainer: {flexDirection: "row",
  backgroundColor: "#fff",
  margin: 20,
  borderRadius: 10,
  paddingVertical: 15,
  elevation: 3,
  shadowColor: "#000",
  shadowOffset: {,
  width: 0,
  height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4
  },
quickAction: {flex: 1,
  alignItems: "center"
  },
quickActionText: {fontSize: 12,
  marginTop: 5,
  color: "#333"
  },
transactionContainer: {backgroundColor: "#fff",
  marginHorizontal: 20,
  marginBottom: 20,
  borderRadius: 10,
  padding: 15,
  elevation: 3,
  shadowColor: "#000",
  shadowOffset: {,
  width: 0,
  height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4
  },
transactionHeader: {flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 15
  },
transactionTitle: {fontSize: 18,
  fontWeight: "bold",
  color: "#333"
  },
viewAllText: {color: "#6200ee",
  fontWeight: "bold"
  },
transactionItem: {flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0"
  },
transactionIconContainer: {width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "rgba(98, 0, 238, 0.1)",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 15
  },
transactionDetails: {flex: 1
  },
transactionTitle: {fontSize: 16,
  fontWeight: "500",
  color: "#333"
  },
transactionDate: {fontSize: 13,
  color: "#888",
  marginTop: 3
  },
transactionAmount: {fontSize: 16,
  fontWeight: "bold"
  }
});

export default WalletScreen;
