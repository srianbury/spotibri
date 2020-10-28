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

const Player = () => {
  const { previewUrl } = useContext(PlayerContext);

  const playerRef = useCallback(
    player => {
      if (player) {
        player.src = previewUrl;
        player.play();
      }
    },
    [previewUrl]
  );

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        backgroundColor: "red",
        color: "white",
        textAlign: "center",
      }}
    >
      <audio ref={playerRef} controls>
        <source src={previewUrl} type="audio/mpeg" />
        <track kind="captions" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export { PlayerProvider, PlayerContext, Player };
