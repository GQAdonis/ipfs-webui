import React, { useId } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import worldData from './world.json'

export default function Map ({ width, height, path }) {
  const pattern = useId().replaceAll(':', '')
  return <svg width={width} height={height}>
    <defs><pattern id={pattern} x='0' y='0' width='5' height='5' patternUnits='userSpaceOnUse'>
      <circle cx='3' cy='3' r='1' fill='#AAA' stroke='#DDD' />
    </pattern></defs>
    <path d={path(topojson.feature(worldData, worldData.objects.land))} fill={`url(#${pattern})`} />
    <path d={path(topojson.mesh(worldData, worldData.objects.countries, (a, b) => a !== b))} fill='none' stroke='none' />
    <path className='graticule' d={path(d3.geoGraticule()())} />
  </svg>
}
