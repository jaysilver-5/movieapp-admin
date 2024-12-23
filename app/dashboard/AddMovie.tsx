import React, { useState } from "react";
import { db } from "../../firebase/firebase"; // Import Firestore initialization
import { collection, addDoc } from "firebase/firestore";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineFullscreen, MdOutlineChevronLeft } from "react-icons/md";
import TitleInput from "../components/AddMovie/TitleInput";
import SeriesToggle from "../components/AddMovie/SeriesToggle";
import { handleFill, handleSeries, handleRemoveCategory } from "../../hooks/addmovie";
import SeasonsSelect from "../components/AddMovie/SeasonsSelect";
import EpisodeSelect from "../components/AddMovie/EpisodeSelect";
import SynopsisInput from "../components/AddMovie/SynopsisInput";
import Se from "../components/AddMovie/Se";
import Ep from "../components/AddMovie/Ep";
import EpisodeLink from "../components/AddMovie/EpisodeLink";
import EpisodeTitle from "../components/AddMovie/EpisodeTitle";

interface Episode {
  season: string;       // Season number
  episode: string;      // Episode number
  title: string;        // Title for the episode
  downloadLink: string; // Single download link
}

interface Series {
  title: string;
  episodes: Episode[];
}

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
  const [step, setStep] = useState<number>(0);
  const [se, setSe] = useState<string>(""); // Season number
  const [ep, setEp] = useState<string>(""); // Episode number
  const [newEpisodeTitle, setNewEpisodeTitle] = useState<string>(""); // Title for new episode
  const [downloadLinks, setDownloadLinks] = useState<string>(""); // List of download links
  const [seriesTitle, setSeriesTitle] = useState<string>("");
  const [downloadLink, setDownloadLink] = useState<string>(""); // Single download link
  const [episodes, setEpisodes] = useState<Episode[]>([]); // List of episodes
  const [seriesData, setSeriesData] = useState<Series[]>([]); // Final list of series with all seasons and episodes

  console.log(episodes)


  const handleRemoveEpisode = (indexToRemove: number): void => {
    setEpisodes(episodes.filter((_, index) => index !== indexToRemove));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const resetInputs = () => {
    setTitle("");
    setTrailerUrl("");
    setPosterUrl("");
    setBannerUrl("");
    setSynopsis("");
    setReleaseDate("");
    setCategories([]);
    setFill(false);
    setSeriesData([]);
    setEpisodes([]);
    setSeriesTitle("");
    setSe("");
    setEp("");
    setNewEpisodeTitle("");
    setDownloadLink("");
  };

  // const handleSubmit = async () => {
  //   try {
  //     const moviesCollection = collection(db, "movies");
  
  //     // Prepare the data to save
  //     const dataToSave = series
  //       ? {
  //           title,
  //           trailerUrl,
  //           posterUrl,
  //           bannerUrl,
  //           synopsis,
  //           releaseDate,
  //           categories,
  //           series: true,
  //           episodes: episodes.map((ep) => ({
  //             season: ep.season,
  //             episode: ep.episode,
  //             title: ep.title,
  //             downloadLink: ep.downloadLink,
  //           })),
  //         }
  //       : {
  //           title,
  //           trailerUrl,
  //           downloadUrl,
  //           posterUrl,
  //           bannerUrl,
  //           synopsis,
  //           releaseDate,
  //           categories,
  //           series: false,
  //         };


  //         console.log(dataToSave)
  
  //     // Log the raw and structured data for debugging
  //     console.log("Raw Data:", { title, episodes });
  //     console.log("Structured Data to Save:", JSON.stringify(dataToSave, null, 2));
  
  //     // Push the data to Firestore
  //     await addDoc(moviesCollection, dataToSave);
  
  //     // Provide feedback to the user
  //     setMessage("Submitted successfully!");
  //     console.log("Data submitted successfully");
  
  //     // Reset inputs
  //     resetInputs();
  //   } catch (error) {
  //     console.error("Error saving data:", error);
  //   }
  // };
  
  const handleSubmit = async () => {
    try {
      const moviesCollection = collection(db, "movies");
  
      // Prepare the data to save
      const dataToSave = series
        ? {
            title,
            trailerUrl,
            posterUrl,
            bannerUrl,
            synopsis,
            releaseDate,
            categories,
            series: true,
            episodes: episodes.map((ep) => ({
              season: ep.season,
              episode: ep.episode,
              title: ep.title,
              downloadLink: ep.downloadLink,
            })),
          }
        : {
            title,
            trailerUrl,
            downloadUrl,
            posterUrl,
            bannerUrl,
            synopsis,
            releaseDate,
            categories,
            series: false,
          };
  
      console.log("Raw Data:", { title, episodes });
      console.log("Structured Data to Save:", JSON.stringify(dataToSave, null, 2));
  
      // Push the data to Firestore
      await addDoc(moviesCollection, dataToSave);
  
      // Provide feedback to the user
      setMessage("Submitted successfully!");
      console.log("Data submitted successfully");
  
      // Reset inputs
      resetInputs();
  
      // Set success message timeout and reset step
      setTimeout(() => {
        setMessage("");
        setStep(0);
      }, 3000); // Message disappears after 3 seconds
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  

  const handleAddEpisode = (): void => {
    if (se && ep && newEpisodeTitle && downloadLink) {
      const newEpisode: Episode = {
        season: se,
        episode: ep,
        title: newEpisodeTitle,
        downloadLink,
      };
      setEpisodes([...episodes, newEpisode]);
      setSe("");
      setEp("");
      setNewEpisodeTitle("");
      setDownloadLink("");
    }
  };


  const handleNextOrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (series && step === 0) {
      setStep(1);
    } else if (!series) {
      await handleSubmit();
    } else {
      handleSubmit()
    }
  };

  return (
    <div className="overflow-y-auto flex items-center justify-center py-6 px-4 bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 rounded-[20px] shadow-md relative">
        <h1 className="text-xl font-semibold mb-6 text-center">{step == 0 ? 'Add Movie' : 'Add Series'}</h1>
        {step == 1 && <div onClick={() => setStep(0)} className="absolute top-4 left-4 w-10 sm:w-6 sm:h-6 h-10 bg-[#d7d7d7] flex items-center justify-center rounded-full">
          <MdOutlineChevronLeft className="text-[32px] font-thin text-[#585656]"/>
        </div>}
        <form  onSubmit={handleNextOrSubmit} className="-space-y-2">
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

          {step === 1 && (
            <div>
            <div className="flex flex-col">
              {/* Input for Season, Episode, and Episode Title */}
              <div className="sm:flex gap-x-2">
                <div className="flex flex-1 gap-x-2">
                  <Se se={se} setSe={setSe}/>
                  <Ep ep={ep} setEp={setEp}/>
                </div>

                <EpisodeTitle newEpisodeTitle={newEpisodeTitle} setNewEpisodeTitle={setNewEpisodeTitle} />
              </div>
              {/* Input for Download Link */}

              <EpisodeLink downloadLink={downloadLink} setDownloadLink={setDownloadLink} handleAddEpisode={handleAddEpisode} />
      
              {/* Episodes List */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {episodes.map((episode, index) => (
                    <span
                      key={index}
                      className="flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full"
                    >
                      {`S${episode.season}:E${episode.episode} - ${episode.title}`}
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveEpisode(index)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
      
              {/* Series Data */}
              {seriesData.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-2">All Series:</h3>
                  {seriesData.map((series, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="text-md font-bold">{series.title}</h4>
                      <ul className="list-disc list-inside">
                        {series.episodes.map((ep, idx) => (
                          <li key={idx}>
                            {`S${ep.season}:E${ep.episode} - ${ep.title} (${ep.downloadLink.length} links)`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Submit Button */}
          {/* {series ? <button
            onClick={() =>setStep(1)}
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
          </button>} */}

          <button type="submit">{step === 0 ? "Next" : "Submit"}</button>

          {message && <p className="text-center mt-4 text-sm text-green-600">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
