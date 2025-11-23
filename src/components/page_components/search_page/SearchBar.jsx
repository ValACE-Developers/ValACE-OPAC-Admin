import { Search, SlidersHorizontal, X } from "lucide-react";
import { Dropdown } from "./Dropdown";

export const SearchBar = ({
    search,
    setSearch,
    filters,
    onSearchChange,
    open,
    setOpen,
    selected,
    toggleFilter,
    filterType,
    setFilterType,
    isLoadingResourceFilters,
}) => (
    <div className="p-2 sm:p-5 m-2 sm:m-4 flex flex-col items-center bg-white">
        <div className="flex w-full max-w-xl items-center gap-3 sm:max-w-[50%] relative">
            <div className="relative w-full">
                <div
                    className="flex items-center gap-2 w-full bg-white border-2 border-[#00104A] rounded-lg shadow-md px-4 py-3"
                    style={{
                        boxShadow: "var(--shadow-custom)",
                    }}
                >
                    <Search className="h-5 w-5 sm:h-6 sm:w-6 text-[#00104A]" />
                    <input
                        type="text"
                        placeholder="Search a Book"
                        className="bg-transparent outline-none w-full text-[#00104A] placeholder-[#00104A] text-base sm:text-xl"
                        value={search}
                        onChange={onSearchChange}
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="focus:outline-none">
                            <X className="h-5 w-5 sm:h-6 sm:w-6 text-[#00104A]" />
                        </button>
                    )}
                </div>
            </div>

            <div className="relative">
                <button
                    className="bg-[#00104A] rounded-lg p-3 shadow-lg flex items-center justify-center transition hover:bg-[#223366]"
                    style={{ boxShadow: "var(--shadow-custom)" }}
                    onClick={() => setOpen((prev) => !prev)}
                >
                    <SlidersHorizontal className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </button>

                {open && (
                    <Dropdown
                        isLoading={isLoadingResourceFilters}
                        filters={filters}
                        selected={selected}
                        toggleFilter={toggleFilter}
                        filterType={filterType}
                        setFilterType={setFilterType}
                    />
                )}
            </div>
        </div>
    </div>
);
