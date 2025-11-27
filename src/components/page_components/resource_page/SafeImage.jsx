import { useState } from "react";
import { Server } from "lucide-react";

function SafeImage({ src, alt, fallback, className, ...props }) {
    const [hasError, setHasError] = useState(false);
    const isSrcMissing = !src || typeof src !== "string" || src.trim() === "";

    if (isSrcMissing || hasError) {
        if (typeof fallback === "string") {
            return (
                <img
                    src={fallback}
                    alt={alt || "placeholder"}
                    className={className}
                    {...props}
                />
            );
        }
        return (
            fallback || (
                <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
                    <Server className="w-5 h-5 text-gray-500" />
                    <span>No Image</span>
                </div>
            )
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setHasError(true)}
            {...props}
        />
    );
}

export default SafeImage;
