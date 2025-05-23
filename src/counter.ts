export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    switch(count){
      case 0:
        element.innerHTML = `Il y n' a pas de pokèmons ici! Mais ou sont-ils?`;
        break;
      case 1: 
          element.innerHTML = `Ah les voilà!`;
          break;
      default:
          element.innerHTML = `Il y a  ${counter} pokèmons qui sont venus nous dire bonjour!`;
          break;
          }
    }
      document.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
  }


