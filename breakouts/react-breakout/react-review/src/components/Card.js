function Card(props){
  const { name, status, species, image } = props;
  
  return (
    <article className="card">
      <img src={image} alt="rick and morty character" />
      <h3>{name}</h3>
      <ul>
        <li>{status}</li>
        <li>{species}</li>
      </ul>
    </article>
  );
}

export default Card;
