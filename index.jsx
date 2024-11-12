import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ROICalculator = () => {
  const [inputs, setInputs] = useState({
    // SE Team Configuration
    seAnnualSalary: 150000,
    numberOfSEs: 3,
    fullyLoadedMultiplier: 1.3,
    
    // Current POC Metrics
    currentPocDays: 40,
    currentMonthlyPocs: 2,
    
    // Work Schedule
    workDaysPerMonth: 21,

    // Proofs Pricing
    proofsBasePlatformCost: 5000,
    proofsPerPocCost: 500
  });

  const PROOFS_POC_DAYS = 2; // Fixed value for Proofs POC build time

  const [showAnnual, setShowAnnual] = useState(false);
  const [results, setResults] = useState({
    currentCosts: {
      seCost: 0,
      totalCost: 0
    },
    proofsCosts: {
      platformCost: 0,
      pocCosts: 0,
      totalCost: 0
    },
    savings: {
      monthlySavings: 0,
      annualSavings: 0,
      roi: 0
    },
    metrics: {
      timeToMarketImprovement: 0
    }
  });

  const calculateROI = () => {
    // Calculate SE costs
    const monthlySeBaseCost = (inputs.seAnnualSalary / 12) * inputs.numberOfSEs;
    const monthlySeFullCost = monthlySeBaseCost * inputs.fullyLoadedMultiplier;
    
    // Current State Calculations
    const currentSeDaysPerMonth = inputs.currentMonthlyPocs * inputs.currentPocDays;
    const currentMonthlySeCost = (monthlySeFullCost * (currentSeDaysPerMonth / inputs.workDaysPerMonth));
    
    // Proofs Costs
    const monthlyProofsPocCosts = inputs.currentMonthlyPocs * inputs.proofsPerPocCost;
    const monthlyProofsTotalCost = inputs.proofsBasePlatformCost + monthlyProofsPocCosts;
    
    // Savings Calculations
    const monthlySavings = currentMonthlySeCost - monthlyProofsTotalCost;
    const annualSavings = monthlySavings * 12;
    const totalInvestmentYear1 = (inputs.proofsBasePlatformCost * 12);
    const roi = ((annualSavings / totalInvestmentYear1) * 100);

    setResults({
      currentCosts: {
        seCost: Math.round(currentMonthlySeCost),
        totalCost: Math.round(currentMonthlySeCost)
      },
      proofsCosts: {
        platformCost: inputs.proofsBasePlatformCost,
        pocCosts: Math.round(monthlyProofsPocCosts),
        totalCost: Math.round(monthlyProofsTotalCost)
      },
      savings: {
        monthlySavings: Math.round(monthlySavings),
        annualSavings: Math.round(annualSavings),
        roi: Math.round(roi)
      },
      metrics: {
        timeToMarketImprovement: inputs.currentPocDays - PROOFS_POC_DAYS
      }
    });
  };

  useEffect(() => {
    calculateROI();
  }, [inputs, showAnnual]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const formatCurrency = (value) => {
    return showAnnual 
      ? `$${(value * 12).toLocaleString()}`
      : `$${value.toLocaleString()}`;
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Proofs ROI Calculator</CardTitle>
          <div className="flex items-center space-x-2">
            <Label>Show Annual</Label>
            <Switch
              checked={showAnnual}
              onCheckedChange={setShowAnnual}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inputs">
          <TabsList>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="impact">Business Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="inputs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Team Configuration</h3>
                
                <div className="space-y-2">
                  <Label>SE Annual Salary ($)</Label>
                  <Input
                    type="number"
                    name="seAnnualSalary"
                    value={inputs.seAnnualSalary}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Number of SEs</Label>
                  <Input
                    type="number"
                    name="numberOfSEs"
                    value={inputs.numberOfSEs}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Current POC Build Time (days)</Label>
                  <Input
                    type="number"
                    name="currentPocDays"
                    value={inputs.currentPocDays}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Current Monthly POCs</Label>
                  <Input
                    type="number"
                    name="currentMonthlyPocs"
                    value={inputs.currentMonthlyPocs}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Proofs Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Proofs Pricing</h3>
                
                <div className="space-y-2">
                  <Label>Monthly Platform Cost ($)</Label>
                  <Input
                    type="number"
                    name="proofsBasePlatformCost"
                    value={inputs.proofsBasePlatformCost}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cost per POC ($)</Label>
                  <Input
                    type="number"
                    name="proofsPerPocCost"
                    value={inputs.proofsPerPocCost}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="costs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Costs */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Current Costs</h3>
                
                <div>
                  <Label className="text-sm text-slate-500">SE Cost</Label>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(results.currentCosts.seCost)}
                  </p>
                </div>

                <div className="pt-2 border-t">
                  <Label className="text-sm text-slate-500">Total Cost</Label>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(results.currentCosts.totalCost)}
                  </p>
                </div>
              </div>

              {/* Proofs Costs */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Costs with Proofs</h3>

                <div>
                  <Label className="text-sm text-slate-500">Platform Cost</Label>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatCurrency(results.proofsCosts.platformCost)}
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-slate-500">POC Costs</Label>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatCurrency(results.proofsCosts.pocCosts)}
                  </p>
                </div>

                <div className="pt-2 border-t">
                  <Label className="text-sm text-slate-500">Total Cost</Label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(results.proofsCosts.totalCost)}
                  </p>
                </div>
              </div>

              {/* Total Cost Comparison */}
              <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Total Monthly Cost Comparison</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-slate-500">Current Total Cost</Label>
                    <p className="text-3xl font-bold text-slate-900">
                      {formatCurrency(results.currentCosts.totalCost)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-slate-500">Total Cost with Proofs</Label>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(results.proofsCosts.totalCost)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="impact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Financial Impact */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Financial Impact</h3>
                
                <div>
                  <Label className="text-sm text-slate-500">Net Savings</Label>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(results.savings.monthlySavings)}
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-slate-500">ROI</Label>
                  <p className="text-2xl font-bold text-slate-900">
                    {results.savings.roi}%
                  </p>
                </div>
              </div>

              {/* Business Impact */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Business Impact</h3>
                
                <div>
                  <Label className="text-sm text-slate-500">Time to Market</Label>
                  <p className="text-xl font-semibold text-slate-900">
                    {results.metrics.timeToMarketImprovement} days faster
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ROICalculator;
