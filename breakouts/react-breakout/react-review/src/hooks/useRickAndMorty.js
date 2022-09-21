import { useState, useEffect } from 'react';
import axios from 'axios';

function useRickAndMorty(){
  const [characters, setCharacters] = useState([])
  
  useEffect(() => {
    const API_URL = 'https://rickandmortyapi.com/api/character';
    axios.get(API_URL)
      .then(res => setCharacters(res.data.results))
      .catch(err => console.error(err))
  }, []);
  
  return { characters }
}

export default useRickAndMorty;
