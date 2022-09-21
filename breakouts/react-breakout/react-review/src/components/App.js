import useRickAndMorty from '../hooks/useRickAndMorty'
import Card from './Card'
import './App.css';

function App() {
  const { characters } = useRickAndMorty();
  
  if (!characters || characters.length === 0) {
    return (
      <>
        <h1>Hello from App! 👋⚛️</h1>
        <h3>No characters found!</h3>
      </>
    );
  }
  
  return (
    <>
      <h1>Hello from App! 👋⚛️</h1>
      {
        characters.map(char => (
          <Card
            key={char.id}
            name={char.name}
            status={char.status}
            species={char.species}
            image={char.image}
          />
        ))
      }
    </>
  );
}

export default App;
