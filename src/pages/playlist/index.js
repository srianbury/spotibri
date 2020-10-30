import React, { useState, useEffect, useContext } from "react";
import Layout from "../../components/layout";
import { useQueryParam } from "use-query-params";
import AuthenticationContext from "../../components/authenticationContext";
import requiresAuthentication from "../../components/requiresAuthentication";
import withErrorAndLoading from "../../components/withErrorAndLoading";
import { PlayerProvider, Player, PlayerContext } from "./player";

async function checkIfContains(track, url, searchString) {
  const response = await fetch(url);
  const result = await response.json();
  if (result.soup.includes(searchString)) {
    return track.id;
  }
  return null;
}

async function findMatches(tracks, searchTerm) {
  // https://www.google.com/search?q=alaska+by+maggie+rogers+lyrics
  let promises = [];

  tracks.forEach(({ track }) => {
    const { name } = track;
    const artists = track.artists.map(artist => artist.name).join(" and ");
    const search = `https://beautyrest.herokuapp.com/v1/soup?url=https://www.google.com/search?q=${name} by ${artists} lyrics`;
    promises = [...promises, checkIfContains(track, search, searchTerm)];
  });

  const searchResults = await Promise.all(promises);
  return searchResults.filter(node => node !== null);
}

async function fetchAll(accessToken, url) {
  let allTracks = [];
  while (url) {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json();
    const tracks = result.items;
    allTracks.push(...tracks);
    url = result.next;
  }
  return allTracks;
}

