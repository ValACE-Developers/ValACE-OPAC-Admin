import { Loader2 } from "lucide-react";
import { LOGO_IMAGE } from "../../constants/asset";

export const LogoLoading = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <img src={LOGO_IMAGE} alt="ValACE Logo" className="w-[75px] sm:w-[150px] h-auto" />
            <Loader2 className="animate-spin h-10 w-10 text-[--main-color]" />
        </div>
    );
};

export default LogoLoading;