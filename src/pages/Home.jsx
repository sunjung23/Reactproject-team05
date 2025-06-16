import React, { useState } from 'react';
import { useTransactions } from '../components/Transaction';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Calendar from '../components/Calendar';
import './Home.css';
import usePageTitle from '../usePageTitle';

function Home() {
  const { transactions, addTransaction } = useTransactions();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tab, setTab] = useState('수입');

  usePageTitle("가계부 - 캘린더");

  const filterByMonth = (type) =>
    transactions
      .filter(t => {
        const date = new Date(t.date);
        return (
          t.type === type &&
          date.getMonth() === currentMonth.getMonth() &&
          date.getFullYear() === currentMonth.getFullYear()
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

  const income = filterByMonth('수입');
  const expense = filterByMonth('지출');
  const getBalance = () => {
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return (
          date.getFullYear() < currentMonth.getFullYear() ||
          (date.getFullYear() === currentMonth.getFullYear() &&
          date.getMonth() <= currentMonth.getMonth())
        );
      })
      .reduce((sum, t) => t.type === '수입' ? sum + t.amount : sum - t.amount, 0);
  };

  const balance = getBalance();

  const handleAdd = () => {
    const date = document.getElementById('input-date').value;
    const amount = parseInt(document.getElementById('input-amount').value);
    const category = document.getElementById('input-category').value;
    const memo = document.getElementById('input-memo').value;

    if (date && amount && category) {
      const newItem = { 
        id: Date.now(), 
        type: tab, 
        amount, 
        date, 
        category,
        memo
      };
      
      // Context의 addTransaction 사용
      addTransaction(newItem);
      
      setIsFormOpen(false);
      document.getElementById('input-date').value = '';
      document.getElementById('input-amount').value = '';
      document.getElementById('input-category').selectedIndex = 0;
    }
  };

  const handleDateSelect = (type, day) => {
    if (type === 'prev') {
      setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    } else if (type === 'next') {
      setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    } else if (type === 'day') {
      setSelectedDate(day); //선택된 날짜 저장하기
    }
  };

  return (
    <div className="home">
      <Header />
      <Sidebar currentPage="캘린더" />

      <main className="main">
        <section className="calendar">
          <Calendar
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />

      <div className="details">
        <h4>{selectedDate ? `${currentMonth.getMonth() + 1}월 ${selectedDate}일 내역` : "날짜를 선택하세요"}</h4>
        {selectedDate ? (
          transactions.filter(t => {
            const date = new Date(t.date);
            return (
              date.getFullYear() === currentMonth.getFullYear() &&
              date.getMonth() === currentMonth.getMonth() &&
              date.getDate() === selectedDate
            );
          }).length === 0 ? (
            <div className="empty">거래 내역이 없습니다.</div>
          ) : (
            transactions
              .filter(t => {
                const date = new Date(t.date);
                return (
                  date.getFullYear() === currentMonth.getFullYear() &&
                  date.getMonth() === currentMonth.getMonth() &&
                  date.getDate() === selectedDate
                );
              })
              .map(t => (
                <div key={t.id}>
                  [{t.type}] {t.category} - {t.amount.toLocaleString()}원
                </div>
              ))
          )
        ) : null}
      </div>

          <div className="summary">
            <div className="card income">
              <h3>수입</h3>
              <p>{currentMonth.getMonth() + 1}월 수입</p>
              <strong>+{income.toLocaleString()} 원</strong>
            </div>
            <div className="card expense">
              <h3>지출</h3>
              <p>{currentMonth.getMonth() + 1}월 지출</p>
              <strong>-{expense.toLocaleString()} 원</strong>
            </div>
          </div>

          <div className="card balance">
            <h3>잔액</h3>
            <strong className={balance >= 0 ? 'positive' : 'negative'}>{balance.toLocaleString()} 원</strong>
          </div>

          <div className="addwrap">
            <button className="add" onClick={() => setIsFormOpen(!isFormOpen)}>+</button>
          </div>

          {isFormOpen && (
            <div className="form">
              <h3>내역 추가</h3>
              <div className="tabs">
                {['수입', '지출'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={tab === t ? 'active' : ''}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="group">
                <label>날짜</label>
                <input type="date" id="input-date" />
              </div>
              <div className="group">
                <label>금액</label>
                <input type="number" id="input-amount" placeholder="금액을 입력하세요" />
              </div>
              <div className="group">
                <label>카테고리</label>
                <select id="input-category">
                  {tab === '수입' ? (
                    <>
                      <option value="급여">급여</option>
                      <option value="부업">부업</option>
                      <option value="기타수입">기타수입</option>
                    </>
                  ) : (
                    <>
                      <option value="식비">식비</option>
                      <option value="교통비">교통비</option>
                      <option value="생활비">생활비</option>
                      <option value="문화생활">문화생활</option>
                      <option value="기타지출">기타지출</option>
                    </>
                  )}
                </select>
              </div>
              <div className="group">
                <label>메모</label>
                <input type="text" id="input-memo" placeholder="간단한 메모를 입력하세요" />
              </div>
              <div className="actions">
                <button onClick={handleAdd}>추가하기</button>
                <button onClick={() => setIsFormOpen(false)}>취소</button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;