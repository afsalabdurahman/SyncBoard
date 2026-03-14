import { useState } from "react"
import { PlanDetails } from "../components/plan/PlanDetails";


export const PlanManagementPage = () => {
    const [activeTab, setActiveTab] = useState("PlanDetails");
    const renderContent = () => {
        if (activeTab === "PlanDetails") return <PlanDetails />;


    };
    return (
        <div className="min-h-screen bg-gray-50">
            {renderContent()}
        </div>
    )
}


