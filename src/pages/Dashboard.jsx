import React, { useState, useEffect } from 'react';
import { useTransactions } from '../components/Transaction';
import Monthgraph from '../components/Monthgraph';
import Categorygraph from '../components/Categorygraph';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

function Dashboard() {
  const { getMonthlyExpenses, getCategoryExpenses, transactions } = useTransactions();
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [chartKey, setChartKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // 페이지 로드 애니메이션
  useEffect(() => {
    setChartKey(Date.now());
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // 실제 데이터 가져오기
  const monthlyExpenses = getMonthlyExpenses();
  const categoryExpenses = getCategoryExpenses();

  // 선택된 월의 지출 목록 가져오기
  const getSelectedMonthExpenses = (month) => {
    const currentYear = new Date().getFullYear();
    
    return transactions.filter(t => {
      if (t.type !== '지출') return false;
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() + 1 === month && 
             transactionDate.getFullYear() === currentYear;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // 선택된 카테고리의 지출 목록 가져오기 (이번 달)
  const getSelectedCategoryExpenses = (category) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions.filter(t => {
      if (t.type !== '지출' || t.category !== category) return false;
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // 차트 클릭 핸들러
  const handleChartClick = (type, value) => {
    if (selectedDetails?.type === type && selectedDetails?.value === value) {
      setSelectedDetails(null); // 같은 항목 클릭 시 닫기
    } else {
      setSelectedDetails({ type, value });
    }
  };

  // 선택된 지출 목록 가져오기
  const getSelectedExpenses = () => {
    if (!selectedDetails) return [];
    
    if (selectedDetails.type === 'month') {
      return getSelectedMonthExpenses(selectedDetails.value);
    } else if (selectedDetails.type === 'category') {
      return getSelectedCategoryExpenses(selectedDetails.value);
    }
    
    return [];
  };

  const selectedExpenses = getSelectedExpenses();

  return (
    <div className="dashboard">
      <Header />
      <Sidebar currentPage="대시보드" />

      <main className="main">
        <div className={`dashboard-container ${isLoaded ? 'loaded' : ''}`}>
          <div className="charts-wrapper">
            <div className="chart-item chart-item-1">
              <Monthgraph 
                key={`month-${chartKey}`}
                monthlyExpenses={monthlyExpenses} 
                onChartClick={(month) => handleChartClick('month', month)}
                selectedMonth={selectedDetails?.type === 'month' ? selectedDetails.value : null}
              />
            </div>
            <div className="chart-item chart-item-2">
              <Categorygraph 
                key={`category-${chartKey}`}
                categoryExpenses={categoryExpenses} 
                onChartClick={(category) => handleChartClick('category', category)}
                selectedCategory={selectedDetails?.type === 'category' ? selectedDetails.value : null}
              />
            </div>
          </div>

          {/* 통합된 지출 목록 박스 */}
          {selectedDetails && (
            <div className="expense-details-box animate-slide-in">
              <div className="details-header">
                <h4 className="animate-fade-in">
                  {selectedDetails.type === 'month' 
                    ? `${selectedDetails.value}월 지출 내역`
                    : `${selectedDetails.value} 지출 내역`
                  }
                </h4>
                <button 
                  className="close-btn animate-pulse-hover"
                  onClick={() => setSelectedDetails(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="expense-list">
                {selectedExpenses.length > 0 ? (
                  selectedExpenses.map((expense, index) => (
                    <div 
                      key={expense.id} 
                      className="expense-item animate-list-item"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="expense-info">
                        <span className="expense-category">{expense.category}</span>
                        <span className="expense-date">
                          {new Date(expense.date).toLocaleDateString('ko-KR', {
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <span className="expense-amount animate-number-count">
                        -{expense.amount.toLocaleString()}원
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="no-expenses animate-fade-in">
                    {selectedDetails.type === 'month' 
                      ? `${selectedDetails.value}월에는 지출 내역이 없습니다.`
                      : `이번 달 ${selectedDetails.value} 지출 내역이 없습니다.`
                    }
                  </div>
                )}
              </div>
              
              {selectedExpenses.length > 0 && (
                <div className="total-amount animate-bounce-in">
                  {selectedDetails.type === 'month' 
                    ? `${selectedDetails.value}월 총 지출`
                    : `${selectedDetails.value} 총 지출`
                  }: <span className="total-number">{selectedExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}원</span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;