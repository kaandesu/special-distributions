import { createCanvas } from 'canvas'
import fs from 'fs'
import { NegativeBinomial } from './../distributions'

/* FOR NOW RENDERS ONLY FOR ONE DISTRIBUTON - just an example */

const geo = new NegativeBinomial(10, 0.09)
let sums: Record<string, number> = {}
let id = geo.id
let totalTimes = 20_000
console.time('calculation')
const setSums = async () => {
  for (let i = 0; i < totalTimes; i++) {
    let calc = await geo.probabilityAt(3)
    if (String(calc) in sums) {
      sums[String(calc)] += 1
    } else {
      sums[String(calc)] = 1
    }
    console.clear()
    console.log(((i * 100) / totalTimes + 0.001).toFixed(2) + '%')
  }
  //console.log(sums)
  return sums
}

setSums()
  .then((sums) => {
    const data = sums

    // Set up the canvas
    const canvasWidth = Object.keys(data).length * 10 // Width of the canvas in pixels
    const canvasHeight = 1080 // Height of the canvas in pixels
    const barPadding = 10 // Padding between bars in pixels
    const maxBarHeight = canvasHeight - barPadding * 2 // Maximum height of the bars

    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d')

    // Set up the font (if needed)
    // registerFont('path/to/font.ttf', { family: 'Font Name' });

    // Find the maximum value in the data
    const maxValue = Math.max(...Object.values(data))
    const minValue = 1
    // Set up the chart colors

    const labelColor = '#000'

    // Calculate the width of each bar
    const barWidth = (canvasWidth - barPadding * 2) / Object.keys(data).length

    // Draw the bars
    let x = barPadding
    for (const [key, value] of Object.entries(data)) {
      const barHeight = (value / maxValue) * maxBarHeight
      const barColor = `rgb(${255 - Math.floor((255 * value) / maxValue)},  ${Math.floor(
        (255 * value) / maxValue
      )}, 100)`
      // Draw the bar
      ctx.fillStyle = barColor
      ctx.fillRect(x, canvasHeight - barHeight - barPadding, barWidth, barHeight)

      // Draw the label
      ctx.fillStyle = labelColor
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(key, x + barWidth / 2, canvasHeight - 5)
      if (maxValue === value) {
        let fontSize = (12 * canvasWidth) / 500
        ctx.font = String(fontSize) + 'px sans-serif'
        ctx.fillText(`${value}/${totalTimes} @ ${key}`, fontSize * 5, fontSize * 1.5)
      }
      x += barWidth + barPadding
    }
    // Set the line properties
    ctx.strokeStyle = '#000' // Color of the line
    ctx.lineWidth = 2 // Width of the line
    ctx.setLineDash([5, 5]) // Length of dashes and gaps

    // Draw the dashed line
    ctx.beginPath()
    ctx.moveTo(0, 7) // Starting point (x, y)
    ctx.lineTo(canvas.width, 7) // Ending point (x, y)
    ctx.stroke()

    // Convert the canvas to a PNG image
    const chartImage = canvas.toBuffer('image/png')

    // Save the PNG image to a file
    fs.writeFile(`./generated/${id}_chart.png`, chartImage, (err) => {
      if (err) throw err
      console.log('Chart image saved!')
    })
  })
  .finally(() => {
    console.timeEnd('calculation')
  })
