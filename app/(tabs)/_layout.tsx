import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { ExpenseProvider } from '../../context/ExpensesContext';
import { IncomeProvider } from '../../context/IncomeContext';

export default function TabLayout() {
  return (
    <IncomeProvider>
      <ExpenseProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#374151',
              borderTopColor: '#4b5563',
              borderTopWidth: 1,
              height: 90,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarActiveTintColor: '#f3f4f6',
            tabBarInactiveTintColor: '#9ca3af',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="income"
            options={{
              title: 'Income',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="cash" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="expenses"
            options={{
              title: 'Expenses',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="card" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </ExpenseProvider>
    </IncomeProvider>
  );
}

