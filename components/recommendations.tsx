'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChargeControllerRecommendation } from "@/components/chargeControllerRecommendation";
import { OptimizationAdvice } from "@/components/optimizationAdvice";
import { useAppStore } from "@/store/useAppStore";



const Recommendations = () => {
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

    return ( 
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recommended Inverter Brands</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Charge Controller Recommendation</CardTitle>
            <CardDescription>
              Get recommendations for the appropriate solar charge controller
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChargeControllerRecommendation />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimization Advice</CardTitle>
            <CardDescription>
              Get suggestions to optimize your installation and reduce costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OptimizationAdvice />
          </CardContent>
        </Card>
      </div>

     );
}
 
export default Recommendations;