import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export const useMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile;
};