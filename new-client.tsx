import { ArrowLeft, Save, X, Plus } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CompanyConfig {
  name: string;
  tagline: string;
}

interface ClientFormData {
  // Basic Company Details
  companyName: string;
  tradingName: string;
  companyRegNo: string;
  companyVatNo: string;
  parentCompany: string;
  yearsTrading: string;
  businessType: string;
  
  // Addresses
  invoiceAddress: string;
  deliveryAddress: string;
  
  // Contact Details
  telephone: string;
  deliveryTelephone: string;
  email: string;
  deliveryEmail: string;
  natureOfBusiness: string;
  numberOfEmployees: string;
  
  // Key Contacts
  directorName: string;
  pLedgerName: string;
  pLedgerTel: string;
  pLedgerEmail: string;
  
  // Trade References
  tradeRef1Name: string;
  tradeRef1Phone: string;
  tradeRef1Website: string;
  tradeRef2Name: string;
  tradeRef2Phone: string;
  tradeRef2Website: string;
  
  // Bank and Financial Details
  creditApplicationAmount: string;
  bankName: string;
  bankSortCode: string;
  bankPostCode: string;
  bankAccountNo: string;
  
  // Preferences
  electronicInvoices: boolean;
  
  // Internal
  notes: string;
}

// White-label configuration
const companyConfig: CompanyConfig = {
  name: "Your Company",
  tagline: "Eng Services Ltd"
};

