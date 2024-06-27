import CardComponent from "../../assets/components/Card/CardComponent";
import { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePhotos } from "../../contexts/PhotoContext";

const PhotoIndex = () => {
  // con destructuring estrapolo i valori di photos dalla funzione di use
  const { photos } = usePhotos();
  console.log("renderizzo");

  return (
    <>
      <h1>Pagina di index</h1>
      {/* cards */}
      <div className="container">
        <h1 className="display-1 m-auto text-center text-light">
          Questa è la Home !
        </h1>
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
    </>
  );
};

export default PhotoIndex;
