import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

const employeeConfig = {
  name: "ESTIVER ANALIS AGUILAR",
  id: "138",
  address: "1515 OGDEN ST NW # 306",
  city: "WASHINGTON",
  state: "DC",
  zip: "20010"
};

const WageAnalysisDashboard = () => {
  const timeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const calculateHours = (login, logout) => {
    const startMinutes = timeToMinutes(login);
    const endMinutes = timeToMinutes(logout);
    return ((endMinutes - startMinutes) / 60).toFixed(2);
  };

  const payPeriods = {
    "12/23/2019 - 01/05/2020": {
      payStub: {
        checkNumber: "6643",
        regularHours: 50.00,
        rate: 17.16,
        totalPay: 858.00
      },
      wageDetails: [
        {
          date: "12/26/19",
          login: "10:40 AM",
          logout: "2:28 PM",
          hours: 3.79,
          regularWages: 53.01
        },
        {
          date: "12/29/19",
          login: "10:31 AM",
          logout: "9:31 PM",
          hours: 10.99,
          regularWages: 153.91,
          overtime: 2.99
        }
      ]
    },
    "01/06/2020 - 01/19/2020": {
      payStub: {
        checkNumber: "6659",
        regularHours: 50.00,
        rate: 17.16,
        totalPay: 858.00
      },
      wageDetails: [
        {
          date: "01/09/20",
          login: "10:37 AM",
          logout: "2:37 PM",
          hours: 4.00,
          regularWages: 56.00
        },
        {
          date: "01/16/20",
          login: "10:26 AM",
          logout: "2:44 PM",
          hours: 4.30,
          regularWages: 60.18
        }
      ]
    },
    "03/02/2020 - 03/15/2020": {
      payStub: {
        checkNumber: "6732",
        regularHours: 0.00,
        rate: 17.16,
        totalPay: 857.82
      },
      wageDetails: [
        {
          date: "03/10/20",
          login: "10:39 AM",
          logout: "9:29 PM",
          hours: 10.83,
          regularWages: 151.58,
          overtime: 2.83
        }
      ]
    }
  };

  const [selectedPeriod, setSelectedPeriod] = useState(Object.keys(payPeriods)[0]);

  const getDiscrepancySummary = (period) => {
    const data = payPeriods[period];
    let overtimeHours = 0;
    let overtimeDays = [];
    let splitShiftDays = [];
    
    data.wageDetails.forEach(day => {
      const totalHours = day.hours;
      if (totalHours > 8) {
        const overtimeAmount = totalHours - 8;
        overtimeHours += overtimeAmount;
        overtimeDays.push({
          date: day.date,
          hours: overtimeAmount.toFixed(2)
        });
      }
    });

    return {
      overtimeHours: overtimeHours.toFixed(2),
      overtimeDays,
      splitShiftDays,
      totalUnpaidWages: (overtimeHours * data.payStub.rate * 1.5).toFixed(2)
    };
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <div>Wage Analysis Dashboard - {employeeConfig.name}</div>
            <div className="text-sm text-gray-500">
              Employee ID: {employeeConfig.id} | {employeeConfig.address}, {employeeConfig.city}, {employeeConfig.state} {employeeConfig.zip}
            </div>
          </div>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="ml-4 p-2 border rounded"
          >
            {Object.keys(payPeriods).map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded p-4">
              <h3 className="font-bold mb-2">Pay Stub Details</h3>
              <div className="space-y-2">
                <p>Check #: {payPeriods[selectedPeriod].payStub.checkNumber}</p>
                <p>Regular Hours: {payPeriods[selectedPeriod].payStub.regularHours}</p>
                <p>Rate: ${payPeriods[selectedPeriod].payStub.rate}/hr</p>
                <p>Total Pay: ${payPeriods[selectedPeriod].payStub.totalPay}</p>
              </div>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-bold mb-2">Period Summary</h3>
              <div className="space-y-2">
                {getDiscrepancySummary(selectedPeriod).overtimeHours > 0 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle size={16} />
                    <div>
                      <p>{getDiscrepancySummary(selectedPeriod).overtimeDays.length} days with overtime</p>
                      <p className="text-sm">Total: {getDiscrepancySummary(selectedPeriod).overtimeHours} overtime hours</p>
                      <p className="text-sm">Unpaid wages: ${getDiscrepancySummary(selectedPeriod).totalUnpaidWages}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border rounded p-4">
            <h3 className="font-bold mb-4">Detailed Time Records</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Date</th>
                  <th className="p-2">Time Records</th>
                  <th className="p-2">Total Hours</th>
                  <th className="p-2">Regular Wages</th>
                  <th className="p-2">Issues</th>
                </tr>
              </thead>
              <tbody>
                {payPeriods[selectedPeriod].wageDetails.map((day, index) => {
                  const overtime = day.hours > 8;

                  return (
                    <tr key={index} className={`border-b ${overtime ? 'bg-red-50' : ''}`}>
                      <td className="p-2">{day.date}</td>
                      <td className="p-2">{day.login} - {day.logout}</td>
                      <td className="p-2">{day.hours}</td>
                      <td className="p-2">${day.regularWages}</td>
                      <td className="p-2">
                        {overtime && (
                          <div className="text-red-600">
                            {(day.hours - 8).toFixed(2)} hours overtime not paid at 1.5x rate
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WageAnalysisDashboard;