export default function NewClient() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ClientFormData>({
    companyName: "",
    tradingName: "",
    companyRegNo: "",
    companyVatNo: "",
    parentCompany: "",
    yearsTrading: "",
    businessType: "Limited Company",
    invoiceAddress: "",
    deliveryAddress: "",
    telephone: "",
    deliveryTelephone: "",
    email: "",
    deliveryEmail: "",
    natureOfBusiness: "",
    numberOfEmployees: "",
    directorName: "",
    pLedgerName: "",
    pLedgerTel: "",
    pLedgerEmail: "",
    tradeRef1Name: "",
    tradeRef1Phone: "",
    tradeRef1Website: "",
    tradeRef2Name: "",
    tradeRef2Phone: "",
    tradeRef2Website: "",
    creditApplicationAmount: "",
    bankName: "",
    bankSortCode: "",
    bankPostCode: "",
    bankAccountNo: "",
    electronicInvoices: false,
    notes: ""
  });

  const createClientMutation = useMutation({
    mutationFn: async (clientData: ClientFormData) => {
      // Convert form data to the expected format
      const submitData = {
        companyName: clientData.companyName,
        tradingName: clientData.tradingName || undefined,
        companyRegNo: clientData.companyRegNo || undefined,
        companyVatNo: clientData.companyVatNo || undefined,
        parentCompany: clientData.parentCompany || undefined,
        yearsTrading: clientData.yearsTrading ? parseInt(clientData.yearsTrading) : undefined,
        businessType: clientData.businessType,
        invoiceAddress: clientData.invoiceAddress || undefined,
        deliveryAddress: clientData.deliveryAddress || undefined,
        telephone: clientData.telephone || undefined,
        deliveryTelephone: clientData.deliveryTelephone || undefined,
        email: clientData.email || undefined,
        deliveryEmail: clientData.deliveryEmail || undefined,
        natureOfBusiness: clientData.natureOfBusiness || undefined,
        numberOfEmployees: clientData.numberOfEmployees ? parseInt(clientData.numberOfEmployees) : undefined,
        directorName: clientData.directorName || undefined,
        pLedgerName: clientData.pLedgerName || undefined,
        pLedgerTel: clientData.pLedgerTel || undefined,
        pLedgerEmail: clientData.pLedgerEmail || undefined,
        tradeRef1Name: clientData.tradeRef1Name || undefined,
        tradeRef1Phone: clientData.tradeRef1Phone || undefined,
        tradeRef1Website: clientData.tradeRef1Website || undefined,
        tradeRef2Name: clientData.tradeRef2Name || undefined,
        tradeRef2Phone: clientData.tradeRef2Phone || undefined,
        tradeRef2Website: clientData.tradeRef2Website || undefined,
        creditApplicationAmount: clientData.creditApplicationAmount || undefined,
        bankName: clientData.bankName || undefined,
        bankSortCode: clientData.bankSortCode || undefined,
        bankPostCode: clientData.bankPostCode || undefined,
        bankAccountNo: clientData.bankAccountNo || undefined,
        electronicInvoices: clientData.electronicInvoices,
        notes: clientData.notes || undefined
      };

      return apiRequest("/api/clients", {
        method: "POST",
        body: JSON.stringify(submitData),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Client application submitted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setLocation("/clients");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit client application",
        variant: "destructive",
      });
      console.error("Error creating client:", error);
    },
  });

  const handleInputChange = (field: keyof ClientFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.companyName.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name is required",
        variant: "destructive",
      });
      return;
    }

    createClientMutation.mutate(formData);
  };

  const handleCancel = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-red-600 text-white p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <button className="flex items-center space-x-2 bg-white text-red-600 rounded-lg p-2 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Main</span>
              </button>
            </Link>
            <div className="bg-white text-red-600 rounded-lg p-3 font-bold text-lg">
              {companyConfig.name.toUpperCase()}
            </div>
            <span className="text-lg font-medium">{companyConfig.tagline}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">APPLICATION FOR CREDIT ACCOUNT</h1>
          <p className="text-lg text-gray-600">Complete client registration and credit application</p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          
          {/* Business Type Selection */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <Label className="text-lg font-bold text-gray-800 mb-4 block">Business Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Limited Company', 'Partnership', 'Sole Trader', 'Other'].map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="businessType"
                    value={type}
                    checked={formData.businessType === type}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="text-red-600"
                  />
                  <span className="text-sm font-medium">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Company Details Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">COMPANY DETAILS</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div>
                <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Company Name *
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="tradingName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Trading Name
                </Label>
                <Input
                  id="tradingName"
                  value={formData.tradingName}
                  onChange={(e) => handleInputChange('tradingName', e.target.value)}
                  placeholder="Enter trading name..."
                />
              </div>

              <div>
                <Label htmlFor="companyRegNo" className="text-sm font-medium text-gray-700 mb-2 block">
                  Company Reg No
                </Label>
                <Input
                  id="companyRegNo"
                  value={formData.companyRegNo}
                  onChange={(e) => handleInputChange('companyRegNo', e.target.value)}
                  placeholder="Enter company registration number..."
                />
              </div>

              <div>
                <Label htmlFor="companyVatNo" className="text-sm font-medium text-gray-700 mb-2 block">
                  Company VAT No
                </Label>
                <Input
                  id="companyVatNo"
                  value={formData.companyVatNo}
                  onChange={(e) => handleInputChange('companyVatNo', e.target.value)}
                  placeholder="Enter VAT number..."
                />
              </div>

              <div>
                <Label htmlFor="parentCompany" className="text-sm font-medium text-gray-700 mb-2 block">
                  Parent Company
                </Label>
                <Input
                  id="parentCompany"
                  value={formData.parentCompany}
                  onChange={(e) => handleInputChange('parentCompany', e.target.value)}
                  placeholder="Enter parent company name..."
                />
              </div>

              <div>
                <Label htmlFor="yearsTrading" className="text-sm font-medium text-gray-700 mb-2 block">
                  No. of Years Trading
                </Label>
                <Input
                  id="yearsTrading"
                  type="number"
                  value={formData.yearsTrading}
                  onChange={(e) => handleInputChange('yearsTrading', e.target.value)}
                  placeholder="Enter years trading..."
                />
              </div>
            </div>
          </div>

          {/* Address Details Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">ADDRESS DETAILS</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div>
                <Label htmlFor="invoiceAddress" className="text-sm font-medium text-gray-700 mb-2 block">
                  Invoice and Statement Address
                </Label>
                <Textarea
                  id="invoiceAddress"
                  value={formData.invoiceAddress}
                  onChange={(e) => handleInputChange('invoiceAddress', e.target.value)}
                  placeholder="Enter invoice address..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="deliveryAddress" className="text-sm font-medium text-gray-700 mb-2 block">
                  Delivery Address
                </Label>
                <Textarea
                  id="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  placeholder="Enter delivery address..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="telephone" className="text-sm font-medium text-gray-700 mb-2 block">
                  Telephone No
                </Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="Enter telephone number..."
                />
              </div>

              <div>
                <Label htmlFor="deliveryTelephone" className="text-sm font-medium text-gray-700 mb-2 block">
                  Delivery Telephone No
                </Label>
                <Input
                  id="deliveryTelephone"
                  value={formData.deliveryTelephone}
                  onChange={(e) => handleInputChange('deliveryTelephone', e.target.value)}
                  placeholder="Enter delivery telephone..."
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address..."
                />
              </div>

              <div>
                <Label htmlFor="deliveryEmail" className="text-sm font-medium text-gray-700 mb-2 block">
                  Delivery Email
                </Label>
                <Input
                  id="deliveryEmail"
                  type="email"
                  value={formData.deliveryEmail}
                  onChange={(e) => handleInputChange('deliveryEmail', e.target.value)}
                  placeholder="Enter delivery email..."
                />
              </div>

              <div>
                <Label htmlFor="natureOfBusiness" className="text-sm font-medium text-gray-700 mb-2 block">
                  Nature of Business
                </Label>
                <Input
                  id="natureOfBusiness"
                  value={formData.natureOfBusiness}
                  onChange={(e) => handleInputChange('natureOfBusiness', e.target.value)}
                  placeholder="Enter nature of business..."
                />
              </div>

              <div>
                <Label htmlFor="numberOfEmployees" className="text-sm font-medium text-gray-700 mb-2 block">
                  Number of Employees
                </Label>
                <Input
                  id="numberOfEmployees"
                  type="number"
                  value={formData.numberOfEmployees}
                  onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
                  placeholder="Enter number of employees..."
                />
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">CONTACT DETAILS</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div>
                <Label htmlFor="directorName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Director
                </Label>
                <Input
                  id="directorName"
                  value={formData.directorName}
                  onChange={(e) => handleInputChange('directorName', e.target.value)}
                  placeholder="Enter director name..."
                />
              </div>

              <div>
                <Label htmlFor="pLedgerTel" className="text-sm font-medium text-gray-700 mb-2 block">
                  P/Ledger Tel
                </Label>
                <Input
                  id="pLedgerTel"
                  value={formData.pLedgerTel}
                  onChange={(e) => handleInputChange('pLedgerTel', e.target.value)}
                  placeholder="Enter purchase ledger telephone..."
                />
              </div>

              <div>
                <Label htmlFor="pLedgerName" className="text-sm font-medium text-gray-700 mb-2 block">
                  P/Ledger Name
                </Label>
                <Input
                  id="pLedgerName"
                  value={formData.pLedgerName}
                  onChange={(e) => handleInputChange('pLedgerName', e.target.value)}
                  placeholder="Enter purchase ledger contact name..."
                />
              </div>

              <div>
                <Label htmlFor="pLedgerEmail" className="text-sm font-medium text-gray-700 mb-2 block">
                  P/Ledger Email
                </Label>
                <Input
                  id="pLedgerEmail"
                  type="email"
                  value={formData.pLedgerEmail}
                  onChange={(e) => handleInputChange('pLedgerEmail', e.target.value)}
                  placeholder="Enter purchase ledger email..."
                />
              </div>
            </div>
          </div>

          {/* Trade References Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">TRADE REFERENCES</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Trade Reference 1 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Trade Reference 1</h3>
                <div>
                  <Label htmlFor="tradeRef1Name" className="text-sm font-medium text-gray-700 mb-2 block">
                    Company Name
                  </Label>
                  <Input
                    id="tradeRef1Name"
                    value={formData.tradeRef1Name}
                    onChange={(e) => handleInputChange('tradeRef1Name', e.target.value)}
                    placeholder="Enter trade reference 1..."
                  />
                </div>
                <div>
                  <Label htmlFor="tradeRef1Phone" className="text-sm font-medium text-gray-700 mb-2 block">
                    Telephone No
                  </Label>
                  <Input
                    id="tradeRef1Phone"
                    value={formData.tradeRef1Phone}
                    onChange={(e) => handleInputChange('tradeRef1Phone', e.target.value)}
                    placeholder="Enter telephone number..."
                  />
                </div>
                <div>
                  <Label htmlFor="tradeRef1Website" className="text-sm font-medium text-gray-700 mb-2 block">
                    Website
                  </Label>
                  <Input
                    id="tradeRef1Website"
                    value={formData.tradeRef1Website}
                    onChange={(e) => handleInputChange('tradeRef1Website', e.target.value)}
                    placeholder="Enter website URL..."
                  />
                </div>
              </div>

              {/* Trade Reference 2 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Trade Reference 2</h3>
                <div>
                  <Label htmlFor="tradeRef2Name" className="text-sm font-medium text-gray-700 mb-2 block">
                    Company Name
                  </Label>
                  <Input
                    id="tradeRef2Name"
                    value={formData.tradeRef2Name}
                    onChange={(e) => handleInputChange('tradeRef2Name', e.target.value)}
                    placeholder="Enter trade reference 2..."
                  />
                </div>
                <div>
                  <Label htmlFor="tradeRef2Phone" className="text-sm font-medium text-gray-700 mb-2 block">
                    Telephone No
                  </Label>
                  <Input
                    id="tradeRef2Phone"
                    value={formData.tradeRef2Phone}
                    onChange={(e) => handleInputChange('tradeRef2Phone', e.target.value)}
                    placeholder="Enter telephone number..."
                  />
                </div>
                <div>
                  <Label htmlFor="tradeRef2Website" className="text-sm font-medium text-gray-700 mb-2 block">
                    Website
                  </Label>
                  <Input
                    id="tradeRef2Website"
                    value={formData.tradeRef2Website}
                    onChange={(e) => handleInputChange('tradeRef2Website', e.target.value)}
                    placeholder="Enter website URL..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bank and Financial Details Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">BANK AND FINANCIAL DETAILS</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div>
                <Label htmlFor="creditApplicationAmount" className="text-sm font-medium text-gray-700 mb-2 block">
                  Credit Application Amount (£)
                </Label>
                <Input
                  id="creditApplicationAmount"
                  type="number"
                  step="0.01"
                  value={formData.creditApplicationAmount}
                  onChange={(e) => handleInputChange('creditApplicationAmount', e.target.value)}
                  placeholder="Enter credit amount..."
                />
              </div>

              <div>
                <Label htmlFor="bankName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Bank Name
                </Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  placeholder="Enter bank name..."
                />
              </div>

              <div>
                <Label htmlFor="bankSortCode" className="text-sm font-medium text-gray-700 mb-2 block">
                  Sort Code
                </Label>
                <Input
                  id="bankSortCode"
                  value={formData.bankSortCode}
                  onChange={(e) => handleInputChange('bankSortCode', e.target.value)}
                  placeholder="Enter sort code..."
                />
              </div>

              <div>
                <Label htmlFor="bankPostCode" className="text-sm font-medium text-gray-700 mb-2 block">
                  Bank Post Code
                </Label>
                <Input
                  id="bankPostCode"
                  value={formData.bankPostCode}
                  onChange={(e) => handleInputChange('bankPostCode', e.target.value)}
                  placeholder="Enter bank postcode..."
                />
              </div>

              <div>
                <Label htmlFor="bankAccountNo" className="text-sm font-medium text-gray-700 mb-2 block">
                  Account No
                </Label>
                <Input
                  id="bankAccountNo"
                  value={formData.bankAccountNo}
                  onChange={(e) => handleInputChange('bankAccountNo', e.target.value)}
                  placeholder="Enter account number..."
                />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">PREFERENCES</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="electronicInvoices"
                  checked={formData.electronicInvoices}
                  onCheckedChange={(checked) => handleInputChange('electronicInvoices', !!checked)}
                />
                <Label htmlFor="electronicInvoices" className="text-sm font-medium text-gray-700">
                  Do you wish to accept Electronic Invoices and Statements by email? (Yes/No)
                </Label>
              </div>
            </div>
          </div>

          {/* Additional Notes Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">ADDITIONAL NOTES</h2>
            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-2 block">
                Internal Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Enter any additional notes..."
                rows={4}
              />
            </div>
          </div>

          {/* Terms and Conditions Notice */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Terms & Conditions</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Terms & Conditions for Hire Equipment will be in accordance with Hire Association Europe Standard Conditions of Hire and Sale of Products.</p>
              <p>• All other sales will be in line with our normal Terms & Conditions of Sales.</p>
              <p>• <strong>ALL CREDIT ACCOUNTS 30 DAYS END OF MONTH AS STANDARD</strong></p>
              <p>• {companyConfig.name} is GDPR compliant. We may share your information with credit reference agencies and other companies for use in credit decisions, for fraud prevention and to pursue debtors.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={createClientMutation.isPending}
              className="bg-red-600 hover:bg-red-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{createClientMutation.isPending ? "Submitting..." : "Submit Application"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}