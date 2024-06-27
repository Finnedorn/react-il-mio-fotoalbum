import React from "react";
import { Link } from "react-router-dom";

// componente modello per la formattazione della pagina della photo singola
// importo direttamente photo come prop placeholder 
const DetailsComponent = ({ photo, isLogged, setUpdateMode, setDeleteMode }) => {
  return (
    <div>
      <div style={{ overflow: "hidden" }}>
        {/* se l'elemento ha una foto la uso altrimenti uso un placeholder */}
        {photo.image ? (
          <img src={photo.image} alt={`Image of ${photo.title}`} />
        ) : (
          <img
            src="https://placehold.co/600x400"
            alt={`Image of ${photo.title}`}
          />
        )}
      </div>
      <div className="d-flex justify-content-center w-75">
        <div className="p-5">
          <div>
            {/* title */}
            <h2 
            style={{ marginBottom: "10px" }}
            >{photo.title}
            </h2>
            {/* description */}
            <p 
            style={{ fontSize: "1.3rem", padding: "10px 0px" }}
            >
              {photo.description}
            </p>
          </div>
          <div>
            {/* visible */}
            <div className={`d-flex mb-3 ${isLogged ? "d-block" : "d-none"}`}>
              <span className="badge text-bg-primary fs-5 me-2 text-light">
                stato: {photo.visible ? "pubblicata" : "non pubblicata"}
              </span>
            </div>
            {/* categories */}
            {photo.categories.map((category) => (
              <span
                key={category.id}
                className="tag text-bg-secondary badge fs-5 me-2 text-light"
              >
                {category.name}
              </span>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center align-content-center mt-5">
            {/* back to home/index */}
            <div>
              <Link to={isLogged ? "../" : "/"} relative="path">
                <button className="btn btn-success me-2">
                  Torna alla Pagina Precedente
                </button>
              </Link>
            </div>
            {/* edit & delete */}
            <div className={`d-flex ${isLogged ? "d-block" : "d-none"}`}>
              <button
                className="btn btn-success me-2"
                onClick={() => setUpdateMode(true)}
              >
                Modifica
              </button>
              <button
                className="btn btn-danger me-2"
                onClick={() => setDeleteMode()}
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsComponent;