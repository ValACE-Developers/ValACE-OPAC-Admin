export const Header = ({ title, description }) => (
    <header className="mb-8">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-5xl font-bold text-[var(--main-color)] mb-2">{title}</h1>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    </header>
);

export default Header;