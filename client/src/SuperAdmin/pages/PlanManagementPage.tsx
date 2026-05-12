import { useState } from "react"
import { PlanDetails } from "../components/plan/planDetails";


export const PlanManagementPage = () => {
    const [activeTab] = useState("PlanDetails");
    const renderContent = () => {
        if (activeTab === "PlanDetails") return <PlanDetails />;


    };
    return (
        <div className="min-h-screen bg-gray-50">
            {renderContent()}
        </div>
    )
}


