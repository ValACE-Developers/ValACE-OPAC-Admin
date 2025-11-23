import { useNavigate } from "react-router-dom";
import { visitResource } from "@/utils";
import { DEFAULT_COVER } from "@/constants/asset";

export const CoverCard = ({
    title,
    thumbnail,
    route,
    link,
    resourceAddress,
}) => {

    const redirectToRoute = () => {
        if (resourceAddress) {
            console.log("Visiting resource:", resourceAddress);
            visitResource(resourceAddress);
        }
        if (route) {
            navigate(route);
        } else if (link) {
            window.open(link, "_blank", "noopener,noreferrer");
        }
    };

    const navigate = useNavigate();

    return (
        <div className="w-fit bg-white flex flex-col items-center rounded-lg cursor-pointer">
            <button onClick={redirectToRoute}>
                <div className="relative group w-full">
                    <img
                        src={thumbnail}
                        alt={title}
                        className="rounded-lg shadow-md sm:w-[300px] w-[150px] h-auto mx-auto object-fill object-center"
                        style={{
                            boxShadow: "var(--shadow-left)",
                        }}
                        onError={(e) => {
                            e.target.src = DEFAULT_COVER;
                        }}
                    />
                </div>
            </button>
            <h2 className="text-lg sm:text-xl font-medium text-[var(--main-color)] p-2 text-center truncate w-[140px] sm:w-[210px]" title={title}>
                {title}
            </h2>
        </div>
    );
};

export default CoverCard;
