export function drawImageByIndex(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  index: number,
  width: number,
  height: number,
): void {
  // Nombre de tuiles par ligne
  const nbTilesByLine = Math.ceil(img.width / width)

  // Position x depuis laquelle découper le morceau
  const basex = (index % nbTilesByLine) * width

  // Position y depuis laquelle découper le morceau
  const basey = Math.floor(index / nbTilesByLine) * height

  // Afficher le morceau d'image
  ctx.drawImage(
    img,
    basex,
    basey,
    width,
    height,
    x,
    y,
    width,
    height,
  )
}

export function clamp(num: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, num))
}
