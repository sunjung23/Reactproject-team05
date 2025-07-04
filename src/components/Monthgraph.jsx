import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import './Monthgraph.css';

function Monthgraph({ monthlyExpenses, onChartClick, selectedMonth }) {
  // 지출 금액에 따른 색상 계산 (가장 많은 순서대로)
  const getSortedDataWithColors = () => {
    const sortedData = [...monthlyExpenses].sort((a, b) => b.amount - a.amount);
    const colors = ['#E91E63', '#F06292', '#F8BBD9', '#FCE4EC', '#F3E5F5'];
    
    return monthlyExpenses.map(item => {
      const rank = sortedData.findIndex(sorted => sorted.month === item.month);
      return {
        ...item,
        fill: colors[rank] || colors[4]
      };
    });
  };

  // 전월 대비 증감률 계산
  const getMonthComparison = () => {
    const currentMonth = monthlyExpenses[monthlyExpenses.length - 1];
    const previousMonth = monthlyExpenses[monthlyExpenses.length - 2];
    
    if (!previousMonth) return { difference: 0, isIncrease: false, previousMonthLabel: '', message: '' };
    
    const difference = currentMonth.amount - previousMonth.amount;
    const isIncrease = difference > 0;
    const absAmount = Math.abs(difference);
    
    // 메시지 생성
    const previousMonthLabel = previousMonth.label;
    const message = isIncrease ? '더 썼어요' : '덜 썼어요';
    
    return { 
      difference: absAmount, 
      isIncrease, 
      previousMonthLabel,
      message 
    };
  };

  // 막대 클릭 핸들러
  const handleBarClick = (data) => {
    onChartClick(data.month);
  };

  const chartData = getSortedDataWithColors();
  const comparison = getMonthComparison();

  return (
    <div className="chart-section monthly-chart">
      <h3>월별 지출 비교하기</h3>
      <div className="chart-container">
        <ResponsiveContainer width="85%" height="90%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <XAxis 
              dataKey="label" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: '#666' }}
            />
            <YAxis hide />
            <Bar 
              dataKey="amount" 
              radius={[8, 8, 0, 0]}
              maxBarSize={70}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={selectedMonth === entry.month ? '#ff3399' : entry.fill}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* 전월 대비 증감 표시 */}
      <div className="top-category">
        <span className="category-name" style={{ background: '#E3F2FD' }}>
          <span className="current-month">{comparison.previousMonthLabel} 대비 </span>
          <span className={`amount ${comparison.isIncrease ? 'increase' : 'decrease'}`}>
            {comparison.difference.toLocaleString()}원
          </span>
          <span className="current-month"> {comparison.message}</span>
        </span>
      </div>
    </div>
  );
}

export default Monthgraph;