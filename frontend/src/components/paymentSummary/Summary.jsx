

// import React, { useState, useMemo } from 'react';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   Title,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Filler,
// } from 'chart.js';
// import { Pie, Line, Bar } from 'react-chartjs-2';
// import { ArrowUpCircle, ArrowDownCircle, Wallet, ListOrdered, Calendar } from 'lucide-react';

// // Register ChartJS components
// ChartJS.register(
//   ArcElement, Tooltip, Legend, Title,
//   CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler
// );

// const Summary = () => {
//   const [period, setPeriod] = useState('all');
//   const currentDate = new Date('2026-01-15');

//   // Dummy Data
//   const dummyTransactions = [
//     { date: '2026-01-10', amount: 500, type: 'in', category: 'Salary' },
//     { date: '2026-01-05', amount: 200, type: 'out', category: 'Food' },
//     { date: '2025-12-25', amount: 1200, type: 'in', category: 'Freelance' },
//     { date: '2025-12-15', amount: 400, type: 'out', category: 'Rent' },
//     { date: '2025-11-20', amount: 800, type: 'in', category: 'Bonus' },
//     { date: '2025-10-10', amount: 150, type: 'out', category: 'Shopping' },
//     { date: '2025-08-05', amount: 1500, type: 'in', category: 'Investment' },
//   ];

//   // Filter data based on period
//   const filteredData = useMemo(() => {
//     let startDate = new Date(currentDate);
//     if (period === '1y') startDate.setFullYear(currentDate.getFullYear() - 1);
//     else if (period === '6m') startDate.setMonth(currentDate.getMonth() - 6);
//     else if (period === '3m') startDate.setMonth(currentDate.getMonth() - 3);
//     else if (period === '1m') startDate.setMonth(currentDate.getMonth() - 1);
//     else startDate = new Date(0);

//     return dummyTransactions.filter(t => new Date(t.date) >= startDate);
//   }, [period]);

//   // Totals
//   const totalIn = filteredData.filter(t => t.type === 'in').reduce((s, t) => s + t.amount, 0);
//   const totalOut = filteredData.filter(t => t.type === 'out').reduce((s, t) => s + t.amount, 0);
//   const balance = totalIn - totalOut;

//   // Pie Chart Data
//   const pieData = {
//     labels: ['Income', 'Expense'],
//     datasets: [{
//       data: [totalIn, totalOut],
//       backgroundColor: ['#10b981', '#f43f5e'],
//       hoverOffset: 10,
//       borderWidth: 0,
//     }],
//   };

//   // Line Chart Data - DYNAMIC: Income aur Expense alag-alag lines
//   const lineChartData = useMemo(() => {
//     const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
//     const labels = sortedData.map(t => 
//       new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
//     );
    
//     const incomeData = sortedData.map(t => t.type === 'in' ? t.amount : null);
//     const expenseData = sortedData.map(t => t.type === 'out' ? t.amount : null);

//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Income',
//           data: incomeData,
//           fill: true,
//           backgroundColor: 'rgba(16, 185, 129, 0.1)',
//           borderColor: '#10b981',
//           borderWidth: 3,
//           tension: 0.4,
//           pointRadius: 5,
//           pointBackgroundColor: '#10b981',
//           pointBorderColor: '#fff',
//           pointBorderWidth: 2,
//           pointHoverRadius: 7,
//           spanGaps: true,
//         },
//         {
//           label: 'Expense',
//           data: expenseData,
//           fill: true,
//           backgroundColor: 'rgba(244, 63, 94, 0.1)',
//           borderColor: '#f43f5e',
//           borderWidth: 3,
//           tension: 0.4,
//           pointRadius: 5,
//           pointBackgroundColor: '#f43f5e',
//           pointBorderColor: '#fff',
//           pointBorderWidth: 2,
//           pointHoverRadius: 7,
//           spanGaps: true,
//         }
//       ],
//     };
//   }, [filteredData]);

//   // Bar Chart Data - DYNAMIC: Month-wise Income vs Expense
//   const barChartData = useMemo(() => {
//     const monthlyData = {};
    
//     filteredData.forEach(t => {
//       const monthYear = new Date(t.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
      
//       if (!monthlyData[monthYear]) {
//         monthlyData[monthYear] = { income: 0, expense: 0 };
//       }
      
//       if (t.type === 'in') {
//         monthlyData[monthYear].income += t.amount;
//       } else {
//         monthlyData[monthYear].expense += t.amount;
//       }
//     });

//     const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
//       return new Date(a) - new Date(b);
//     });

