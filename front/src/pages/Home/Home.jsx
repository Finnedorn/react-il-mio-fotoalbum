// importo useAuth dal quale estrarro i valori di userData per i valori dell'utente
// e il valore di islogged per capire se l'utente e loggato o meno
import { useAuth } from "../../contexts/AuthContext";
// importo il componente card
import CardComponent from "../../assets/components/Card/CardComponent";
// essendo, la route home, dentro al provider di Photo posso 
// importare l'hook usePhotos dal quale estrarro i dati di photos 
import { usePhotos } from "../../contexts/PhotoContext";
// link e una componente di routerdom che mi permette di viaggiare tra le pagine 
import { Link } from "react-router-dom";

const Home = () => {
  // etraggo i valori di userData e isLogged dall'hook
  const { userData, isLogged } = useAuth();

  // con destructuring estrapolo i valori di photos
  // contentente i dati della chiamata axios dalla funzione di use
  const {photos} = usePhotos();
  console.log("renderizzo");

  return (
    <>
      {/* se isLogged e' true l'utente ha effettuato il login pertanto mostro un messaggio di benvenuto */}
      {isLogged === true ? (
        <div className="text-center display-1 text-light">
          <h1>Benvenutə! {userData.name} </h1>
          <div>
            <button className="btn btn-success me-2">
                      <Link
                        to={`/photos`}
                        className=" nav-link active"
                        aria-current="page"
                      >
                        Accedi alla pagina delle photo
                      </Link>
            </button>
          </div>
        </div>
      ) : (
        // altrimenti mostro la home 
        <div className="container">
          <h1 className="display-1 m-auto text-center text-light">Questa è la Home !</h1>
          <div className="container d-flex flex-wrap justify-content-center align-items-center">
            {/* se photos ha ricevuto i dati dalla chiamata axios */}
            {photos !== null ? (
              photos.map((photo) => (
                <CardComponent
                  key={photo.id}
                  title={photo.title}
                  image={photo.image}
                  description={photo.description}
                  categories={photo.categories}
                  visible={photo.visible}
                  slug={photo.slug}
                  photo={photo}
                />
              ))
            ) : (
              // altrimenti dispongo un messaggio di caricamento
              <p className="p-5 fs-4 text-center text-light">
                Carico i photos...
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
// 