import { memo,useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { theme, card } from '../styles'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
}

const styles = {
  card: {
    ...card,
    padding: '20px',
    marginTop: '24px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    height: '400px',
  },
  title: {
    fontSize: theme.fontSizes.base,
    fontWeight: 600,
    color: theme.colors.text,
    margin: '0 0 16px 0',
  },
  chartContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
  }
}

const LanguageChart = ({ repos })=> {
  const { labels, data, colors } = useMemo(() => {
    const counts = {}
    repos.forEach((repo) => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1
      }
    })
    
    const sorted = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      
    return {
      labels: sorted.map((l) => l.name),
      data: sorted.map((l) => l.count),
      colors: sorted.map((l) => LANG_COLORS[l.name] || '#6b7280'),
    }
  }, [repos])

  if (!labels.length) return null

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Repositories',
        data,
        backgroundColor: colors,
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  }

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { 
        enabled: true,
        backgroundColor: '#000000', 
        titleColor: '#FFFFFF',      
        bodyColor: '#FFFFFF',       
        borderColor: '#333333',     
        borderWidth: 1 
      },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { 
          color: theme.colors.textSecondary,
          font: { size: 12 }
        },
      },
    },
  }

  return (
    <div style={styles.card}>
      <h4 style={styles.title}>Languages</h4>
      <div style={styles.chartContainer}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}

export default memo(LanguageChart)