const PlaylistContainer = () => {
  const auth = useContext(AuthenticationContext);
  const playlistId = useQueryParam("id")[0];
  const [playlistData, setPlaylistData] = useState(null);
  const [matches, setMatches] = useState(null);
  const [matchesOnly, setMatchesOnly] = useState(false);

  async function _findMatches(tracks, searchTerm, cb) {
    const results = await findMatches(tracks, searchTerm);
    setMatches(results);
    cb();
  }

  useEffect(() => {
    async function read() {
      const allTracks = await fetchAll(
        auth.user.access_token,
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=from_token&fields=next,items(track(id%2Cname%2Cartists.name%2Cpreview_url%2Calbum(name%2Cimages)))&limit=100&offset=0`
      );
      setPlaylistData(allTracks);
    }
    read();
  }, [auth.user.access_token, playlistId]);

  return (
    <>
      <PlayerProvider>
        <Layout title="Lyric Looker Upper">
          <PlaylistView
            error={null}
            loading={playlistData === null}
            _findMatches={_findMatches}
            matches={matches}
            playlistData={playlistData}
            matchesOnly={matchesOnly}
            setMatchesOnly={setMatchesOnly}
          />
        </Layout>
        <Player />
      </PlayerProvider>
    </>
  );
};

const PlaylistViewBase = ({
  _findMatches,
  matches,
  playlistData,
  matchesOnly,
  setMatchesOnly,
}) => (
  <div style={{ marginBottom: "105px" }}>
    <LyricLookerUpperContainer
      handleSearch={(searchTerm, cb) =>
        _findMatches(playlistData, searchTerm, cb)
      }
    />
    <PlaylistDetailsContainer
      tracks={
        matches && matchesOnly
          ? playlistData.filter(({ track }) => matches.includes(track.id))
          : playlistData
      }
      matches={matches}
      matchesOnly={matchesOnly}
      setMatchesOnly={setMatchesOnly}
    />
  </div>
);
const PlaylistView = withErrorAndLoading(PlaylistViewBase);

const LyricLookerUpperContainer = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  function handleClick() {
    setSearching(true);
    handleSearch(searchTerm, () => {
      setSearching(false);
    });
  }

  return (
    <LyricLookerUpperView
      searching={searching}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      handleClick={handleClick}
    />
  );
};

const LyricLookerUpperView = ({
  searching,
  searchTerm,
  setSearchTerm,
  handleClick,
}) => (
  <div>
    <div>
      <form>
        <div className="form-group">
          <label htmlFor="lyric-search" className="mb-0">
            Search
          </label>
          <div className="input-group">
            <input
              disabled={searching}
              name="lyric-search"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="form-control"
            />
            <div className="input-group-append">
              <button
                className="btn btn-success"
                type="submit"
                onClick={handleClick}
                disabled={searching}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </form>
      {searching ? <p>This will take a moment</p> : null}
    </div>
  </div>
);

const PlaylistDetailsContainer = ({
  tracks,
  matches,
  matchesOnly,
  setMatchesOnly,
}) => {
  return (
    <PlaylistDetailsView
      matchesOnly={matchesOnly}
      matches={matches}
      setMatchesOnly={setMatchesOnly}
      tracks={tracks}
    />
  );
};

const PlaylistDetailsView = ({
  matchesOnly,
  matches,
  setMatchesOnly,
  tracks,
}) => (
  <div>
    <div>
      <input
        name="matches-only"
        type="checkbox"
        checked={matchesOnly}
        disabled={!matches}
        onChange={() => setMatchesOnly(prev => !prev)}
      />
      <label htmlFor="matches-only" className="pl-1">
        Show matches only
      </label>
      {matches ? <NumMatchesView num={matches.length} /> : null}
    </div>
    <table className="table table-sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Play</th>
          <th>Title</th>
          <th>Artist(s)</th>
          <th>Album</th>
        </tr>
      </thead>
      <tbody>
        {tracks.map(({ track }, index) => (
          <tr key={track.id}>
            <TdMiddle width="2">{index + 1}</TdMiddle>
            <TdMiddle width="2">
              <PreviewButton track={track} />
            </TdMiddle>
            <TdMiddle width="32">
              <div className="container row">
                <div className="col-2 d-flex flex-wrap align-content-center pl-0">
                  <img
                    src={track.album.images[0].url}
                    alt={track.album.name}
                    height="40px"
                    width="40px"
                  />
                </div>
                <div className="col-10 col-10 d-flex flex-wrap align-content-center pl-1">
                  <div>{track.name}</div>
                </div>
              </div>
            </TdMiddle>
            <TdMiddle width="32">
              {track.artists.map(artist => artist.name).join(", ")}
            </TdMiddle>
            <TdMiddle width="32">{track.album.name}</TdMiddle>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TdMiddle = ({ width, children }) => (
  <td style={{ verticalAlign: "middle", width: `${width}%` }}>{children}</td>
);

const PreviewButton = ({ track }) => {
  const { handlePlay, getPlayText } = useContext(PlayerContext);
  return (
    <button
      type="button"
      onClick={track.preview_url ? () => handlePlay(track) : () => {}}
      disabled={!track.preview_url}
      className="btn btn-sm d-flex flex-wrap align-content-center"
      style={{ backgroundColor: "#1DB954", color: "#fff" }}
    >
      {getPlayText(track.preview_url)}
    </button>
  );
};

/*
<div key={track.id}>
  <div>
    <div>
      <hr />
      <div>{index + 1}.</div>
      <div>Name: {track.name}</div>
      <div>
        Artists: {track.artists.map(artist => artist.name).join(", ")}
      </div>
      <div>Album: {track.album.name}</div>
      <div>
        Match:{" "}
        {matches
          ? matches.includes(track.id)
            ? "YESSS"
            : "no :("
          : "N/A"}
      </div>
      <div>
        <img
          src={track.album.images[0].url}
          alt={track.album.name}
          height="100"
        />
      </div>
      {track.preview_url ? (
        <button
          type="button"
          onClick={() => setPreview(track.preview_url)}
        >
          Preview
        </button>
      ) : null}
    </div>
  </div>
</div>
*/

const NumMatchesView = ({ num }) => {
  if (num === 0) {
    return <div>No matches :( try adjusting your search.</div>;
  }

  if (num === 1) {
    return <div>{num} match.</div>;
  }

  return <div>{num} matches.</div>;
};

export default requiresAuthentication(PlaylistContainer);
