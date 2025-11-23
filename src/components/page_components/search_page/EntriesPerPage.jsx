export const EntriesPerPage = ({ entriesPerPage, setEntriesPerPage }) => (
    <div className="flex items-center gap-2">
        <label
            htmlFor="entriesPerPage"
            className="text-lg font-medium text-[var(--main-color)]"
        >
            Entries per page:
        </label>
        <div className="border-2 border-[var(--main-color)] rounded-lg p-1">
            <select
                id="entriesPerPage"
                className="focus:outline-none rounded px-2 py-1 text-lg text-[var(--main-color)]"
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
                {[5, 10, 20, 30, 50, 100].map((num) => (
                    <option key={num} value={num}>
                        {num}
                    </option>
                ))}
            </select>
        </div>
    </div>
);
