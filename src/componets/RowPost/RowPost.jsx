import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { imageUrl, imageUrl2, API_KEY } from "../../Constants/Constance";
import useUpdateMylist from "../../CustomHooks/useUpdateMylist";
import { motion, AnimatePresence } from "framer-motion";
import YouTube from "react-youtube";
import StarRatings from "react-star-ratings";
import usePlayMovie from "../../CustomHooks/usePlayMovie";
import useUpdateWatchedMovies from "../../CustomHooks/useUpdateWatchedMovies";
import useUpdateLikedMovies from "../../CustomHooks/useUpdateLikedMovies";
import useGenereConverter from "../../CustomHooks/useGenereConverter";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./RowPostStyles.scss";

function RowPost(props) {
    const { addToMyList, PopupMessage } = useUpdateMylist();
    const { playMovie } = usePlayMovie();
    const { removeFromWatchedMovies, removePopupMessage } = useUpdateWatchedMovies();
    const { addToLikedMovies, LikedMoviePopupMessage } = useUpdateLikedMovies();
    const { convertGenere } = useGenereConverter();

    const [movies, setMovies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [moviePopupInfo, setMoviePopupInfo] = useState({});
    const [shouldPop, setshouldPop] = useState(true);
    const [urlId, setUrlId] = useState("");

    useEffect(() => {
        if (props.movieData != null) {
            setMovies(props.movieData);
        } else {
            axios.get(props.url).then((response) => {
                setMovies(response.data.results);
            });
        }
    }, []);

    const customSettings = {
        breakpoints: {
            1800: { slidesPerView: 6.1, slidesPerGroup: 5 },
            1690: { slidesPerView: 5.5, slidesPerGroup: 5 },
            1536: { slidesPerView: 5, slidesPerGroup: 5 },
            1280: { slidesPerView: 4.3, slidesPerGroup: 4 },
            768: { slidesPerView: 3.3, slidesPerGroup: 3 },
            625: { slidesPerView: 3.1, slidesPerGroup: 3 },
            330: { slidesPerView: 2.1, slidesPerGroup: 2 },
            0: { slidesPerView: 2, slidesPerGroup: 2 },
        },
    };

    const opts = {
        width: "100%",
        height: "auto",
        playerVars: {
            autoplay: 1,
            controls: 0,
        },
        modestbranding: 1,
        rel: 0,
        autohide: 1,
        showinfo: 0,
    };

    const handleMoviePopup = (movieInfo) => {
        if (shouldPop) {
            setMoviePopupInfo(movieInfo);
            setShowModal(true);
            axios
                .get(`/movie/${movieInfo.id}/videos?api_key=${API_KEY}&language=en-US`)
                .then((responce) => {
                    if (responce.data.results.length !== 0) {
                        setUrlId(responce.data.results[0]);
                    }
                });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.5 } },
    };

    const modalVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, y: 50, transition: { duration: 0.5 } },
    };

    return (
        <motion.div
            className="ml-2 lg:ml-11 mb-11 lg:mb-4 RowContainer"
            style={{ marginTop: `${props.first ? "-8rem" : ""}` }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {PopupMessage}
            {removePopupMessage}

            {movies[0] ? (
                <>
                    <h1 className="text-white pb-4 xl:pb-0 font-normal text-base sm:text-2xl md:text-4xl">
                        {props.title}
                    </h1>

                    <Swiper
                        {...customSettings}
                        modules={[Navigation, Pagination]}
                        spaceBetween={8}
                        slidesPerView={6.1}
                        navigation
                        pagination={{ clickable: true }}
                        className="SwiperStyle"
                    >
                        {movies.map((obj) => {
                            const converted = convertGenere(obj.genre_ids);
                            return (
                                <SwiperSlide
                                    className={props.islarge ? "large" : "bg-cover"}
                                    onClick={() => handleMoviePopup(obj)}
                                    key={obj.id}
                                >
                                    {props.islarge ? (
                                        <img className="rounded-sm" src={`${imageUrl + obj.poster_path}`} alt={obj.name || obj.title} />
                                    ) : (
                                        <img
                                            loading="lazy"
                                            className={props.movieData != null ? "border-b-4 border-red-700 rounded-sm" : "rounded-sm"}
                                            src={obj.backdrop_path ? `${imageUrl2 + obj.backdrop_path}` : "https://i.ytimg.com/vi/Mwf--eGs05U/maxresdefault.jpg"}
                                            alt={obj.name || obj.title}
                                            onClick={() => handleMoviePopup(obj)}
                                        />
                                    )}
                                    <div className="content pt-16">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {/* ... (rest of your SwiperSlide content - play, add to list, etc.) */}
                                        </motion.div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </>
            ) : (
                <div className="animate-pulse">
                    {/* ... (your loading skeleton) */}
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="relative w-auto mt-24 sm:my-6 mx-4 max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-neutral-800 outline-none focus:outline-none">
                                    {/* ... (rest of your modal content) */}
                                </div>
                            </motion.div>
                        </div>
                        <div className="opacity-40 fixed inset-0 z-40 bg-black" onClick={() => setShowModal(false)}></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default RowPost;