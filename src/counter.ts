export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `Il y a  ${counter} pokèmons qui sont venus nous dire bonjour!`
  }
  document.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}
