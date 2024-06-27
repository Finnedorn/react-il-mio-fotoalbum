import c from "./Card.module.css";
import { Link, useSearchParams } from "react-router-dom";


const CardComponent = ({
  id,
  title,
  image,
  description,
  categories,
  visible,
  slug,
  photo
}) => {
  return (
    <div className={c.cardWrapper}>
      <div className={c.card}>
        <div className={c.cardBody}>
            <div>
              <div className={!visible && "notPublished"}>
                <div className={c.cardImg}>
                  {image ? (
                    <img src={image} alt={`immagine di ${title}`} />
                  ) : (
                    <img
                      src="https://placehold.co/600x400"
                      alt={`immagine di ${title}`}
                    />
                  )}
                </div>
                <div className="p-5">
                  <div>
                    <h2 className={c.cardTitle}>{title}</h2>
                    <p
                      style={{
                        fontSize: "1.3rem",
                        padding: "10px 0px",
                      }}
                    >
                      {description.length > 50
                        ? description.substring(0, 50) + "..."
                        : description}
                    </p>
                  </div>
                  <div>
                    <div className="mb-3">
                      <span 
                      className="badge text-bg-primary fs-5 me-2 text-light"
                      >
                        {description.name}
                      </span>
                    </div>
                    {categories.map((category, index) => (
                      <span
                        key={index}
                        className={`tag text-bg-secondary badge fs-5 me-2 text-light`}
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="ps-5 pb-2">
                <Link to={`/photos/${slug}`} state={{photo}}>
                    <button className="btn btn-success me-2 fw-bold fs-5">
                      Leggi
                    </button>
                </Link>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
