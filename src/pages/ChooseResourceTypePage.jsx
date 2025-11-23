import { useNavigate } from "react-router-dom";
import { ChevronLeft, Code, Share2 } from "lucide-react";
import Breadcrumb from "../components/ui/Breadcrumb";
import { Header } from "../components/layout/Header";

// Resource Type Card Component
const ResourceTypeCard = ({ resourceType, onNavigate }) => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
        <div className="p-8">
            <div className="flex items-center justify-center mb-6">
                {resourceType.icon}
            </div>

            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                {resourceType.title}
            </h2>

            <p className="text-gray-600 text-center mb-6">
                {resourceType.description}
            </p>

            <button
                onClick={() => onNavigate(resourceType.route)}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors bg-[var(--main-color)] hover:bg-[var(--main-color)]/80`}
            >
                {resourceType.buttonText}
            </button>
        </div>
    </div>
);

// Main Page Component
const ChooseResourceTypePage = () => {
    const navigate = useNavigate();

    const resourceTypes = [
        {
            type: "api",
            title: "API Resource",
            description:
                "Create a new API resource with endpoints and data paths for your application",
            icon: <Code className="w-32 h-32 text-[var(--main-color)]" />,
            buttonText: "Create API Resource",
            route: "/admin/resources/create/api",
        },
        {
            type: "redirect",
            title: "Redirect Link Resource",
            description:
                "Create a simple redirect link resource that points to an external URL",
            icon: <Share2 className="w-32 h-32 text-[var(--main-color)]" />,
            buttonText: "Create Redirect Link",
            route: "/admin/resources/create/redirect",
        },
    ];

    const handleNavigate = (route) => {
        navigate(route);
    };

    return (
        <div className="p-6">
            <div>
                <Breadcrumb
                    items={[
                        {
                            label: "Resource",
                            onClick: () => navigate("/admin/resources"),
                        },
                        { label: "Choose Type of Resource", isCurrent: true },
                    ]}
                />

                <div className="mb-5">
                    <button
                        className="text-[var(--main-color)] rounded-md font-medium hover:text-[var(--main-color)]/80 transition-colors mb-2 flex items-center gap-1 w-fit"
                        onClick={() => navigate("/admin/resources")}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back to List</span>{" "}
                    </button>
                </div>

                <Header
                    title="Create Resource"
                    description="Create and manage API endpoints or redirect links for external access."
                />

                {/* Resource Type Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {resourceTypes.map((resourceType) => (
                        <ResourceTypeCard
                            key={resourceType.type}
                            resourceType={resourceType}
                            onNavigate={handleNavigate}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChooseResourceTypePage;
