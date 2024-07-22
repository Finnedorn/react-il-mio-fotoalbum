import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const CreatePhotoForm = ({ categoriesData }) => {

  // creo una var hook per raccogliere tutti i dati dal form
  const [createData, setCreateData] = useState({
    title: "",
    image: "",
    description: "",
    visible: false,
    categories: [],
  });

  const navigate = useNavigate();

  //  funzione per l'update della photo
  const createPhoto = async (e) => {
    e.preventDefault();
    console.log(createData);
    // creo una var con un nuovo elemento FormData(),
    // una classe nativa di js per storare elementi
    // che contengono un file (in questo caso l'img)
    // da inserire per la chiamata
    const formDataToSubmit = new FormData();

    // inserisco i dati del form storati nella variabile di hook createData
    formDataToSubmit.append("title", createData.title);
    createData.image = e.target.files[0];
    formDataToSubmit.append("image", createData.image);
    formDataToSubmit.append("description", createData.description);
    formDataToSubmit.append("visible", createData.visible.toString()); // Convert boolean to string
    const categoryIds = createData.categories.map((cat) => parseInt(cat)); // Converte in numeri interi
    console.log(categoryIds);
    categoryIds.forEach((category, index) => {
      console.log(`categories[${index}]`, category);
      formDataToSubmit.append(`categories[${index}]`, category);
    });
    console.log(createData);
    try {
      console.log(formDataToSubmit);
      // effettuo la call di update
      const response = await axios.put(
        `${apiUrl}/photos/${photo.slug}`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // ritorno alla modalità details
      if (response.status < 400) {
        navigate(`/photos`);
      }
    } catch (error) {
      console.error(
        "Errore:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="p-4 w-75">
      <form onSubmit={createPhoto}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Titolo
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={createData.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Immagine
          </label>
          <input
            type="file"
            onChange={(e) => handleField("image", e.target.files[0])}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Descrizione
          </label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={createData.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Pubblicata</label>
          <div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="visible"
                id="visibleTrue"
                value="true"
                checked={createData.visible === true}
                onChange={() => handleFieldChange("visible", true)}
                required
              />
              <label className="form-check-label" htmlFor="visibleTrue">
                Sì
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="visible"
                id="visibleFalse"
                value="false"
                checked={createData.visible === false}
                onChange={() => handleFieldChange("visible", false)}
                required
              />
              <label className="form-check-label" htmlFor="visibleFalse">
                No
              </label>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Categorie</label>
          <div>
            {categoriesData.map((category) => (
              <div className="form-check" key={category.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`category-${category.id}`}
                  value={category.id}
                  checked={createData.categories.includes(category.id)}
                  onChange={() => handleCheckboxChange(category.id)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`category-${category.id}`}
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary me-3 ">
          Crea
        </button>
      </form>
    </div>
  );
}

export default CreatePhotoForm;