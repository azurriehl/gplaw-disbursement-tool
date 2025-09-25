import { useState, useEffect } from "react";
import { Calculator, Printer, RotateCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { defaultDisbursementItems } from "@shared/schema";

interface SelectedItem {
  id: string;
  description: string;
  unitCost: number;
  quantity: number;
  total: number;
}

interface CustomItem {
  id: string;
  description: string;
  unitCost: string;
  quantity: number;
}

export default function CalculatorPage() {
  const [propertyType, setPropertyType] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: SelectedItem }>({});
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [customItems, setCustomItems] = useState<{ [key: string]: CustomItem }>({});
  const [nextCustomItemId, setNextCustomItemId] = useState<number>(1);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  // Auto-select items when property type changes
  useEffect(() => {
    if (propertyType) {
      const newSelectedItems: { [key: string]: SelectedItem } = {};
      const newQuantities: { [key: string]: number } = {};
      
      defaultDisbursementItems.forEach(item => {
        if (item.propertyTypes.includes(propertyType)) {
          const quantity = quantities[item.id] || 1;
          const unitCost = parseFloat(item.unitCost);
          newSelectedItems[item.id] = {
            id: item.id,
            description: item.description,
            unitCost,
            quantity,
            total: unitCost * quantity
          };
          newQuantities[item.id] = quantity;
        }
      });
      
      setSelectedItems(newSelectedItems);
      setQuantities(newQuantities);
    }
  }, [propertyType]);

  const handleItemToggle = (itemId: string, checked: boolean) => {
    const item = defaultDisbursementItems.find(i => i.id === itemId);
    if (!item) return;

    if (checked) {
      const quantity = quantities[itemId] || 1;
      const unitCost = parseFloat(item.unitCost);
      setSelectedItems(prev => ({
        ...prev,
        [itemId]: {
          id: itemId,
          description: item.description,
          unitCost,
          quantity,
          total: unitCost * quantity
        }
      }));
    } else {
      setSelectedItems(prev => {
        const newItems = { ...prev };
        delete newItems[itemId];
        return newItems;
      });
    }
  };

  const handleCustomItemToggle = (itemId: string, checked: boolean) => {
    const customItem = customItems[itemId];
    if (!customItem) return;

    if (checked && customItem.description.trim() && customItem.unitCost) {
      const unitCost = parseFloat(customItem.unitCost);
      if (!isNaN(unitCost)) {
        setSelectedItems(prev => ({
          ...prev,
          [itemId]: {
            id: itemId,
            description: customItem.description.trim(),
            unitCost,
            quantity: customItem.quantity,
            total: unitCost * customItem.quantity
          }
        }));
      }
    } else {
      setSelectedItems(prev => {
        const newItems = { ...prev };
        delete newItems[itemId];
        return newItems;
      });
    }
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [itemId]: quantity }));
    
    if (selectedItems[itemId]) {
      setSelectedItems(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          quantity,
          total: prev[itemId].unitCost * quantity
        }
      }));
    }
    
    if (customItems[itemId]) {
      setCustomItems(prev => ({
        ...prev,
        [itemId]: { ...prev[itemId], quantity }
      }));
      
      if (selectedItems[itemId]) {
        setSelectedItems(prev => ({
          ...prev,
          [itemId]: {
            ...prev[itemId],
            quantity,
            total: prev[itemId].unitCost * quantity
          }
        }));
      }
    }
  };

  const addCustomItem = () => {
    const newItemId = `custom-${nextCustomItemId}`;
    setCustomItems(prev => ({
      ...prev,
      [newItemId]: { id: newItemId, description: "", unitCost: "", quantity: 1 }
    }));
    setNextCustomItemId(prev => prev + 1);
  };

  const handleCustomItemChange = (itemId: string, field: 'description' | 'unitCost', value: string) => {
    setCustomItems(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value }
    }));

    // Auto-check if both description and cost are provided
    const updatedItem = { ...customItems[itemId], [field]: value };
    if (updatedItem.description.trim() && updatedItem.unitCost && !isNaN(parseFloat(updatedItem.unitCost))) {
      const unitCost = parseFloat(updatedItem.unitCost);
      setSelectedItems(prev => ({
        ...prev,
        [itemId]: {
          id: itemId,
          description: updatedItem.description.trim(),
          unitCost,
          quantity: updatedItem.quantity,
          total: unitCost * updatedItem.quantity
        }
      }));
    } else {
      setSelectedItems(prev => {
        const newItems = { ...prev };
        delete newItems[itemId];
        return newItems;
      });
    }
  };

  const calculateTotals = () => {
    let subtotalExcGST = 0;
    let gstAmount = 0;
    
    Object.values(selectedItems).forEach(selectedItem => {
      const itemData = defaultDisbursementItems.find(item => item.id === selectedItem.id);
      
      if (itemData?.gstIncluded) {
        // GST is already included in the price
        const gstInclusiveTotal = selectedItem.total;
        const exGstAmount = gstInclusiveTotal / 1.1; // Remove GST to get ex-GST amount
        const gstOnItem = gstInclusiveTotal - exGstAmount;
        
        subtotalExcGST += exGstAmount;
        gstAmount += gstOnItem;
      } else {
        // GST not included, need to add it
        subtotalExcGST += selectedItem.total;
        gstAmount += selectedItem.total * 0.1;
      }
    });
    
    const total = subtotalExcGST + gstAmount;
    return { 
      subtotal: subtotalExcGST, 
      gst: gstAmount, 
      total 
    };
  };

  const { subtotal, gst, total } = calculateTotals();

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the calculator? This will clear all selections.')) {
      setPropertyType("");
      setSelectedItems({});
      setQuantities({});
      setCustomItems({});
      setNextCustomItemId(1);
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: "var(--grey-100)"}}>
      {/* Header */}
      <header className="bg-gradient-to-r from-firm-primary to-red-500 shadow-lg" data-testid="header-calculator">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-lg shadow-md">
                <Calculator className="text-firm-primary h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[0.2em]" data-testid="text-calculator-title">
                  CALCULATOR
                </h1>
                <p className="text-yellow-100 text-sm sm:text-base">Conveyancing fees and costs</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <p className="text-white text-sm font-medium">To be used for Seller Disclosure Statement (Form 2)</p>
                <p className="text-yellow-100 text-xs">for both Residential & Commercial</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Type Selection */}
        <Card className="mb-8 bg-white border-2" style={{borderColor: "#F47424"}} data-testid="card-property-type">
          <CardHeader>
            <CardTitle className="text-lg font-bold" style={{fontFamily: "'Montserrat', system-ui, sans-serif", color: "var(--grey-700)"}}>Select Property Type</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={propertyType} onValueChange={setPropertyType} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 p-4 border-2 rounded-lg hover:border-firm-primary transition-colors" style={{borderColor: "var(--grey-200)"}}>
                <RadioGroupItem value="land" id="land" data-testid="radio-property-land" />
                <Label htmlFor="land" className="cursor-pointer flex-1">
                  <div className="text-sm font-medium tracking-[0.2em]" style={{color: "#F47424"}}>LAND</div>
                  <div className="text-xs" style={{color: "var(--grey-500)"}}>Vacant land purchase</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border-2 rounded-lg hover:border-firm-primary transition-colors" style={{borderColor: "var(--grey-200)"}}>
                <RadioGroupItem value="house" id="house" data-testid="radio-property-house" />
                <Label htmlFor="house" className="cursor-pointer flex-1">
                  <div className="text-sm font-medium tracking-[0.2em]" style={{color: "#F47424"}}>HOUSE</div>
                  <div className="text-xs" style={{color: "var(--grey-500)"}}>Detached dwelling</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border-2 rounded-lg hover:border-firm-primary transition-colors" style={{borderColor: "var(--grey-200)"}}>
                <RadioGroupItem value="unit" id="unit" data-testid="radio-property-unit" />
                <Label htmlFor="unit" className="cursor-pointer flex-1">
                  <div className="text-sm font-medium tracking-[0.2em]" style={{color: "#F47424"}}>UNIT</div>
                  <div className="text-xs" style={{color: "var(--grey-500)"}}>Apartment/townhouse</div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Calculator Table */}
        <Card className="overflow-hidden mb-8" data-testid="card-calculator-table">
          <CardHeader className="bg-firm-primary">
            <CardTitle className="text-xl text-white font-bold" style={{fontFamily: "'Montserrat', system-ui, sans-serif"}}>Disbursement Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{backgroundColor: "var(--grey-100)"}}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--grey-500)"}}>Select</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: "var(--grey-500)"}}>Description</th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{color: "var(--grey-500)"}}>Unit Cost</th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{color: "var(--grey-500)"}}>Qty</th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{color: "var(--grey-500)"}}>Cost</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y" style={{borderColor: "var(--grey-200)"}}>
                  {defaultDisbursementItems.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`hover-grey transition-colors ${
                        item.category === 'free' ? 'bg-green-50' : 
                        propertyType && item.propertyTypes.includes(propertyType) ? 'bg-blue-50' : ''
                      }`}
                      data-testid={`row-disbursement-${item.id}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={!!selectedItems[item.id]}
                            onCheckedChange={(checked) => handleItemToggle(item.id, checked as boolean)}
                            className="text-firm-primary focus:ring-firm-primary"
                            data-testid={`checkbox-item-${item.id}`}
                          />
                          {propertyType && item.propertyTypes.includes(propertyType) && (
                            <span className="text-xs text-blue-600 font-medium">AUTO</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium" style={{color: "var(--grey-700)"}}>{item.description}</td>
                      <td className="px-6 py-4 text-sm text-center tabular-nums">
                        {item.category === 'free' ? (
                          <span className="text-green-600 font-semibold">FREE</span>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span>{formatCurrency(parseFloat(item.unitCost))}</span>
                            <span className="text-xs" style={{color: "var(--grey-500)"}}>
                              {item.gstIncluded ? '(inc GST)' : '(+ GST)'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <Input
                          type="number"
                          min="1"
                          value={quantities[item.id] || 1}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          data-testid={`input-quantity-${item.id}`}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-center font-semibold tabular-nums" data-testid={`text-total-${item.id}`}>
                        {selectedItems[item.id] ? formatCurrency(selectedItems[item.id].total) : formatCurrency(0)}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Custom Items */}
                  {Object.values(customItems).length === 0 ? (
                    <tr>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4">
                        <Button
                          onClick={addCustomItem}
                          variant="ghost"
                          className="text-firm-primary border-0 hover-grey hover:text-firm-primary w-full justify-start"
                          data-testid="button-add-custom-item"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add custom item
                        </Button>
                      </td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  ) : (
                    <>
                      {Object.values(customItems).map((customItem) => (
                        <tr 
                          key={customItem.id} 
                          className="hover-grey transition-colors bg-blue-50"
                          data-testid={`row-custom-${customItem.id}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Checkbox
                              checked={!!selectedItems[customItem.id]}
                              onCheckedChange={(checked) => handleCustomItemToggle(customItem.id, checked as boolean)}
                              className="text-firm-primary focus:ring-firm-primary"
                              data-testid={`checkbox-custom-${customItem.id}`}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <Input
                              type="text"
                              placeholder="Enter custom item description"
                              value={customItem.description}
                              onChange={(e) => handleCustomItemChange(customItem.id, 'description', e.target.value)}
                              className="w-full"
                              data-testid={`input-custom-description-${customItem.id}`}
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <Input
                              type="number"
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              value={customItem.unitCost}
                              onChange={(e) => handleCustomItemChange(customItem.id, 'unitCost', e.target.value)}
                              className="w-20 text-center"
                              data-testid={`input-custom-cost-${customItem.id}`}
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <Input
                              type="number"
                              min="1"
                              value={customItem.quantity}
                              onChange={(e) => handleQuantityChange(customItem.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                              data-testid={`input-custom-quantity-${customItem.id}`}
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-center font-semibold tabular-nums" data-testid={`text-custom-total-${customItem.id}`}>
                            {selectedItems[customItem.id] ? formatCurrency(selectedItems[customItem.id].total) : formatCurrency(0)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4">
                          <Button
                            onClick={addCustomItem}
                            variant="ghost"
                            size="sm"
                            className="text-firm-primary border-0 hover-grey hover:text-firm-primary w-full justify-start"
                            data-testid="button-add-another-custom-item"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add another custom item
                          </Button>
                        </td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Totals Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white border-2" style={{borderColor: "#F47424"}} data-testid="card-selected-items">
              <CardHeader>
                <CardTitle className="text-lg font-bold" style={{fontFamily: "'Montserrat', system-ui, sans-serif", color: "var(--grey-700)"}}>Selected Items Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(selectedItems).length === 0 ? (
                  <p className="italic" style={{color: "var(--grey-500)"}} data-testid="text-no-items">No items selected yet</p>
                ) : (
                  <div className="space-y-2 text-sm">
                    {Object.values(selectedItems).map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-1 border-b" style={{borderColor: "var(--grey-200)"}} data-testid={`summary-item-${item.id}`}>
                        <span className="text-sm">
                          {item.description} {item.quantity > 1 ? `(×${item.quantity})` : ''}
                        </span>
                        <span className="text-sm font-semibold tabular-nums">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card className="bg-white border-2" style={{borderColor: "#F47424"}} data-testid="card-totals">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium" style={{color: "var(--grey-700)"}}>Subtotal:</span>
                    <span className="text-lg font-semibold tabular-nums" data-testid="text-subtotal">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium" style={{color: "var(--grey-700)"}}>GST:</span>
                    <span className="text-lg font-semibold tabular-nums" data-testid="text-gst">{formatCurrency(gst)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold" style={{color: "var(--grey-700)"}}>Total (inc. GST):</span>
                      <span className="text-2xl font-bold tabular-nums" style={{color: "#F47424"}} data-testid="text-total">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-3">
              <Button 
                onClick={handlePrint} 
                className="w-full bg-firm-primary hover:bg-red-600 text-white font-semibold"
                data-testid="button-print"
              >
                <Printer className="mr-2 h-4 w-4" />
                Printer Estimate
              </Button>
              <Button 
                onClick={handleReset} 
                variant="ghost"
                className="w-full text-firm-primary border-0 hover-grey hover:text-firm-primary font-semibold"
                data-testid="button-reset"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Calculator
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-firm-neutral text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm" style={{color: "var(--grey-400)"}}>
              This calculator provides estimates only. Final costs may vary based on specific circumstances.
            </p>
            <p className="text-xs mt-2" style={{color: "var(--grey-500)"}}>
              Generated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
