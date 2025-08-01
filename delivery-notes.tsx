import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Truck, FileText, Calendar, MapPin } from 'lucide-react';

export default function DeliveryNotes() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-red-600 text-white p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setLocation('/')} 
              className="flex items-center space-x-2 bg-white text-red-600 rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Button>
            <div className="bg-white text-red-600 rounded-lg p-3 font-bold text-lg">
              OMNOR GROUP
            </div>
            <span className="text-lg font-medium">Delivery Management System</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Delivery Notes</h1>
          <p className="text-xl text-gray-600">Track and manage delivery documentation</p>
        </div>

        {/* Coming Soon Notice */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <Truck className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Delivery Notes System</h2>
              <p className="text-gray-600 mb-6">
                Complete delivery tracking and documentation system coming soon. This will include:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <FileText className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Delivery Documentation</h3>
                  <p className="text-sm text-gray-600">Digital delivery notes and receipts</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Route Tracking</h3>
                  <p className="text-sm text-gray-600">Real-time delivery tracking</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Scheduling</h3>
                  <p className="text-sm text-gray-600">Delivery scheduling and planning</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Truck className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Fleet Management</h3>
                  <p className="text-sm text-gray-600">Vehicle and driver management</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Button 
                onClick={() => setLocation('/')}
                className="bg-red-600 hover:bg-red-700"
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}