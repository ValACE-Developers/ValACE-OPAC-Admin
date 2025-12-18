import { DEFAULT_COVER } from "@/constants/asset";

/**
 * Fetches book cover URL from the cover API
 * @param {string} isbn - The ISBN of the book
 * @param {string} provider - The cover provider (default: 'gb' for Google Books)
 * @returns {Promise<string>} - Returns the cover URL or DEFAULT_COVER on failure
 */
export const fetchBookCover = async (isbn, provider = "gb") => {
	if (!isbn || isbn === "N/A") {
		return DEFAULT_COVER;
	}

	try {
		const response = await fetch(`/cover?id=${isbn}&provider=${provider}`);
		if (!response.ok) {
			throw new Error("Failed to fetch cover");
		}
		const data = await response.json();
		// The response is an object with ISBN as key and URL as value
		const coverUrl = data[isbn];

		if (coverUrl) {
			return coverUrl;
		} else {
			return DEFAULT_COVER;
		}
	} catch (error) {
		console.error("Error fetching book cover:", error);
		return DEFAULT_COVER;
	}
};

/**
 * Gets book cover URL with fallback logic
 * @param {Object} book - The book object
 * @param {string} book.thumbnail - Existing thumbnail URL
 * @param {string} book.isbn - ISBN for fetching from API
 * @param {string} provider - The cover provider (default: 'gb')
 * @returns {Promise<string>} - Returns the cover URL
 */
export const getBookCoverUrl = async (book, provider = "gb") => {
	// If book already has a thumbnail, use it
	if (book?.thumbnail) {
		return book.thumbnail;
	}

	// Otherwise, fetch from API using ISBN
	const isbn = book?.isbn;
	return await fetchBookCover(isbn, provider);
};
