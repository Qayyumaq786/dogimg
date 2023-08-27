import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [subBreeds, setSubBreeds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [customSearchOpen, setCustomSearchOpen] = useState(false);
  const [customSearchBreed, setCustomSearchBreed] = useState("");
  const [customSearchCount, setCustomSearchCount] = useState(3);
  const [customSearchImages, setCustomSearchImages] = useState([]);
  const [breedWithImg, setBreedWithIMg] = useState([]);

  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      const response = await fetch("https://dog.ceo/api/breeds/list/all");
      const data = await response.json();
      const breedsData = Object.keys(data.message);
      setBreedWithIMg([]);

      breedsData.forEach(async (name) => {
        let res = await fetch(
          `https://dog.ceo/api/breed/${name}/images/random`
        );
        let dt = await res.json();
        // arr.push({ name: name, img: dt.message });
        setBreedWithIMg((prev) => {
          return [...prev, { name: name, img: dt.message }];
        });
      });

      setBreeds(breedsData);
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }
  };

  const fetchSubBreeds = async (breed) => {
    try {
      const response = await fetch(`https://dog.ceo/api/breed/${breed}/list`);
      const data = await response.json();
      const subBreedsData = data.message;
      setSubBreeds(subBreedsData);
    } catch (error) {
      console.error("Error fetching sub-breeds:", error);
    }
  };

  const fetchMoreImages = async (breed) => {
    try {
      const response = await fetch(
        `https://dog.ceo/api/breed/${breed}/images/random/3`
      );
      const data = await response.json();
      const moreImagesData = data.message;
      return moreImagesData;
    } catch (error) {
      console.error("Error fetching more images:", error);
      return [];
    }
  };

  const fetchCustomSearchImages = async () => {
    try {
      const response = await fetch(
        `https://dog.ceo/api/breed/${customSearchBreed}/images/random/${customSearchCount}`
      );
      const data = await response.json();
      const imagesData = data.message;
      setCustomSearchImages(imagesData);
    } catch (error) {
      console.error("Error fetching custom search images:", error);
    }
  };

  const openModal = async (breed) => {
    setSelectedBreed(breed);
    await fetchSubBreeds(breed);
    const moreImagesData = await fetchMoreImages(breed);
    setCustomSearchImages(moreImagesData);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openCustomSearchModal = () => {
    setCustomSearchOpen(true);
  };

  const closeCustomSearchModal = () => {
    setCustomSearchOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dog Gallery</h1>
        <button onClick={openCustomSearchModal}>Custom Search</button>
      </header>
      <div className="breeds-list">
        <h2>All Breeds</h2>
        <div className="cardParent" >
          {breedWithImg.map((breed) => (
            <div className="card" style={{width: "18rem"}}  key={breed.name} onClick={() => openModal(breed.name)}>
              <img src={breed.img} className="card-img-top" alt="retry" />
              <div className="card-body">
                <h3 className="card-text">
                {breed.name}
                </h3>
              </div>
            </div>
            ))}
           
        </div>
      </div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedBreed}</h2>
            <div className="sub-breeds">
              {subBreeds.length > 0 && (
                <div>
                  <h3>Sub-Breeds</h3>
                  <ul>
                    {subBreeds.map((subBreed) => (
                      <li key={subBreed}>{subBreed}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="more-images">
              <h3>More Images</h3>
              <ul>
                {customSearchImages.map((image, index) => (
                  <li key={index}>
                    <img src={image} alt={`${selectedBreed}-${index}`} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {customSearchOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeCustomSearchModal}>
              &times;
            </span>
            <h2>Custom Search</h2>
            <div className="custom-search-form">
              <label>Select Breed:</label>
              <select
                value={customSearchBreed}
                onChange={(e) => setCustomSearchBreed(e.target.value)}
              >
                <option value="">Select a breed</option>
                {breeds.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>
              <label>Number of Images:</label>
              <input
                type="number"
                value={customSearchCount}
                onChange={(e) => setCustomSearchCount(e.target.value)}
              />
              <button onClick={fetchCustomSearchImages}>Get Images</button>
            </div>
            <div className="custom-search-images">
              {customSearchImages.length > 0 && (
                <div>
                  <h3>
                    Showing {customSearchCount} images of {customSearchBreed}
                  </h3>
                  <ul>
                    {customSearchImages.map((image, index) => (
                      <li key={index}>
                        <img
                          src={image}
                          alt={`${customSearchBreed}-${index}`}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
