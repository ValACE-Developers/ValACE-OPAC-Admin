import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_COVER } from "../../utils/defaultImageCover";

export const ListDisplay = ({ collectionTitle, collections, collectionLink, isLoading = false, isError, error }) => {
	const navigate = useNavigate();

	return (
		<>
			<div className="flex flex-row items-center sm:items-center justify-between my-4 sm:my-5 py-4 sm:py-5 gap-2 sm:gap-0">
				<h1 className="lg:text-3xl md:text-2xl sm:text-xl font-semibold font-khula text-[var(--main-color)]">{collectionTitle}</h1>
				<div className="flex justify-end items-center gap-3 sm:gap-5 w-[50%]">
					{!isLoading && collections.length > 0 && (
						<button onClick={() => navigate(collectionLink)} className="flex items-center gap-2 text-[var(--main-color)] text-sm sm:text-xl font-medium hover:underline">
							<span>See All</span>
							<div className="border-[var(--main-color)] border-[1px] rounded-lg p-1">
								<ChevronRight className="text-[#00104A] w-4 h-4 sm:w-8 sm:h-8 md:w-[25px] md:h-[25px]" />
							</div>
						</button>
					)}
				</div>
			</div>

			<div className="h-96 overflow-y-auto space-y-4">
				{isLoading ? (
					<SkeletonLoader />
				) : collections && collections.length > 0 ? (
					collections.map((book, index) => {
						return (
							<div
								key={book.book_cache_id || index}
								className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} flex items-start gap-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
							>
								<img src={book.thumbnail || DEFAULT_COVER} alt={`${book.title} cover`} className="h-32 w-24 object-cover rounded flex-shrink-0" />
								<div className="flex-1 min-w-0">
									<h2 className="text-lg font-semibold text-[#00104A] mb-2 line-clamp-2">{book.title}</h2>
									<p className="text-sm text-gray-600 line-clamp-3">{book.description || 'No description available'}</p>
								</div>
							</div>
						);
					})
				) : (
					<div className="flex justify-center items-center h-full">
						<div className="text-center">
							<h2 className="text-lg font-semibold text-[#00104A] mb-2">No books available</h2>
							<p className="text-sm text-gray-600">This collection is currently empty.</p>
						</div>
					</div>
				)}

				{isError && (
					<div className="flex justify-center items-center h-full">
						<p className="text-red-500">{error?.error || error?.message || "Something went wrong"}</p>
					</div>
				)}
			</div>
		</>
	);
}

const SkeletonLoader = () => {
	return (
		<>
			{[...Array(3)].map((_, index) => (
				<div
					key={index}
					className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} flex items-start gap-4 p-4 border border-gray-200 rounded-lg shadow-sm animate-pulse`}
				>
					{/* Image Skeleton */}
					<div className="h-32 w-24 bg-gray-300 rounded flex-shrink-0"></div>
					
					{/* Content Skeleton */}
					<div className="flex-1 min-w-0 space-y-3">
						{/* Title Skeleton */}
						<div className="h-5 bg-gray-300 rounded w-3/4"></div>
						<div className="h-5 bg-gray-300 rounded w-1/2"></div>
						
						{/* Description Skeleton */}
						<div className="space-y-2">
							<div className="h-3 bg-gray-300 rounded w-full"></div>
							<div className="h-3 bg-gray-300 rounded w-full"></div>
							<div className="h-3 bg-gray-300 rounded w-2/3"></div>
						</div>
					</div>
				</div>
			))}
		</>
	);
}