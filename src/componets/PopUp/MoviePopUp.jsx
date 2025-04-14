import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence
import StarRatings from "react-star-ratings";
import { imageUrl } from "../../Constants/Constance";
import { PopUpContext } from "../../Context/moviePopUpContext";
import useUpdateMylist from "../../CustomHooks/useUpdateMylist";
import usePlayMovie from "../../CustomHooks/usePlayMovie";
import useGenereConverter from "../../CustomHooks/useGenereConverter";
import useUpdateLikedMovies from "../../CustomHooks/useUpdateLikedMovies";
import useUpdateWatchedMovies from "../../CustomHooks/useUpdateWatchedMovies";

function MoviePopUp(props) {
  const { showModal, setShowModal } = useContext(PopUpContext);
  const { addToMyList, removeFromMyList, PopupMessage } = useUpdateMylist();
  const { addToLikedMovies, removeFromLikedMovies, LikedMoviePopupMessage } = useUpdateLikedMovies();
  const { removeFromWatchedMovies, removePopupMessage } = useUpdateWatchedMovies();
  const { playMovie } = usePlayMovie();
  const { convertGenere } = useGenereConverter();

  const [PopupInfo, setPopupInfo] = useState({});

  useEffect(() => {
    setPopupInfo(props.data1);
  }, [props.data1]); // Add props.data1 as dependency

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <>
      {PopupMessage}
      <AnimatePresence> {/* Wrap with AnimatePresence */}
        {showModal && (
          <motion.div // Wrap the modal with motion.div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-[10px] bg-[#00000080]" // Added blur and semi-transparent background
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div // Animate the content inside
              className="relative w-auto mt-24 sm:my-6 mx-4 max-w-3xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-neutral-800 outline-none focus:outline-none">
                {/* ... (rest of your modal content - no changes needed here) */}
                <button
                  className="group p-1 ml-2 mt-2 bg-transparent border-2 border-white hover:bg-white hover:text-black fixed right-4 rounded-full cursor-pointer float-right font-semibold outline-none focus:outline-none ease-linear transition-all duration-150"
                  onClick={() => setShowModal(false)}
                >
                  {/* ... */}
                </button>

                {/* ... (rest of your modal content) */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MoviePopUp;