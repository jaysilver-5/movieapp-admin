import React, { useState } from "react";
import { db } from "../../firebase/firebase"; // Import Firestore initialization
import { collection, addDoc } from "firebase/firestore";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineFullscreen } from "react-icons/md";
import TitleInput from '../components/AddMovie/TitleInput'
import SeriesToggle from '../components/AddMovie/SeriesToggle'
import { handleFill, handleSeries, handleRemoveCategory } from '../../hooks/addmovie'
import SeasonsSelect from "../components/AddMovie/SeasonsSelect";
import EpisodeSelect from "../components/AddMovie/EpisodeSelect";
import SynopsisInput from "../components/AddMovie/SynopsisInput";
import { MdOutlineChevronLeft } from "react-icons/md";

const AddMovie: React.FC = () => {
  const [title, setTitle] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [season, setSeason] = useState("");
  const [episode, setEpisode] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [fill, setFill] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [series, setSeries] = useState(false);
  const [step, setStep] = useState<number>(1)

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const moviesCollection = collection(db, "movies");
      await addDoc(moviesCollection, {
        title,
        trailerUrl,
        posterUrl,
        downloadUrl,
        bannerUrl,
        season,
        episode,
        synopsis,
        releaseDate,
        fill,
        series,
        categories,
        createdAt: new Date(),
      });

      setMessage("Movie added successfully!");
      setTitle("");
      setTrailerUrl("");
      setPosterUrl("");
      setDownloadUrl("");
      setSeason("");
      setEpisode("");
      setSynopsis("");
      setReleaseDate("");
      setCategories([]);
      setFill(false);
    } catch (error) {
      console.error("Error adding movie: ", error);
      setMessage("Failed to add movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-y-auto flex items-center justify-center py-6 px-4 bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 rounded-[20px] shadow-md relative">
        <h1 className="text-xl font-semibold mb-6 text-center">{step == 0 ? 'Add Movie' : 'Add Download link'}</h1>
        {step == 1 && <div onClick={() => setStep(0)} className="absolute top-4 left-4 w-10 h-10 bg-[#d7d7d7] flex items-center justify-center rounded-full">
          <MdOutlineChevronLeft className="text-[32px] font-thin text-[#585656]"/>
        </div>}
        <form onSubmit={handleSubmit} className="-space-y-2">
          {step == 0 &&
          
        <div>
          <div className="flex items-center space-x-2 mb-3 w-full">
            <TitleInput title={title} setTitle={setTitle} series={series} handleSeries={handleSeries} setSeries={setSeries} />
            {/* <SeriesToggle series={series} handleSeries={() => handleSeries(series, setSeries)} /> */}
          </div>
          {/* Seasons and Episode */}
          {series &&
            <div className="relative -top-2 flex flex-col gap-2 sm:flex-row sm:gap-1">
              <SeasonsSelect season={season} setSeason={setSeason}/>
              <EpisodeSelect episode={episode} setEpisode={setEpisode} />
            </div>
          }

          {/* Release Date */}
          <div>
            <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white ">Release Date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200 mb-3"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
            />
          </div>

          <SynopsisInput synopsis={synopsis} setSynopsis={setSynopsis} />

          {/* Categories */}
          <div>
            <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white ">Genre</label>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Add a genre"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                type="button"
                className="px-2 py-2 bg-green-600 text-white rounded-full hover:bg-green-600"
                onClick={handleAddCategory}
              >
                <IoMdAdd className="text-[20px] font-bold text-white" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <span
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                >
                  {category}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveCategory(category, setCategories, categories)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white ">Banner URL</label>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                className=" w-full flex-grow px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Add a Banner URL"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
              />
              <button
                type="button"
                className={`px-2 py-2 text-white rounded-full ${fill ? 'bg-green-600' : 'border text-[#000]'} `}
                onClick={() => handleFill(fill, setFill)}
              >
                <MdOutlineFullscreen className={`text-[20px] font-bold ${fill ? 'text-[#fff]' : 'text-[#000]'} `} />
              </button>
            </div>
          </div>

          <div>
            <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white ">Poster URL</label>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                className=" w-full flex-grow px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Add a Poster URL"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Trailer, Poster, and Download URLs */}
          {["Trailer URL", "Download URL"].map((label, idx) => (
            <div key={idx}>
              <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white ">{label}</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                value={label === "Trailer URL" ? trailerUrl : label === "Poster URL" ? posterUrl : downloadUrl}
                onChange={(e) =>
                  label === "Trailer URL"
                    ? setTrailerUrl(e.target.value)
                    : label === "Poster URL"
                    ? setPosterUrl(e.target.value)
                    : setDownloadUrl(e.target.value)
                }
                required
              />
            </div>
          ))}

          <div className="h-12"></div>
          </div>}

          {step == 1 && 
            <div>
              
            </div>
          }

          {/* Submit Button */}
          {series ? <button
            className={`w-full px-4 py-2 text-black border border-gray-50 bg-[#f2efef] rounded-full hover:bg-blue-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            Next
          </button>
          :
          <button
            type="submit"
            className={`w-full px-4 py-2 rounded-full hover:bg-blue-700 text-white bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Add Movie"}
          </button>}

          {message && <p className="text-center mt-4 text-sm text-green-600">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
