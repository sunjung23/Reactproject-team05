import React, { useState } from 'react';
import { useTransactions } from '../components/Transaction';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import "./Breakdown.css";
import usePageTitle from '../usePageTitle';

function Breakdown() {
    const { transactions, updateTransaction, removeTransaction } = useTransactions();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [sortBy, setSortBy] = useState('date'); 
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterType, setFilterType] = useState('all'); 
    const [editing, setEditing] = useState(null); 
    const [editData, setEditData] = useState({}); 

    usePageTitle("가게부 - 수입/지출 내역");

    const monthlyTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return (
            date.getMonth() === currentMonth.getMonth() &&
            date.getFullYear() === currentMonth.getFullYear() &&
            (filterType === 'all' || t.type === filterType)
        );
    });

    const sortedTransactions = [...monthlyTransactions].sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
            case 'date': comparison = new Date(a.date) - new Date(b.date); break;
            case 'amount': comparison = a.amount - b.amount; break;
            case 'category': comparison = a.category.localeCompare(b.category); break;
            default: comparison = 0;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const categoryStats = monthlyTransactions.reduce((acc, t) => {
        if (!acc[t.category]) {
            acc[t.category] = { count: 0, total: 0, type: t.type };
        }
        acc[t.category].count++;
        acc[t.category].total += t.amount;
        return acc;
    }, {});

    const monthlyIncome = monthlyTransactions.filter(t => t.type === '수입').reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpense = monthlyTransactions.filter(t => t.type === '지출').reduce((sum, t) => sum + t.amount, 0);

    const cumulativeBalance = transactions
        .filter(t => {
            const date = new Date(t.date);
            return (
                date.getFullYear() < currentMonth.getFullYear() ||
                (date.getFullYear() === currentMonth.getFullYear() &&
                    date.getMonth() <= currentMonth.getMonth())
            );
        })
        .reduce((sum, t) => t.type === '수입' ? sum + t.amount : sum - t.amount, 0);

    const changeMonth = (direction) => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            direction === 'prev' ? newMonth.setMonth(prev.getMonth() - 1) : newMonth.setMonth(prev.getMonth() + 1);
            return newMonth;
        });
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const handleEdit = (transaction) => {
        setEditing(transaction.id);
        setEditData({ ...transaction });
    };

    const handleSave = () => {
        updateTransaction(editData);
        setEditing(null);
    };

    return (
        <div className="breakdown">
            <Header />
            <Sidebar currentPage="수입/지출 내역" />

            <main className="breakdown-main">
                <div className="breakdown-header">
                    <div className="month-nav">
                        <button onClick={() => changeMonth('prev')}>◀</button>
                        <h2 className="month-title">
                            {currentMonth.getFullYear()}년 {String(currentMonth.getMonth() + 1).padStart(2, '0')}월 내역
                        </h2>
                        <button onClick={() => changeMonth('next')}>▶</button>
                    </div>
                </div>

                <div className="monthly-summary">
                    <div className="summary-card income-card">
                        <h3>수입</h3>
                        <p className="amount income">+{monthlyIncome.toLocaleString()}원</p>
                    </div>
                    <div className="summary-card expense-card">
                        <h3>지출</h3>
                        <p className="amount expense">-{monthlyExpense.toLocaleString()}원</p>
                    </div>
                    <div className="summary-card balance-card">
                        <h3>잔액</h3>
                        <p className="amount balance">{cumulativeBalance.toLocaleString()}원</p>
                    </div>
                </div>

                <div className="controls">
                    <div className="filter-buttons">
                        <button className={filterType === 'all' ? 'active' : ''} onClick={() => setFilterType('all')}>전체</button>
                        <button className={filterType === '수입' ? 'active' : ''} onClick={() => setFilterType('수입')}>수입</button>
                        <button className={filterType === '지출' ? 'active' : ''} onClick={() => setFilterType('지출')}>지출</button>
                    </div>
                    <div className="sort-buttons">
                        <button className={sortBy === 'date' ? 'active' : ''} onClick={() => handleSort('date')}>날짜순 {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}</button>
                        <button className={sortBy === 'amount' ? 'active' : ''} onClick={() => handleSort('amount')}>금액순 {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}</button>
                        <button className={sortBy === 'category' ? 'active' : ''} onClick={() => handleSort('category')}>카테고리순 {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}</button>
                    </div>
                </div>

                <div className="category-stats">
                    <h3>카테고리별 통계</h3>
                    <div className="stats-grid">
                        {Object.entries(categoryStats).map(([category, stats]) => (
                            <div key={category} className="stat-card">
                                <h4>{category}</h4>
                                <p className="stat-count">{stats.count}건</p>
                                <p className={`stat-amount ${stats.type === '수입' ? 'income' : 'expense'}`}>{stats.type === '수입' ? '+' : '-'}{stats.total.toLocaleString()}원</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="transaction-list">
                    <h3>거래 내역 ({sortedTransactions.length}건)</h3>
                    {sortedTransactions.length === 0 ? (
                        <div className="empty-state"><p>이 달에는 거래 내역이 없습니다.</p></div>
                    ) : (
                        <div className="transactions">
                            {sortedTransactions.map(transaction => (
                                <div key={transaction.id} className="transaction-item">
                                    <div className="transaction-date">
                                        {new Date(transaction.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })}
                                    </div>
                                    <div className="transaction-info">
                                        <div className="left-column">
                                            {editing === transaction.id ? (
                                                <div className="edit-form">
                                                    <input type="date" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} />
                                                    <input type="number" value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: parseInt(e.target.value) })} />
                                                    <input type="text" value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} />
                                                    <input type="text" value={editData.memo} onChange={(e) => setEditData({ ...editData, memo: e.target.value })} />
                                                    <button onClick={handleSave}>저장</button>
                                                    <button onClick={() => setEditing(null)}>취소</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="transaction-category">
                                                        <span className={`type-badge ${transaction.type}`}>{transaction.type}</span>
                                                        {transaction.category}
                                                        {transaction.memo && <span className="transaction-memo"> {transaction.memo}</span>}
                                                    </div>
                                                    <div className="transaction-actions">
                                                        <button onClick={() => handleEdit(transaction)}>수정</button>
                                                        <button onClick={() => {const confirmDelete = window.confirm('정말로 이 내역을 삭제하시겠습니까?');
                                                                if (confirmDelete) {
                                                                removeTransaction(transaction.id);
                                                                }
                                                            }}> 삭제</button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className={`transaction-amount ${transaction.type === '수입' ? 'income' : 'expense'}`}>{transaction.type === '수입' ? '+' : '-'}{transaction.amount.toLocaleString()}원</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Breakdown;