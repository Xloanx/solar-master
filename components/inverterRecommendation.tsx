import { Zap } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";


const InverterRecommendation = () => {

    const { energyData } = useAppStore();
    const inverterWatts = energyData.totalSurgeFactor;
  // const inverterKVA = inverterWatts / 0.85; // Convert to KVA using power factor of 0.85
  // const inverterKVA_ = inverterKVA/1000
  
    const recommendedBrands = [
        { name: "Victron Energy", models: ["MultiPlus", "Quattro"], efficiency: "95%+" },
        { name: "SMA", models: ["Sunny Boy", "Sunny Island"], efficiency: "97%+" },
        { name: "Schneider Electric", models: ["Conext", "XW Pro"], efficiency: "94%+" },
        { name: "Outback Power", models: ["FXR", "Radian"], efficiency: "93%+" },
        { name: "Magnum Energy", models: ["MS-PAE", "MMS"], efficiency: "90%+" },
    ];

    if (energyData.totalRawEnergy === 0) {
    return (
      <div className="text-center py-8">
        <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Complete the Energy Audit and inverter capacity first</p>
      </div>
    );
  }



    return ( 
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedBrands.map((brand) => (
                <div key={brand.name} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{brand.name}</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Models:</span> {brand.models.join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Efficiency:</span> {brand.efficiency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Choose an inverter with at least {inverterWatts.toFixed(0)}W capacity. 
                For better performance and future expansion, consider a 20-30% higher capacity.
              </p>
            </div>
        </div>
     );
}
 
export default InverterRecommendation;