import React, { createContext, useContext, useState, useEffect } from 'react';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  //localStorage에서 불러오기
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem('transactions');
    return stored ? JSON.parse(stored) : [];
  });

  //transactions가 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  const removeTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const getMonthlyExpenses = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const monthlyData = [];
    
    for (let i = 4; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonth - i, 1);
      const month = targetDate.getMonth() + 1;
      const year = targetDate.getFullYear();
      
      const monthExpenses = transactions
        .filter(t => {
          if (t.type !== '지출') return false;
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === targetDate.getMonth() && 
                 transactionDate.getFullYear() === year;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: month,
        amount: monthExpenses,
        label: `${month}월`
      });
    }

    return monthlyData;
  };

  const getCategoryExpenses = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const categoryColors = {
      '식비': '#E91E63',
      '교통비': '#2196F3',
      '생활비': '#FF9800',
      '문화생활': '#9C27B0',
      '기타지출': '#4CAF50'
    };

    const thisMonthExpenses = transactions.filter(t => {
      if (t.type !== '지출') return false;
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const categoryTotals = {};
    thisMonthExpenses.forEach(t => {
      if (categoryTotals[t.category]) {
        categoryTotals[t.category] += t.amount;
      } else {
        categoryTotals[t.category] = t.amount;
      }
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
        color: categoryColors[name] || '#666666'
      }))
      .filter(item => item.value > 0);
  };

  const value = {
    transactions,
    addTransaction,
    removeTransaction,
    getMonthlyExpenses,
    getCategoryExpenses
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionContext;  