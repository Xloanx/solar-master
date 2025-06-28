'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChargeControllerRecommendation } from "@/components/chargeControllerRecommendation";
import { OptimizationAdvice } from "@/components/optimizationAdvice";
import InverterRecommendation from "./inverterRecommendation";



const Recommendations = () => {


    return ( 
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recommended Inverter Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <InverterRecommendation />
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