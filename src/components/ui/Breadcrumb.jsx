import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items }) => {
    const navigate = useNavigate();
    
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {index > 0 && (
                        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                    )}
                    {item.onClick ? (
                        <button
                            onClick={item.onClick}
                            className="text-gray-600 hover:text-gray-800 hover:underline cursor-pointer"
                        >
                            {item.label}
                        </button>
                    ) : (
                        <span className="text-gray-600">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
