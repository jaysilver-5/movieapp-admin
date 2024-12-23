import React, { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

interface Episode {
  season: string;
  episode: string;
  title: string;
}

const EpisodeSeasonForm: React.FC = () => {
  // State Variables
  const [step, setStep] = useState<number>(1); // Current form step
  const [se, setSe] = useState<string>(""); // Season number
  const [ep, setEp] = useState<string>(""); // Episode number
  const [seriesTitle, setSeriesTitle] = useState<string>(""); // Series title
  const [downloadLink, setDownloadLink] = useState<string>(""); // Current download link
  const [downloadLinks, setDownloadLinks] = useState<string[]>([]); // List of download links
  const [newEpisodeTitle, setNewEpisodeTitle] = useState<string>(""); // Title for new episode
  const [episodes, setEpisodes] = useState<Episode[]>([]); // List of episodes

  // Handle Add Download Link
  const handleAddDownloadLink = (): void => {
    if (downloadLink.trim() !== "") {
      setDownloadLinks([...downloadLinks, downloadLink.trim()]);
      setDownloadLink("");
    }
  };

  // Handle Remove Download Link
  const handleRemoveDownloadLink = (linkToRemove: string): void => {
    setDownloadLinks(downloadLinks.filter((link) => link !== linkToRemove));
  };

  // Handle Add Episode
  const handleAddEpisode = (): void => {
    if (se && ep && newEpisodeTitle.trim() !== "") {
      const newEpisode: Episode = {
        season: se,
        episode: ep,
        title: newEpisodeTitle.trim(),
      };
      setEpisodes([...episodes, newEpisode]);
      setNewEpisodeTitle("");
      setSe(""); // Reset season input
      setEp(""); // Reset episode input
    }
  };

  // Handle Remove Episode
  const handleRemoveEpisode = (indexToRemove: number): void => {
    setEpisodes(episodes.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      {step === 1 && (
        <div className="flex flex-col">
          {/* Input for Season and Episode */}
          <div className="flex w-full sm:gap-x-2 gap-x-4">
            <div className="flex-col flex gap-4 sm:flex-row sm:gap-2">
              <div>
                <label className="px-1 text-[12px] text-gray-600">Season</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Season"
                  value={se}
                  onChange={(e) => setSe(e.target.value)}
                />
              </div>
              <div>
                <label className="px-1 text-[12px] text-gray-600">Episode</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Episode"
                  value={ep}
                  onChange={(e) => setEp(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Input for Series Title */}
          <div className="flex w-full sm:gap-x-2 gap-x-4">
            <div>
              <label className="px-1 text-[12px] text-gray-600">Series Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Series Title"
                value={seriesTitle}
                onChange={(e) => setSeriesTitle(e.target.value)}
              />
            </div>
          </div>

          {/* Input for Download Link */}
          <div className="relative -top-4">
            <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white">
              Download Link
            </label>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Add a download link"
                value={downloadLink}
                onChange={(e) => setDownloadLink(e.target.value)}
              />
              <button
                type="button"
                className="px-2 py-2 bg-green-600 text-white rounded-full hover:bg-green-600"
                onClick={handleAddDownloadLink}
              >
                <IoMdAdd className="text-[20px] font-bold text-white" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {downloadLinks.map((link, index) => (
                <span
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                >
                  {link}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveDownloadLink(link)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Episode and Season Management */}
          <div className="relative -top-4">
            <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white">
              Episodes and Seasons
            </label>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Add a title"
                value={newEpisodeTitle}
                onChange={(e) => setNewEpisodeTitle(e.target.value)}
              />
              <button
                type="button"
                className="px-2 py-2 bg-green-600 text-white rounded-full hover:bg-green-600"
                onClick={handleAddEpisode}
              >
                <IoMdAdd className="text-[20px] font-bold text-white" />
              </button>
            </div>
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
        </div>
      )}
    </div>
  );
};

export default EpisodeSeasonForm;
