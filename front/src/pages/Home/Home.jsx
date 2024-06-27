import { useAuth } from "../../contexts/AuthContext";

import CardComponent from "../../assets/components/Card/CardComponent";
import { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePhotos } from "../../contexts/PhotoContext";

const Home = () => {
  const { userData, isLogged } = useAuth();

  // con destructuring estrapolo i valori di photos dalla funzione di use
  const {photos} = usePhotos();
  console.log("renderizzo");

  return (
    <>
      {isLogged === true ? (
        <div className=" d-flex display-1 justify-content-center text-light">
          <h1>Benvenutə! {userData.name} </h1>
        </div>
      ) : (
        <div className="container">
          <h1 className="display-1 m-auto text-center text-light">Questa è la Home !</h1>
          <div className="container d-flex flex-wrap justify-content-center align-items-center">
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
