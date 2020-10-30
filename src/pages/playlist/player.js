import React, { useState, createContext, useContext, useCallback } from "react";

const PlayerContext = createContext(null);

const PlayerProvider = ({ children }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  function setPreview(url) {
    setPreviewUrl(url);
  }

  return (
    <PlayerContext.Provider
      value={{
        previewUrl,
        setPreview,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

const PlayerContainer = () => {
  const playerContext = useContext(PlayerContext);

  const playerRef = useCallback(
    player => {
      if (player) {
        player.src = playerContext ? playerContext.previewUrl : null;
        player.play();
      }
    },
    [playerContext]
  );

  return (
    <PlayerView
      playerRef={playerRef}
      previewUrl={playerContext ? playerContext.previewUrl : null}
    />
  );
};

const PlayerView = ({ playerRef, previewUrl }) => (
  <div
    className="navbar fixed-bottom navbar-dark bg-dark d-flex justify-content-center"
    style={{ height: "70px" }}
  >
    <audio ref={playerRef} controls>
      <source src={previewUrl} type="audio/mpeg" />
      <track kind="captions" />
      Your browser does not support the audio element.
    </audio>
  </div>
);

export default PlayerContainer;
export { PlayerProvider, PlayerContext, PlayerContainer as Player };
