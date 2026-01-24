import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { ArrowUpCircle, ArrowDownCircle, Wallet, ListOrdered, Calendar } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  ArcElement, Tooltip, Legend, Title,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler
);

const Summary = () => {
  const [period, setPeriod] = useState('all');
  const currentDate = new Date('2026-01-15');

  // Dummy Data (you can replace with real API data later)
  const dummyTransactions = [
    { date: '2026-01-10', amount: 500, type: 'in', category: 'Salary' },
    { date: '2026-01-05', amount: 200, type: 'out', category: 'Food' },
    { date: '2025-12-25', amount: 1200, type: 'in', category: 'Freelance' },
    { date: '2025-12-15', amount: 400, type: 'out', category: 'Rent' },
    { date: '2025-11-20', amount: 800, type: 'in', category: 'Bonus' },
    { date: '2025-10-10', amount: 150, type: 'out', category: 'Shopping' },
    { date: '2025-08-05', amount: 1500, type: 'in', category: 'Investment' },
  ];

  // Filter data based on period
  const filteredData = useMemo(() => {
    let startDate = new Date(currentDate);
    if (period === '1y') startDate.setFullYear(currentDate.getFullYear() - 1);
    else if (period === '6m') startDate.setMonth(currentDate.getMonth() - 6);
    else if (period === '3m') startDate.setMonth(currentDate.getMonth() - 3);
    else if (period === '1m') startDate.setMonth(currentDate.getMonth() - 1);
    else startDate = new Date(0);

    return dummyTransactions.filter(t => new Date(t.date) >= startDate);
  }, [period]);

  // Totals
  const totalIn = filteredData.filter(t => t.type === 'in').reduce((s, t) => s + t.amount, 0);
  const totalOut = filteredData.filter(t => t.type === 'out').reduce((s, t) => s + t.amount, 0);
  const balance = totalIn - totalOut;

  // Pie Chart Data
  const pieData = {
    labels: ['Income', 'Expense'],
    datasets: [{
      data: [totalIn, totalOut],
      backgroundColor: ['#10b981', '#f43f5e'],
      hoverOffset: 12,
      borderWidth: 0,
    }],
  };

  // Line Chart Data (Income & Expense separate lines)
  const lineChartData = useMemo(() => {
    const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const labels = sortedData.map(t => 
      new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    );
    
    const incomeData = sortedData.map(t => t.type === 'in' ? t.amount : null);
    const expenseData = sortedData.map(t => t.type === 'out' ? t.amount : null);

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          fill: true,
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          borderColor: '#10b981',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#0f172a',
          pointBorderWidth: 2,
          pointHoverRadius: 7,
          spanGaps: true,
        },
        {
          label: 'Expense',
          data: expenseData,
          fill: true,
          backgroundColor: 'rgba(244, 63, 94, 0.12)',
          borderColor: '#f43f5e',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#f43f5e',
          pointBorderColor: '#0f172a',
          pointBorderWidth: 2,
          pointHoverRadius: 7,
          spanGaps: true,
        }
      ],
    };
  }, [filteredData]);

  // Bar Chart Data - Month-wise Income vs Expense
  const barChartData = useMemo(() => {
    const monthlyData = {};
    
    filteredData.forEach(t => {
      const monthYear = new Date(t.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { income: 0, expense: 0 };
      }
      
      if (t.type === 'in') monthlyData[monthYear].income += t.amount;
      else monthlyData[monthYear].expense += t.amount;
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Income',
          data: sortedMonths.map(m => monthlyData[m].income),
          backgroundColor: 'rgba(16, 185, 129, 0.75)',
          borderColor: '#10b981',
          borderWidth: 1,
          borderRadius: 8,
        },
        {
          label: 'Expense',
          data: sortedMonths.map(m => monthlyData[m].expense),
          backgroundColor: 'rgba(244, 63, 94, 0.75)',
          borderColor: '#f43f5e',
          borderWidth: 1,
          borderRadius: 8,
        }
      ],
    };
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 xl:px-10 w-full">

      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full opacity-15"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 12}s`,
            }}
          />
        ))}
      </div>

      {/* Main content – full width */}
      <div className="relative z-10 w-full space-y-8 lg:space-y-10">

        {/* Header */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-indigo-700/40 p-6 sm:p-8 lg:p-10 xl:p-12 shadow-2xl w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent flex items-center gap-3">
                <Wallet className="w-10 h-10 text-indigo-400" /> Financial Summary
              </h1>
              <p className="text-indigo-300/80 mt-2 text-lg">
                Overview of income, expenses & balance
              </p>
            </div>

            {/* Period Selector */}
            <div className="flex bg-black/50 backdrop-blur-md border border-indigo-600/50 p-1.5 rounded-xl shadow-lg">
              {['all', '1y', '6m', '3m', '1m'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    period === p 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {p === 'all' ? 'All Time' : p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
          <StatCard 
            title="Total Income" 
            amount={totalIn} 
            color="emerald" 
            icon={<ArrowDownCircle />} 
            trend="+12.5%" 
          />
          <StatCard 
            title="Total Expenses" 
            amount={totalOut} 
            color="rose" 
            icon={<ArrowUpCircle />} 
            trend="-8.3%" 
          />
          <StatCard 
            title="Net Balance" 
            amount={balance} 
            color="indigo" 
            icon={<Wallet />} 
            isBalance 
            trend="+18.2%" 
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
          {/* Bar Chart Section */}
          <div className="lg:col-span-2 bg-black/30 backdrop-blur-xl rounded-2xl border border-indigo-700/40 p-6 md:p-8 lg:p-10 shadow-2xl w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
                <Calendar className="w-7 h-7 text-indigo-400" /> Transaction Trend
              </h3>
              <span className="px-4 py-2 bg-indigo-900/50 text-indigo-300 rounded-lg text-sm lg:text-base font-medium">
                {period === 'all' ? 'All Time' : `Last ${period.toUpperCase()}`}
              </span>
            </div>

            <div className="h-[420px] lg:h-[480px] w-full">
              <Bar
                data={barChartData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: { 
                      position: 'top', 
                      labels: { 
                        color: '#e5e7eb',
                        font: { size: 14, weight: 'bold' },
                        padding: 20,
                        usePointStyle: true
                      } 
                    },
                    tooltip: { 
                      backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                      titleColor: '#e5e7eb',
                      bodyColor: '#e5e7eb',
                      cornerRadius: 10,
                      padding: 12,
                    },
                  },
                  scales: {
                    y: { 
                      beginAtZero: true, 
                      grid: { color: 'rgba(255,255,255,0.08)' },
                      ticks: { color: '#9ca3af', font: { weight: '600' } }
                    },
                    x: { 
                      grid: { display: false },
                      ticks: { color: '#9ca3af', font: { weight: '600' } }
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-indigo-700/40 p-6 md:p-8 lg:p-10 shadow-2xl w-full">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">Income vs Expenses</h3>
            <div className="h-72 lg:h-80 flex items-center justify-center w-full">
              <Pie 
                data={pieData} 
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: { 
                      position: 'bottom', 
                      labels: { 
                        color: '#e5e7eb',
                        font: { weight: 'bold', size: 14 },
                        padding: 20,
                        usePointStyle: true
                      } 
                    },
                    tooltip: { 
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      titleColor: '#e5e7eb',
                      bodyColor: '#e5e7eb',
                      padding: 12,
                      cornerRadius: 10,
                    },
                  },
                }} 
              />
            </div>

            <div className="mt-6 pt-6 border-t border-indigo-700/30 text-center">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Savings Rate</p>
              <p className="text-3xl lg:text-4xl font-bold text-emerald-400">
                {totalIn > 0 ? ((balance / totalIn) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-indigo-700/40 overflow-hidden shadow-2xl w-full">
          <div className="p-6 md:p-8 lg:p-10 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-b border-indigo-700/40">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
                <ListOrdered className="w-7 h-7 text-indigo-400" /> Recent Transactions
              </h3>
              <span className="px-5 py-2 bg-indigo-900/50 text-indigo-300 rounded-lg text-sm lg:text-base font-medium">
                {filteredData.length} Records
              </span>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-black/50">
                <tr>
                  <th className="px-6 py-4 text-sm lg:text-base font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-sm lg:text-base font-semibold text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-sm lg:text-base font-semibold text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-sm lg:text-base font-semibold text-gray-300 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredData.slice(0, 8).map((t, i) => (
                  <tr 
                    key={i} 
                    className="hover:bg-indigo-950/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-5 text-gray-300 text-base">
                      {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1.5 bg-gray-800/70 text-gray-200 rounded-lg text-sm lg:text-base font-medium">
                        {t.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-xs lg:text-sm font-bold uppercase ${
                        t.type === 'in' 
                          ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/40' 
                          : 'bg-rose-900/50 text-rose-300 border border-rose-700/40'
                      }`}>
                        {t.type === 'in' ? '↓ Income' : '↑ Expense'}
                      </span>
                    </td>
                    <td className={`px-6 py-5 text-right text-lg lg:text-xl font-bold ${
                      t.type === 'in' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {t.type === 'in' ? '+' : '-'} ₹{t.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length > 8 && (
            <div className="p-6 lg:p-8 bg-black/40 border-t border-indigo-700/30 text-center">
              <button className="px-8 py-3 lg:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg text-base lg:text-lg">
                View All Transactions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.random() > 0.5 ? '' : '-'}30px, -60px); }
        }
        .animate-pulse-slow {
          animation: pulse 18s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ title, amount, color, icon, isBalance, trend }) => {
  const colorMap = {
    emerald: { 
      bg: 'bg-gradient-to-br from-emerald-900/60 to-teal-900/60', 
      text: 'text-emerald-300', 
      border: 'border-emerald-700/40',
      light: 'bg-emerald-950/30'
    },
    rose: { 
      bg: 'bg-gradient-to-br from-rose-900/60 to-pink-900/60', 
      text: 'text-rose-300', 
      border: 'border-rose-700/40',
      light: 'bg-rose-950/30'
    },
    indigo: { 
      bg: 'bg-gradient-to-br from-indigo-900/60 to-purple-900/60', 
      text: 'text-indigo-300', 
      border: 'border-indigo-700/40',
      light: 'bg-indigo-950/30'
    }
  };

  const colors = colorMap[color];

  return (
    <div className={`bg-black/30 backdrop-blur-xl rounded-2xl border ${colors.border} p-6 lg:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden w-full`}>
      <div className={`absolute -right-10 -top-10 w-40 h-40 ${colors.light} rounded-full blur-3xl`}></div>
      
      <div className="relative">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-xl ${colors.bg} shadow-lg`}>
            {React.cloneElement(icon, { size: 28, className: 'text-white' })}
          </div>
          {trend && (
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${
              trend.startsWith('+') ? 'bg-emerald-900/50 text-emerald-300' : 'bg-rose-900/50 text-rose-300'
            } border border-opacity-40 ${trend.startsWith('+') ? 'border-emerald-700' : 'border-rose-700'}`}>
              {trend}
            </div>
          )}
        </div>

        <h3 className="text-gray-400 text-sm lg:text-base font-semibold uppercase tracking-wider mb-2">{title}</h3>
        <p className={`text-4xl lg:text-5xl font-black ${colors.text} tracking-tight`}>
          ₹{amount.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default Summary;