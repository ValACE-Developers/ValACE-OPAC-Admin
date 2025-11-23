import { LayoutGrid, List } from "lucide-react";

export const ViewSwitcher = ({ isGrid, setIsGrid }) => (
    <div className="flex flex-row justify-end items-center sm:flex-row sm:items-center gap-4 sm:gap-0 my-4">
        <div className="flex items-center gap-2 pl-2 border-l-4 border-gray-500 sm:mt-0">
            <label className="cursor-pointer">
                <input
                    type="radio"
                    name="view"
                    value="grid"
                    className="peer hidden"
                    checked={isGrid}
                    onChange={() => setIsGrid(true)}
                />
                <LayoutGrid className="w-8 h-8 sm:w-[40px] sm:h-[40px] opacity-50 peer-checked:opacity-100 transition text-[var(--main-color)]" />
            </label>
            <label className="cursor-pointer">
                <input
                    type="radio"
                    name="view"
                    value="list"
                    className="peer hidden"
                    checked={!isGrid}
                    onChange={() => setIsGrid(false)}
                />
                <List className="w-8 h-8 sm:w-[40px] sm:h-[40px] opacity-50 peer-checked:opacity-100 transition text-[var(--main-color)]" />
            </label>
        </div>
    </div>
);


