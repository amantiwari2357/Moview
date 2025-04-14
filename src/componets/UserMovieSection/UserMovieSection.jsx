import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MoviePopUp from "../PopUp/MoviePopUp";
import { imageUrl2, API_KEY } from "../../Constants/Constance";
import useUpdateMylist from "../../CustomHooks/useUpdateMylist";
import usePlayMovie from "../../CustomHooks/usePlayMovie";
import useUpdateWatchedMovies from "../../CustomHooks/useUpdateWatchedMovies";
import useUpdateLikedMovies from "../../CustomHooks/useUpdateLikedMovies";
import useGenereConverter from "../../CustomHooks/useGenereConverter";
import { db } from "../../Firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../../Context/UserContext";
import { PopUpContext } from "../../Context/moviePopUpContext";
import axios from "../../axios";
import StarRatings from "react-star-ratings";
import { ClipLoader } from "react-spinners";

function UserMovieSection(props) {
  const { User } = useContext(AuthContext);
  const { showModal, setShowModal } = useContext(PopUpContext);

  const { addToMyList, removeFromMyList, PopupMessage } = useUpdateMylist();
  const { removeFromWatchedMovies, removePopupMessage } =
    useUpdateWatchedMovies();
  const { addToLikedMovies, removeFromLikedMovies, LikedMoviePopupMessage } =
    useUpdateLikedMovies();
  const { playMovie } = usePlayMovie();
  const { convertGenere } = useGenereConverter();

  const [myMovies, setMyMovies] = useState([]);
  const [moviePopupInfo, setMoviePopupInfo] = useState({});
  const [title, setTitle] = useState("");
  const [isResultEmpty, setIsResultEmpty] = useState(false);

  const navigate = useNavigate();

  function getMovies() {
    getDoc(doc(db, props.from, User.uid)).then((result) => {
      const mv = result.data();
      setMyMovies(mv.movies);
      if (mv.movies.length === 0) {
        setIsResultEmpty(true);
      }
    });
  }

  useEffect(() => {
    getMovies();
    if (props.from === "MyList") {
      setTitle("Movies in My List");
    } else if (props.from === "WatchedMovies") {
      setTitle("Watched Movies");
    } else if (props.from === "LikedMovies") {
      setTitle("Movies you Liked");
    }
  }, [User.uid, props.from]);

  const removeMovie = (movie) => {
    if (props.from === "MyList") {
      removeFromMyList(movie);
    } else if (props.from === "WatchedMovies") {
      removeFromWatchedMovies(movie);
    } else if (props.from === "LikedMovies") {
      removeFromLikedMovies(movie);
    }
    getMovies();
  };

  const handleMoviePopup = (movieInfo) => {
    setMoviePopupInfo(movieInfo);
    setShowModal(true);
  };

  return (
    <div>
      {PopupMessage}

      <div className="flex justify-center">
        <h1 className="text-white pt-20 pb-6 text-5xl w-11/12 leading-snug text-center">
          {!isResultEmpty ? title : null}
        </h1>
      </div>

      <div className="grid-cols-2 grid p-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 md:p-5 space-y-1 lg:space-y-0 lg:grid lg:gap-3 lg:grid-rows-3">
        {myMovies.length !== 0 ? (
          myMovies
            .slice(0)
            .reverse()
            .map((movie) => {
              let converted;
              if (movie.genre_ids) {
                converted = convertGenere(movie.genre_ids);
              }
              return (
                <div className="p-1 mt-2 mb-5" key={movie.id}>
                  <div
                    className="hover:border-2 hover:scale-105 group relative block overflow-hidden rounded-sm transition-all duration-500"
                    onClick={() => handleMoviePopup(movie)}
                  >
                    <img
                      onClick={() => handleMoviePopup(movie)}
                      className=""
                      src={imageUrl2 + movie.backdrop_path}
                      alt={movie.title || movie.name}
                    />
                    <div
                      style={{
                        background:
                          "linear-gradient(0deg, hsl(0deg 0% 4% / 92%) 0%, hsl(0deg 0% 0% / 50%) 35%, hsl(220deg 26% 44% / 0%) 100%)",
                      }}
                      className="hidden xl:block absolute -bottom-52 group-hover:bottom-0 w-full transition-all duration-500 p-4 rounded"
                    >
                      <div className="flex mb-1 transition ease-in-out delay-150">
                        {/* Play Button */}
                        <div
                          onClick={() => playMovie(movie, props.from)}
                          className="text-white w-10 h-10 2xl:w-14 2xl:h-14 border-[2px] 2xl:border-[3px] rounded-full p-2 mr-2 backdrop-blur-[1px] shadow-md ease-linear transition-all duration-150 hover:border-red-600 hover:text-red-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                            />
                          </svg>
                        </div>

                        {/* Like or Dislike Button */}
                        {props.from === "LikedMovies" ? (
                          <div
                            onClick={() => removeMovie(movie)}
                            className="text-white w-10 h-10 2xl:w-14 2xl:h-14 border-[2px] 2xl:border-[3px] rounded-full p-2 mr-2 backdrop-blur-[1px] shadow-md ease-linear transition-all duration-150 hover:border-red-600 hover:text-red-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div
                            onClick={() => addToLikedMovies(movie)}
                            className="text-white w-10 h-10 2xl:w-14 2xl:h-14 border-[2px] 2xl:border-[3px] rounded-full p-2 mr-2 backdrop-blur-[1px] shadow-md ease-linear transition-all duration-150 hover:border-red-600 hover:text-red-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 00-.75-.75h-.384c-.807 0-1.535.442-2.032 1.08a9.041 9.041 0 00-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672v3.56c.333.76.93 1.333 1.653 1.715a9.04 9.04 0 002.86 2.4c.498.634 1.226 1.08 2.032 1.08h.384"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Movie Rating */}
                      <div className="flex justify-between items-center text-white">
                        <span className="font-bold text-md">
                          {movie.title || movie.name}
                        </span>
                        <div>
                          <StarRatings
                            rating={movie.vote_average / 2}
                            starRatedColor="yellow"
                            starEmptyColor="white"
                            numberOfStars={5}
                            starDimension="15px"
                            starSpacing="2px"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="flex justify-center items-center">
            <ClipLoader color="#ffffff" loading={true} size={50} />
          </div>
        )}
      </div>

      {showModal && (
        <MoviePopUp
          movie={moviePopupInfo}
          setShowModal={setShowModal}
          from={props.from}
        />
      )}

      {LikedMoviePopupMessage}
    </div>
  );
}

export default UserMovieSection;
