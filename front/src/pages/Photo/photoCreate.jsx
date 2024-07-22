import { Link, useNavigate } from "react-router-dom";
import CreatePhotoForm from "../../assets/components/Form/CreatePhotoForm";
import { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_API_URL;

const PhotoCreate = () => {

  const navigate = useNavigate();

  // importo le categories per il form
  const [categories, setCategories] = useState(null);

  // funzione per richiedere dal backend le categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(apiUrl + `/categories/`);
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (categories === null) {
      fetchCategories();
    }
  }, []);

  

  return (
    <>
      <div>
        <Link to="../" relative="path">
          Back to the Main page
        </Link>
        <CreatePhotoForm
          categoriesData={categories}
        />
      </div>
    </>
  );
};

export default PhotoCreate;
