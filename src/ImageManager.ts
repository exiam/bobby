// Gestion du chargement des images.
//
// Fonctionnement :
//
// ```
// const imagesLoader = ImageManager.load('assets/img/', images)
//
// Promise.all(imagesLoader).then(() => {
//   // code
// })
// ```
export default class ImageManager {
  // Images chargées
  private static images: { [key: string]: HTMLImageElement } = {}

  // Obtenir une image par son nom
  public static getImage(name: string): HTMLImageElement {
    return ImageManager.images[name]
  }

  // Exécute le chargement des images
  public static load(path: string, images: { [key: string]: string }): Array<Promise<HTMLImageElement>> {
    const promises = new Array<Promise<HTMLImageElement>>()

    for (const [name, url] of Object.entries(images)) {
      const img = document.createElement('img') as HTMLImageElement

      const promise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.addEventListener('load', () => {
          ImageManager.images[name] = img
          resolve(img)
        })

        img.addEventListener('error', () => {
          reject(`Impossible de charger l'image « ${url} »`)
        })
      })

      img.src = path + url

      promises.push(promise)
    }

    return promises
  }
}