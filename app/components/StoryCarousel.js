"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { IoIosPlayCircle } from "react-icons/io";
import Link from "next/link";
import SlideUp from "@/components/animation/SlideUp";
import ReactPlayer from "react-player";
import { IoMdClose } from "react-icons/io";
import { BiFullscreen } from "react-icons/bi";
import { BiExitFullscreen } from "react-icons/bi";
import useModalOpen from '@/app/store/useModalOpen';

const MultiImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { isOpen, setIsOpen } = useModalOpen();
  // 모달 컨테이너에 대한 ref 추가
  const modalRef = useRef(null);

  // 예시 이미지 데이터
  const images = [
    {
      id: 1,
      url: "/story/story1.png",
      title: "2024.03 필리핀 말라파스쿠아",
      link: "https://youtu.be/QHiJo0-lPqY?si=Vp30bSrXu35iDuG0",
    },
    {
      id: 2,
      url: "/story/story2.png",
      title: "2024.08 필리핀 세부 막탄(with 예지원)",
      link: "https://youtu.be/QHiJo0-lPqY?si=Vp30bSrXu35iDuG0",
    },
    {
      id: 3,
      url: "/story/story3.png",
      title: "2024.10 필리핀 보홀 1편",
      link: "https://youtu.be/QHiJo0-lPqY?si=Vp30bSrXu35iDuG0",
    },
    {
      id: 4,
      url: "/story/story4.png",
      title: "2024.10 필리핀 보홀 2편",
      link: "https://youtu.be/QHiJo0-lPqY?si=Vp30bSrXu35iDuG0",
    },
    {
      id: 5,
      url: "/story/story5.png",
      title: "2024.12 필리핀 코론",
      link: "https://youtu.be/QHiJo0-lPqY?si=Vp30bSrXu35iDuG0",
    },
  ];

  // 컴포넌트 마운트 시 window width 설정
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    const itemsPerView = windowWidth < 768 ? 2 : 4;
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, images.length - itemsPerView) : Math.max(0, prev - 1)
    );
  };

  const handleNext = () => {
    const itemsPerView = windowWidth < 768 ? 2 : 4;
    setCurrentIndex((prev) => (prev >= images.length - itemsPerView ? 0 : prev + 1));
  };

  const handleVideoClick = (url) => {
    setCurrentVideoUrl(url);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setIsOpen(false);
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (modalRef.current.requestFullscreen) {
        modalRef.current.requestFullscreen();
      } else if (modalRef.current.webkitRequestFullscreen) {
        modalRef.current.webkitRequestFullscreen();
      } else if (modalRef.current.msRequestFullscreen) {
        modalRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  // Fullscreen 변경 이벤트 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="absolute right-3 md:right-0 -top-0 md:-top-16 flex gap-2">
        <button
          onClick={handlePrev}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors hover:cursor-pointer z-10"
          aria-label="Previous slides"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors hover:cursor-pointer z-10"
          aria-label="Next slides"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <SlideUp>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / (windowWidth < 768 ? 2 : 4))}%)`,
            }}
          >
            {images.map((image, index) => (
              <div
                key={image.id}
                className="flex-none w-1/2 md:w-1/3 relative"
                style={{ padding: index !== images.length - 1 ? '0 10px' : '0' }}
                onClick={() => handleImageClick(image)}
              >
                <div className="relative w-full h-32 md:h-[200px] bg-gray-100 rounded-lg overflow-hidden group mt-10 md:mt-0">
                  <Image
                    src={image.url}
                    alt={image.title}
                    fill
                    className="transition-transform duration-300 ease-out group-hover:scale-105 object-cover"
                  />
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Play ${image.title}`}
                    onClick={() => handleVideoClick(image.link)}
                  >
                    <IoIosPlayCircle className="w-10 h-10 md:w-20 md:h-20" />
                  </button>
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm md:text-[18px]">{image.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SlideUp>
      {/* Modal for Image and Video */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div 
            ref={modalRef}
            className="relative  w-full h-full flex items-center justify-center"
          >
            <div className='text-red-500'></div>
            <div className="absolute top-0 right-0 m-4 flex gap-x-5 z-50">
              <button className="" onClick={toggleFullScreen}>
                  {isFullScreen ? <BiExitFullscreen className="w-8 h-8 text-white" /> : <BiFullscreen className="w-8 h-8 text-white" />}
              </button>
              <button className="" onClick={closeModal}>
                <IoMdClose className="w-10 h-10 text-white" />
              </button>
            </div>
            
            <ReactPlayer
              className="react-player"
              url={selectedImage.link}
              playing
              controls
              width="80%"
              height="80%"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageCarousel;