//     return {
//       labels: sortedMonths,
//       datasets: [
//         {
//           label: 'Income',
//           data: sortedMonths.map(m => monthlyData[m].income),
//           backgroundColor: 'rgba(16, 185, 129, 0.7)',
//           borderColor: '#10b981',
//           borderWidth: 1,
//           borderRadius: 6,
//         },
//         {
//           label: 'Expense',
//           data: sortedMonths.map(m => monthlyData[m].expense),
//           backgroundColor: 'rgba(244, 63, 94, 0.7)',
//           borderColor: '#f43f5e',
//           borderWidth: 1,
//           borderRadius: 6,
//         }
//       ],
//     };
//   }, [filteredData]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-200 via-blue-150 to-indigo-100 rounded-3xl">
//       <div className="max-w-7xl mx-auto p-4 md:p-8">
//         {/* Header Section */}
//         <div className="mb-8 bg-gradient-to-r from-gray-800 to-indigo-900 rounded-3xl p-8 shadow-xl">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
//             <div className="text-white">
//               <h1 className="text-4xl font-black flex items-center gap-3 mb-2">
//                 <Wallet size={40} /> Financial Dashboard
//               </h1>
//               <p className="text-blue-100 text-lg">Complete overview of your financial activities</p>
//             </div>
//             <div className="flex bg-white/20 backdrop-blur-md border border-white/30 p-1.5 rounded-2xl shadow-lg">
//               {['all', '1y', '6m', '3m', '1m'].map((p) => (
//                 <button
//                   key={p}
//                   onClick={() => setPeriod(p)}
//                   className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
//                     period === p ? 'bg-white text-blue-600 shadow-lg' : 'text-white hover:bg-white/10'
//                   }`}
//                 >
//                   {p.toUpperCase()}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <StatCard title="Total Income" amount={totalIn} color="emerald" icon={<ArrowDownCircle />} trend="+12.5%" />
//           <StatCard title="Total Expenses" amount={totalOut} color="rose" icon={<ArrowUpCircle />} trend="-8.3%" />
//           <StatCard title="Net Balance" amount={balance} color="blue" icon={<Wallet />} isBalance trend="+18.2%" />
//         </div>

//         {/* Charts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
//           {/* Transaction Trend - Dynamic Charts */}
//           <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-slate-200 hover:shadow-2xl transition-shadow">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
//                 <Calendar size={24} className="text-blue-600" /> Transaction Trend
//               </h3>
//               <div className="px-4 py-2 bg-blue-50 rounded-full">
//                 <span className="text-sm font-bold text-blue-600">Last {period === 'all' ? 'All Time' : period.toUpperCase()}</span>
//               </div>
//             </div>

//             {/* Bar Chart - Full Width */}
//             <div className="h-96">
//               <Bar
//                 data={barChartData}
//                 options={{
//                   maintainAspectRatio: false,
//                   plugins: {
//                     legend: { 
//                       position: 'top', 
//                       labels: { 
//                         font: { size: 13, weight: 'bold' },
//                         padding: 20,
//                         usePointStyle: true
//                       } 
//                     },
//                     tooltip: { 
//                       backgroundColor: 'rgba(15, 23, 42, 0.92)', 
//                       cornerRadius: 10,
//                       padding: 12,
//                       callbacks: {
//                         label: function(context) {
//                           return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString('en-IN');
//                         }
//                       }
//                     },
//                   },
//                   scales: {
//                     y: { 
//                       beginAtZero: true, 
//                       grid: { color: 'rgba(0,0,0,0.06)' },
//                       ticks: {
//                         font: { size: 12, weight: '600' },
//                         callback: (value) => '₹' + value
//                       }
//                     },
//                     x: { 
//                       grid: { display: false },
//                       ticks: {
//                         font: { size: 12, weight: '600' }
//                       }
//                     },
//                   },
//                   animation: {
//                     duration: 1500,
//                     easing: 'easeOutQuart'
//                   }
//                 }}
//               />
//             </div>
//           </div>

