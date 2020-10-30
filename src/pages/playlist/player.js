import React, { useState, createContext, useContext, useCallback } from "react";

const PlayerContext = createContext(null);

const PlayerProvider = ({ children }) => {
  const [preview, setPreview] = useState({
    url: null,
    playing: false,
    name: null,
    artists: [],
    album: null,
    img: null,
  });

  function handlePlay(track) {
    if (preview.url === track.preview_url) {
      setPreview(cur => {
        const { playing } = cur;
        return { ...cur, playing: !playing };
      });
    } else {
      setPreview({
        url: track.preview_url,
        playing: true,
        name: track.name,
        artists: track.artists,
        album: track.album.name,
        img: track.album.images[0].url,
      });
    }
  }

  function playPause(playState) {
    setPreview(cur => ({ ...cur, playing: playState }));
  }

  function getPlayText(previewUrl) {
    if (preview.url === previewUrl) {
      if (preview.playing) {
        return <PauseIcon />; // "Pause";
      } else {
        return <PlayIcon />; // "Resume";
      }
    }
    return <PlayIcon />; // "Play";
  }

  return (
    <PlayerContext.Provider
      value={{
        preview,
        handlePlay,
        getPlayText,
        playPause,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

const PlayerContainer = () => {
  const playerContext = useContext(PlayerContext);

  const playerRef = useCallback(
    node => {
      if (node) {
        if (node.src !== playerContext.preview.url) {
          node.src = playerContext.preview.url;
          node.addEventListener("play", e => {
            playerContext.playPause(true);
          });
          node.addEventListener("pause", e => {
            playerContext.playPause(false);
          });
        }
        if (playerContext.preview.playing) {
          node.play();
        } else {
          node.pause();
        }
      }
    },
    [playerContext]
  );

  return (
    <PlayerView
      playerRef={playerRef}
      preview={playerContext ? playerContext.preview : null}
    />
  );
};

const PlayerView = ({ playerRef, preview }) => (
  <div
    className="fixed-bottom navbar-dark bg-dark d-flex align-items-center"
    style={{ height: "100px" }}
  >
    <div className="container">
      <div
        className="row d-flex justify-content-center"
        style={{ color: "#fff" }}
      >
        {preview.url ? (
          <img
            src={preview.img}
            alt={preview.name}
            height="50px"
            width="50px"
          />
        ) : null}
        <audio ref={playerRef} controls className="ml-2">
          <source src={preview.url} type="audio/mpeg" />
          <track kind="captions" />
          Your browser does not support the audio element.
        </audio>
      </div>
      {preview.artists.length > 0 || preview.name ? (
        <div
          className="row d-flex justify-content-center"
          style={{ color: "#fff" }}
        >
          {`Name: ${preview.name}, ${
            preview.artists.length > 1 ? "Artists" : "Artist"
          }: ${preview.artists.map(({ name }) => name).join(", ")}
        `}
        </div>
      ) : null}
    </div>
  </div>
);

const PlayIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    class="bi bi-play-fill"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
  </svg>
);

const PauseIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    class="bi bi-pause-fill"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
  </svg>
);

const NoOp = () => {
  return null;
};

export default NoOp;
export { PlayerProvider, PlayerContext, PlayerContainer as Player };
