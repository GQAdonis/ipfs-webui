import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, ArcElement, DoughnutController, PieController, Filler, Tooltip, Legend } from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, ArcElement, DoughnutController, PieController, Filler, Tooltip, Legend)
export { Line, Pie, Doughnut } from 'react-chartjs-2'
