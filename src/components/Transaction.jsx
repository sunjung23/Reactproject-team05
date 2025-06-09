import React, { createContext, useContext, useState } from 'react';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  const removeTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // 월별 지출 데이터 계산
  const getMonthlyExpenses = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const monthlyData = [];
    
    // 최근 5개월 데이터 생성
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

  // 카테고리별 지출 데이터 계산 (이번 달)
  const getCategoryExpenses = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 카테고리별 색상 매핑
    const categoryColors = {
      '식비': '#E91E63',
      '교통비': '#2196F3',
      '생활비': '#FF9800',
      '문화생활': '#9C27B0',
      '기타지출': '#4CAF50'
    };

    // 이번 달 지출만 필터링
    const thisMonthExpenses = transactions.filter(t => {
      if (t.type !== '지출') return false;
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    // 카테고리별 합계 계산
    const categoryTotals = {};
    thisMonthExpenses.forEach(t => {
      if (categoryTotals[t.category]) {
        categoryTotals[t.category] += t.amount;
      } else {
        categoryTotals[t.category] = t.amount;
      }
    });

    // 배열 형태로 변환
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
        color: categoryColors[name] || '#666666'
      }))
      .filter(item => item.value > 0); // 0원인 카테고리는 제외
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