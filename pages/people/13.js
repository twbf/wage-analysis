import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

const employeeConfig = {
  name: "ANA M ZUNIGA",
  id: "166",
  address: "119 Webster St NW #1",
  city: "WASHINGTON",
  state: "DC",
  zip: "20011"
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
    "12/20/2021 - 01/02/2022": {
      payStub: {
        checkNumber: "7043",
        regularHours: 49.00,
        rate: 15.00,
        totalPay: 735.00
      },
      wageDetails: [
        {
          date: "12/21/21",
          login: "4:27 PM",
          logout: "9:20 PM",
          hours: 4.87,
          regularWages: 55.98
        },
        {
          date: "12/22/21",
          login: "4:29 PM",
          logout: "9:18 PM",
          hours: 4.83,
          regularWages: 55.51
        },
        {
          date: "12/23/21",
          login: "4:30 PM",
          logout: "9:28 PM",
          hours: 4.97,
          regularWages: 57.17
        },
        {
          date: "12/24/21",
          login: "4:32 PM",
          logout: "9:09 PM",
          hours: 4.61,
          regularWages: 53.03
        },
        {
          date: "12/25/21",
          login: "4:33 PM",
          logout: "9:47 PM",
          hours: 5.24,
          regularWages: 60.22
        },
        {
          date: "12/28/21",
          login: "4:53 PM",
          logout: "9:28 PM",
          hours: 4.58,
          regularWages: 52.68
        },
        {
          date: "12/29/21",
          login: "4:27 PM",
          logout: "8:46 PM",
          hours: 4.32,
          regularWages: 49.64
        },
        {
          date: "12/30/21",
          login: "4:27 PM",
          logout: "9:54 PM",
          hours: 5.45,
          regularWages: 62.64,
          overtime: 0.45
        },
        {
          date: "12/31/21",
          login: "4:35 PM",
          logout: "9:42 PM",
          hours: 5.11,
          regularWages: 58.78
        }
      ]
    },
    "01/03/2022 - 01/16/2022": {
      payStub: {
        checkNumber: "7057",
        regularHours: 45.00,
        rate: 15.00,
        totalPay: 675.00
      },
      wageDetails: [
        {
          date: "01/04/22",
          login: "4:29 PM",
          logout: "9:18 PM",
          hours: 4.83,
          regularWages: 55.53
        },
        {
          date: "01/05/22",
          login: "4:26 PM",
          logout: "9:39 PM",
          hours: 5.21,
          regularWages: 59.92
        },
        {
          date: "01/06/22",
          login: "4:30 PM",
          logout: "9:59 PM",
          hours: 5.49,
          regularWages: 63.14
        },
        {
          date: "01/07/22",
          login: "4:42 PM",
          logout: "9:35 PM",
          hours: 4.90,
          regularWages: 56.32
        },
        {
          date: "01/08/22",
          login: "4:31 PM",
          logout: "9:40 PM",
          hours: 5.16,
          regularWages: 59.35
        }
      ]
    },
    "01/17/2022 - 01/30/2022": {
      payStub: {
        checkNumber: "7069",
        regularHours: 49.00,
        rate: 15.00,
        totalPay: 735.00
      },
      wageDetails: [
        {
          date: "01/18/22",
          login: "4:38 PM",
          logout: "9:32 PM",
          hours: 4.90,
          regularWages: 56.30
        },
        {
          date: "01/19/22",
          login: "4:35 PM",
          logout: "9:30 PM",
          hours: 4.91,
          regularWages: 56.48
        },
        {
          date: "01/20/22",
          login: "4:29 PM",
          logout: "9:40 PM",
          hours: 5.17,
          regularWages: 59.50
        },
        {
          date: "01/21/22",
          login: "4:59 PM",
          logout: "9:30 PM",
          hours: 4.53,
          regularWages: 52.06
        },
        {
          date: "01/22/22",
          login: "4:28 PM",
          logout: "9:23 PM",
          hours: 4.92,
          regularWages: 56.54
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
      
      // Check for split shifts
      if (day.login2 && day.logout1) {
        const gap = timeToMinutes(day.login2) - timeToMinutes(day.logout1);
        if (gap > 60) { // More than 1 hour break
          splitShiftDays.push({
            date: day.date,
            gapHours: (gap / 60).toFixed(2)
          });
        }
      }
    });

    return {
      overtimeHours: overtimeHours.toFixed(2),
      overtimeDays,
      splitShiftDays,
      totalUnpaidOvertime: (overtimeHours * data.payStub.rate * 1.5).toFixed(2)
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
                      <p className="text-sm">Unpaid overtime wages: ${getDiscrepancySummary(selectedPeriod).totalUnpaidOvertime}</p>
                    </div>
                  </div>
                )}
                {getDiscrepancySummary(selectedPeriod).splitShiftDays.length > 0 && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <Clock size={16} />
                    <div>
                      <p>{getDiscrepancySummary(selectedPeriod).splitShiftDays.length} split shifts detected</p>
                      {getDiscrepancySummary(selectedPeriod).splitShiftDays.map((day, idx) => (
                        <p key={idx} className="text-sm">
                          {day.date}: {day.gapHours}hr gap
                        </p>
                      ))}
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
                  const splitShift = day.login2 && day.logout1;

                  return (
                    <tr key={index} className={`border-b ${overtime ? 'bg-red-50' : ''} ${splitShift ? 'bg-orange-50' : ''}`}>
                      <td className="p-2">{day.date}</td>
                      <td className="p-2">
                        {day.login} - {day.logout}
                        {splitShift && <div>{day.login2} - {day.logout2}</div>}
                      </td>
                      <td className="p-2">{day.hours}</td>
                      <td className="p-2">${day.regularWages}</td>
                      <td className="p-2">
                        {overtime && (
                          <div className="text-red-600">
                            {(day.hours - 8).toFixed(2)} hours overtime not paid at 1.5x rate
                          </div>
                        )}
                        {splitShift && (
                          <div className="text-orange-600">
                            Split shift detected
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