export function pointInPolygon(point: [number, number], vs: [number, number][]) {
  const x = point[0], y = point[1]
  let inside = false
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1]
    const xj = vs[j][0], yj = vs[j][1]

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi + 0.0) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

export function centroid(coords: [number, number][]) : [number, number]{
  const sum = coords.reduce((acc,c)=>[acc[0]+c[0], acc[1]+c[1]],[0,0])
  return [sum[0]/coords.length, sum[1]/coords.length]
}

export function dangerFromAvcd(avcd: number){
  if(avcd >= 75) return { level: 'Alto', colorClass: 'bg-red-600', text: 'Rojo', hex:'#E60000' }
  if(avcd >= 60) return { level: 'Medio', colorClass: 'bg-yellow-500', text: 'Amarillo', hex:'#FF8A00' }
  return { level: 'Bajo', colorClass: 'bg-green-600', text: 'Verde', hex:'#2EA043' }
}

export function zoneColor(avcd: number){
  return dangerFromAvcd(avcd).hex
}
