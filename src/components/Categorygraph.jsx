import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function Categorygraph({ categoryExpenses, onChartClick, selectedCategory }) {
  // 가장 지출이 많은 카테고리 찾기
  const getTopCategory = () => {
    if (categoryExpenses.length === 0) {
      return { name: '데이터 없음', color: '#666666' };
    }
    return categoryExpenses.reduce((max, category) => 
      category.value > max.value ? category : max
    );
  };

  // 파이 차트 조각 클릭 핸들러
  const handlePieClick = (data) => {
    onChartClick(data.name);
  };

  // 범례 클릭 핸들러
  const handleLegendClick = (categoryName) => {
    onChartClick(categoryName);
  };

  const topCategory = getTopCategory();

  return (
    <div className="chart-section category-chart">
      <h3>이번 달 지출이 가장 많은 카테고리</h3>
      <div className="chart-container">
        {categoryExpenses.length > 0 ? (
          <div className="pie-chart-wrapper">
            <ResponsiveContainer width="65%" height={420}>
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Pie
                  data={categoryExpenses}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={110}
                  paddingAngle={0}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  animationBegin={200}
                  animationDuration={1000}
                  isAnimationActive={true}
                  onClick={handlePieClick}
                  style={{ cursor: 'pointer' }}
                >
                  {categoryExpenses.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={selectedCategory === entry.name ? '#ff3399' : entry.color}
                      stroke={selectedCategory === entry.name ? '#ff3399' : 'none'}
                      strokeWidth={selectedCategory === entry.name ? 3 : 0}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="custom-legend">
              {[...categoryExpenses]
                .sort((a, b) => b.value - a.value)
                .map((entry, index) => (
                <div 
                  key={entry.name} 
                  className={`legend-item ${selectedCategory === entry.name ? 'selected' : ''}`}
                  onClick={() => handleLegendClick(entry.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <div 
                    className="legend-color" 
                    style={{ 
                      backgroundColor: selectedCategory === entry.name ? '#ff3399' : entry.color,
                      border: selectedCategory === entry.name ? '2px solid #ff3399' : 'none'
                    }}
                  ></div>
                  <span className="legend-text">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-data">
            <p>이번 달 지출 내역을 추가하면 차트가 표시됩니다</p>
          </div>
        )}
      </div>
      
      <div className="top-category">
        <span className="category-name" style={{ color: topCategory.color }}>
          {topCategory.name}
        </span>
      </div>
    </div>
  );
}

export default Categorygraph;