import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BASE_API_URL;

// componente form per la chiamata di update che gestirò nella PhotoShow
// importo direttamente photo come prop placeholder
const FormComponent = ({ photo, categoriesData, setPhoto, setUpdateMode, backToPage }) => {
  // creo una var hook per raccogliere tutti i dati dal form
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    visible: false,
    categories: [],
  });

  const navigate = useNavigate();

  // vincolo l'aggiornamento dei dati di editData in un secondo momento
  // ovvero dopo aver terminato la chiamate api axios, in questo modo evito che
  // in caso la componente venga montata prima del caricamento dei dati, risultando vuota
  useEffect(() => {
    if (photo && categoriesData) {
      setEditData({
        title: photo.title,
        description: photo.description,
        visible: photo.visible,
        categories: photo.categories.map((cat) => cat.id),
      });
    }
  }, [photo, categoriesData]);

  // aggiorno il form in modo che disponga sempre i valori correnti
  // dell'elemento photo al momento dell'apertura dell'edit
  const handleFieldChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // funzione che regola il riempimento delle checkbox:
  // controllo che le checkbox delle categorie selezionate
  // per l'update non fossero già selezionate in precedenza
  // altrimenti le aggiungo all'array delle selezionate
  // dopodichè ritorno l'array precedente + le nuove categorie selezionate
  const handleCheckboxChange = (categoryId) => {
    setEditData((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories: newCategories };
    });
  };

  //  funzione per l'update della photo
  const editPhoto = async (e) => {
    e.preventDefault();
    console.log(editData);
    // creo una var con un nuovo elemento FormData(),
    // una classe nativa di js per storare elementi
    // che contengono un file (in questo caso l'img)
    // da inserire per la chiamata
    const formDataToSubmit = new FormData();
    // inserisco i dati del form storati nella variabile di hook editData
    formDataToSubmit.append("title", editData.title);
    formDataToSubmit.append("description", editData.description);
    formDataToSubmit.append("visible", editData.visible.toString()); // Convert boolean to string
    const categoryIds = editData.categories.map(cat => parseInt(cat)); // Converte in numeri interi
    console.log(categoryIds);
    categoryIds.forEach((category, index) => {
        console.log(`categories[${index}]`, category);
      formDataToSubmit.append(`categories[${index}]`, category);
    });
    console.log(editData);
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
      // aggiorno lo state della pagina altrimenti in caso di mutamento
      // dello slug o altro non avrebbe i dati per sapere quale pagina da caricare
      setPhoto(response.data);
      // ritorno alla modalità details
      if(response.status < 400){
        navigate(`/photos/${response.data.slug}`)
        }
    } catch (error) {
        console.error('Errore:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="p-4 w-75">
    <form onSubmit={editPhoto}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Titolo</label>
        <input
          type="text"
          className="form-control"
          id="title"
          value={editData.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Descrizione</label>
        <textarea
          className="form-control"
          id="description"
          rows="3"
          value={editData.description}
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
              checked={editData.visible === true}
              onChange={() => handleFieldChange("visible", true)}
              required
            />
            <label className="form-check-label" htmlFor="visibleTrue">Sì</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="visible"
              id="visibleFalse"
              value="false"
              checked={editData.visible === false}
              onChange={() => handleFieldChange("visible", false)}
              required
            />
            <label className="form-check-label" htmlFor="visibleFalse">No</label>
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
                checked={editData.categories.includes(category.id)}
                onChange={() => handleCheckboxChange(category.id)}
              />
              <label className="form-check-label" htmlFor={`category-${category.id}`}>
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <button type="submit" className="btn btn-primary me-3 ">Salva Modifiche</button>
      <button type="button" onClick={backToPage} className="btn btn-secondary">Indietro</button>
    </form>
  </div>
);
};

export default FormComponent;
