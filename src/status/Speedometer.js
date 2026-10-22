import React from 'react'
import { Doughnut } from '../lib/charts.js'
import filesize from 'filesize'
import { useChartPalette } from '../promethity/tokens.js'

const rotation = (n) => (0.5 + (1 - n)) * 180 + 90
const circumference = (n) => n * 360

function Speedometer ({ total = 100, title, filled = 0, noSpeed = false, color }) {
  const palette = useChartPalette()
  const fill = color || palette.down
  const doughnut = {
    options: {
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      maintainAspectRatio: false,
      cutout: '80%',
      rotation: rotation(0.7),
      circumference: circumference(0.7)
    },
    data: {
      labels: ['Speed', 'Nothing'],
      datasets: [{
        data: [filled, filled > total ? 0 : total - filled],
        backgroundColor: [fill, palette.track],
        hoverBackgroundColor: [fill, palette.track],
        borderWidth: [0, 0]
      }]
    }
  }

  // network bandwidth units matchin 'ipfs stats bw'
  // to align with what ISP usually shows on invoice
  const data = filesize(filled, {
    standard: 'iec',
    base: 2,
    output: 'array',
    round: 0,
    bits: false
  })

  return (
    <div className='relative tc center overflow-hidden' style={{ width: '11em', height: '9em' }} >
      <div style={{ width: '11em', height: '11em', marginTop: '-1em' }}>
        <Doughnut {...doughnut} />
      </div>

      <div className='absolute' style={{ top: '60%', left: '50%', transform: 'translate(-50%, -50%)' }} >
        <span className='f3'>{data[0]}</span><span className='ml1 f7'>{data[1]}{ noSpeed ? '' : '/s' }</span>
        <span className='db f7 fw5'>{title}</span>
      </div>
    </div>
  )
}
export default Speedometer