//           {/* Pie Chart */}
//           <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 hover:shadow-2xl transition-shadow">
//             <h3 className="text-xl font-black text-slate-800 mb-6">Income vs Expenses</h3>
//             <div className="h-64 w-full flex items-center justify-center">
//               <Pie data={pieData} options={{
//                 maintainAspectRatio: false,
//                 plugins: {
//                   legend: { position: 'bottom', labels: { font: { weight: 'bold', size: 13 }, padding: 20, usePointStyle: true } },
//                   tooltip: { 
//                     backgroundColor: 'rgba(0,0,0,0.8)', 
//                     padding: 12, 
//                     cornerRadius: 8,
//                     callbacks: {
//                       label: function(context) {
//                         return context.label + ': ₹' + context.parsed.toLocaleString('en-IN');
//                       }
//                     }
//                   },
//                 }
//               }} />
//             </div>
//             <div className="mt-6 pt-6 border-t border-slate-100">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-semibold text-slate-500">Savings Rate</span>
//                 <span className="text-lg font-black text-emerald-600">
//                   {totalIn > 0 ? ((balance / totalIn) * 100).toFixed(1) : 0}%
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Transactions Table */}
//         <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
//           <div className="p-8 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 flex justify-between items-center">
//             <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
//               <ListOrdered size={24} className="text-blue-600" /> Recent Transactions
//             </h3>
//             <span className="px-4 py-2 bg-white rounded-full text-sm font-bold text-slate-600 shadow-sm">
//               {filteredData.length} Total
//             </span>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 uppercase text-xs font-black">
//                 <tr>
//                   <th className="px-8 py-5">Date</th>
//                   <th className="px-8 py-5">Category</th>
//                   <th className="px-8 py-5">Type</th>
//                   <th className="px-8 py-5 text-right">Amount</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {filteredData.slice(0, 8).map((t, i) => (
//                   <tr key={i} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-200">
//                     <td className="px-8 py-5 text-sm text-slate-600 font-bold">
//                       {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
//                     </td>
//                     <td className="px-8 py-5">
//                       <span className="text-sm text-slate-800 font-black bg-slate-100 px-3 py-1 rounded-lg">
//                         {t.category || 'General'}
//                       </span>
//                     </td>
//                     <td className="px-8 py-5">
//                       <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-sm ${
//                         t.type === 'in'
//                           ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200'
//                           : 'bg-gradient-to-r from-rose-100 to-rose-50 text-rose-700 border border-rose-200'
//                       }`}>
//                         {t.type === 'in' ? '↓ Credit' : '↑ Debit'}
//                       </span>
//                     </td>
//                     <td className={`px-8 py-5 text-base font-black text-right ${t.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>
//                       {t.type === 'in' ? '+' : '-'} ₹{t.amount.toLocaleString('en-IN')}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {filteredData.length > 8 && (
//             <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
//               <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
//                 View All Transactions
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ title, amount, color, icon, isBalance, trend }) => {
//   const colorMap = {
//     emerald: { bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', text: 'text-emerald-600', lightBg: 'bg-emerald-50', border: 'border-emerald-100' },
//     rose: { bg: 'bg-gradient-to-br from-rose-500 to-rose-600', text: 'text-rose-600', lightBg: 'bg-rose-50', border: 'border-rose-100' },
//     blue: { bg: 'bg-gradient-to-br from-blue-500 to-blue-600', text: 'text-blue-600', lightBg: 'bg-blue-50', border: 'border-blue-100' }
//   };

//   const colors = colorMap[color];

//   return (
//     <div className={`bg-white p-8 rounded-3xl shadow-xl border-2 ${colors.border} hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}>
//       <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 rounded-full blur-2xl"></div>
//       <div className="relative">
//         <div className="flex justify-between items-start mb-6">
//           <div className={`p-4 rounded-2xl ${colors.bg} shadow-lg`}>
//             {React.cloneElement(icon, { size: 28, className: 'text-white' })}
//           </div>
//           {trend && (
//             <div className={`px-3 py-1 rounded-full text-xs font-black ${
//               trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
//             }`}>
//               {trend}
//             </div>
//           )}
//         </div>
//         <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wide mb-2">{title}</h3>
//         <p className={`text-4xl font-black ${colors.text} tracking-tight`}>
//           ₹{amount.toLocaleString('en-IN')}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Summary;





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
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 relative overflow-hidden py-6 px-4 md:px-6">

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

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-indigo-700/40 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent flex items-center gap-3">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar + Line Chart - Combined Section */}
          <div className="lg:col-span-2 bg-black/30 backdrop-blur-xl rounded-2xl border border-indigo-700/40 p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Calendar className="w-7 h-7 text-indigo-400" /> Transaction Trend
              </h3>
              <span className="px-4 py-2 bg-indigo-900/50 text-indigo-300 rounded-lg text-sm font-medium">
                {period === 'all' ? 'All Time' : `Last ${period.toUpperCase()}`}
              </span>
            </div>

            <div className="h-[420px]">
              <Bar
                data={barChartData}
                options={{
                  maintainAspectRatio: false,
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
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-indigo-700/40 p-6 md:p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Income vs Expenses</h3>
            <div className="h-72 flex items-center justify-center">
              <Pie 
                data={pieData} 
                options={{
                  maintainAspectRatio: false,
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
              <p className="text-3xl font-bold text-emerald-400">
                {totalIn > 0 ? ((balance / totalIn) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-indigo-700/40 overflow-hidden shadow-2xl">
          <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-b border-indigo-700/40">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <ListOrdered className="w-7 h-7 text-indigo-400" /> Recent Transactions
              </h3>
              <span className="px-5 py-2 bg-indigo-900/50 text-indigo-300 rounded-lg text-sm font-medium">
                {filteredData.length} Records
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredData.slice(0, 8).map((t, i) => (
                  <tr 
                    key={i} 
                    className="hover:bg-indigo-950/30 transition-colors duration-150"
                  >
                    <td className="px-6 py-5 text-gray-300">
                      {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1.5 bg-gray-800/70 text-gray-200 rounded-lg text-sm font-medium">
                        {t.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
                        t.type === 'in' 
                          ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/40' 
                          : 'bg-rose-900/50 text-rose-300 border border-rose-700/40'
                      }`}>
                        {t.type === 'in' ? '↓ Income' : '↑ Expense'}
                      </span>
                    </td>
                    <td className={`px-6 py-5 text-right text-lg font-bold ${
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
            <div className="p-6 bg-black/40 border-t border-indigo-700/30 text-center">
              <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg">
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
    <div className={`bg-black/30 backdrop-blur-xl rounded-2xl border ${colors.border} p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden`}>
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

        <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">{title}</h3>
        <p className={`text-4xl md:text-5xl font-black ${colors.text} tracking-tight`}>
          ₹{amount.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default Summary;