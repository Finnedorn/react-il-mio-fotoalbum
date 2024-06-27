// import CardComponent from "../../assets/components/Card/CardComponent";
import { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePhotos } from "../../contexts/photoContext";


const PhotoIndex = () => {

  // con destructuring estrapolo i valori di photos dalla funzione di use
  const {photos} = usePhotos();
  console.log("renderizzo");
  
  return (
    <>
      <h1>
        Pagina di index
      </h1>
      {/* cards */}
      {/* <div className="container d-flex flex-wrap justify-content-center align-items-center">
        { photos !== null ?
          photos.map((photo) => (
            <CardComponent
              key={photo.id}
              title={photo.title}
              image={photo.image}
              content={photo.content}
              category={photo.category}
              tags={photo.tags}
              published={photo.published}
              slug={photo.slug}
              photo={photo}
              />
          ))
          :
          <p className="p-5 fs-4 text-center text-light">
            Carico i photos...
          </p>
        }
      </div> */}
    </>
  );
};

export default PhotoIndex;
