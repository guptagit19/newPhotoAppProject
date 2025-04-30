import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import moment from 'moment';

const SubscriptionStatus = ({navigation, subscription}) => {
// const navigation = useNavigation();

  if (!subscription || subscription === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.noSubscriptionText}>You don't have any active subscription package.</Text>
        <Button
          title="Buy Subscription"
          onPress={() => navigation.navigate('SubscriptionScreen')} // tumhare subscription page ka naam
          color="#4CAF50"
        />
        <TouchableOpacity onPress={() => navigation.navigate('SubscriptionScreen')}/>
      </View>
    );
  }

  const {subscriptionName, createdDate, expireDate, remainingRequestLimit, initialTotalRequestLimit} = subscription;
  const now = moment();
  const expiry = moment(expireDate);
  const remainingDays = expiry.diff(now, 'days');

  const isExpiringSoon = remainingDays <= 1;
  const isExpired = remainingDays < 0;

  return (
    <View style={styles.container}>
      {isExpired ? (
        <>
          <Text style={styles.noSubscriptionText}>Your subscription has expired.</Text>
          <Button
            title="Renew Subscription"
            onPress={() => navigation.navigate('SubscriptionScreen')}
            color="#FF5722"
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>{subscriptionName} Plan</Text>
          <Text style={styles.detail}>Remaining Requests: {remainingRequestLimit} / {initialTotalRequestLimit}</Text>
          <Text style={styles.detail}>Expires in: {remainingDays} day(s)</Text>

          {isExpiringSoon && (
            <>
              <Text style={styles.warning}>
                Your subscription will expire {remainingDays === 0 ? 'today' : 'tomorrow'}! Renew soon.
              </Text>
              <Button
                title="Renew Subscription"
                onPress={() => navigation.navigate('SubscriptionScreen')}
                color="#FF5722"
              />
            </>
          )}
        </>
      )}
    </View>
  );
};

export default SubscriptionStatus;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  detail: {
    fontSize: 15,
    color: '#555',
    marginBottom: 5,
  },
  noSubscriptionText: {
    fontSize: 16,
    color: '#FF5722',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  warning: {
    marginTop: 10,
    color: '#d9534f',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
  },
});
