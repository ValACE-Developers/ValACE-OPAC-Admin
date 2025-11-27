import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CoverCard from "./CoverCard";
import { DEFAULT_COVER } from "@/constants/asset";
import { useNavigate } from "react-router-dom";
import { visitResource } from "@/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Skeleton Loading Components
const GridSkeleton = ({ isMobile }) => (
    <div className="flex flex-col items-center w-full animate-pulse">
        <div className={`bg-gray-300 rounded-lg ${isMobile ? 'w-[150px] h-[200px]' : 'w-[180px] md:w-[220px] h-[280px] md:h-[320px]'}`}></div>
        <div className="mt-2 w-3/4 h-4 bg-gray-300 rounded"></div>
    </div>
);

export const CollectionDisplay = ({ collectionTitle, collections, collectionLink, index, isLoading = false, isError, error, resourceAddress }) => {
    const navigate = useNavigate();
    const isMobile = useMobile();

    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center sm:items-center justify-between my-4 sm:my-5 py-4 sm:py-5 gap-2 sm:gap-0">
                <h1 className="lg:text-3xl md:text-2xl sm:text-xl font-semibold font-khula text-[var(--main-color)]">{collectionTitle}</h1>
                <div className="flex justify-end items-center gap-3 sm:gap-5 w-[50%]">
                    {!isLoading && collections.length > 0 && (
                        <>
                            <button onClick={() => {
                                navigate(collectionLink);
                                if (resourceAddress) {
                                    visitResource(resourceAddress);
                                }
                            }} 
                            className="flex items-center gap-2 text-[var(--main-color)] text-sm sm:text-xl font-medium hover:underline">
                                <span>See All</span>
                                <div className="block sm:hidden border-[var(--main-color)] border-[1px] rounded-lg p-1">
                                    <ChevronRight className="text-[#00104A] w-4 h-4 sm:w-8 sm:h-8 md:w-[25px] md:h-[25px]" />
                                </div>
                            </button>
                            <div className="hidden sm:flex items-center gap-2">
                                <button className={`custom-prev-${index} border-[var(--main-color)] border-[1px] rounded-lg p-2 cursor-pointer`}>
                                    <ChevronLeft className="text-[#00104A] w-5 h-5 sm:w-8 sm:h-8 md:w-[25px] md:h-[25px]" />
                                </button>
                                <button className={`custom-next-${index} border-[var(--main-color)] border-[1px] rounded-lg p-2 cursor-pointer`}>
                                    <ChevronRight className="text-[#00104A] w-5 h-5 sm:w-8 sm:h-8 md:w-[25px] md:h-[25px]" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="w-full sm:w-[100%] mx-auto">
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={isMobile ? 2 : 10}
                    slidesPerView={isLoading ? (isMobile ? 2 : 4) : collections && collections.length > 0 ? (isMobile ? 2 : 4) : 1}
                    navigation={{
                        nextEl: `.custom-next-${index}`,
                        prevEl: `.custom-prev-${index}`,
                    }}
                    loop={true}
                    className="w-full h-fit relative"
                >
                    {isLoading ? (
                        [...Array(isMobile ? 2 : 4)].map((_, idx) => (
                            <SwiperSlide key={`skeleton-${idx}`}>
                                <GridSkeleton isMobile={isMobile} />
                            </SwiperSlide>
                        ))
                    ) : collections && collections.length > 0 ? (
                        collections.map((item, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="w-fit mx-auto">
                                    <CoverCard title={item?.title} thumbnail={item?.image ? item?.image : DEFAULT_COVER} route={item?.route} link={item?.link} resourceAddress={resourceAddress}/>
                                </div>
                            </SwiperSlide>
                        ))
                    ) : (
                        <SwiperSlide>
                            <div className="text-center w-full text-gray-500">No collections available</div>
                        </SwiperSlide>
                    )}

                    {isError && (
                        <SwiperSlide className="">
                            <div className="text-center w-full text-red-500">{error?.error || error?.message || "Something went wrong"}</div>
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>
        </div>
    );
};