import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

// Employee configuration
const employeeConfig = {
  name: "CARLOS UMBERTO CRUZ",
  id: "128",
  address: "3336 MT. PLEASANT STREET, APT.4",
  city: "WASHINGTON",
  state: "DC",
  zip: "20010"
};

const WageAnalysisDashboard = () => {
  // Helper functions
  const timeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const calculateShiftGap = (shift1End, shift2Start) => {
    const endMinutes = timeToMinutes(shift1End);
    const startMinutes = timeToMinutes(shift2Start);
    return (startMinutes - endMinutes) / 60;
  };

  const payPeriods = {
    "04/01/2019 - 04/14/2019": {
      payStub: {
        checkNumber: "6313",
        regularHours: 52.00,
        overtimeHours: 0,
        rate: 13.50
      },
      wageDetails: [
        {
          date: "04/23/19",
          login: "10:26 AM",
          logout: "9:56 PM",
          hours: 11.51,
          overtime: true
        },
        {
          date: "04/30/19",
          shifts: [
            { login: "10:21 AM", logout: "11:47 AM", hours: 1.44 },
            { login: "11:50 AM", logout: "9:55 PM", hours: 10.07 }
          ],
          totalHours: 11.51,
          splitShift: false,
          overtime: true
        }
      ]
    },
    "04/15/2019 - 04/28/2019": {
      payStub: {
        checkNumber: "6326",
        regularHours: 70.00,
        overtimeHours: 0,
        rate: 13.50
      },
      wageDetails: [
        {
          date: "04/16/19",
          shifts: [
            { login: "10:27 AM", logout: "3:15 PM", hours: 4.80 },
            { login: "4:29 PM", logout: "9:37 PM", hours: 5.14 }
          ],
          totalHours: 9.94,
          splitShift: true,
          overtime: true
        }
      ]
    },
    "05/13/2019 - 05/26/2019": {
      payStub: {
        checkNumber: "6359",
        regularHours: 70.00,
        overtimeHours: 0,
        rate: 14.00
      },
      wageDetails: [
        {
          date: "05/14/19",
          login: "10:50 AM",
          logout: "9:51 PM",
          hours: 11.02,
          overtime: true
        },
        {
          date: "05/21/19",
          login: "10:35 AM",
          logout: "9:53 PM",
          hours: 11.31,
          overtime: true
        }
      ]
    }
  };

  const [selectedPeriod, setSelectedPeriod] = useState(Object.keys(payPeriods)[0]);

  const getDiscrepancySummary = (period) => {
    const data = payPeriods[period];
    let overtimeCount = 0;
    let splitShiftCount = 0;
    let totalOvertimeHours = 0;
    
    data.wageDetails.forEach(day => {
      if (day.overtime) {
        overtimeCount++;
        const regularHours = 8;
        const totalHours = day.hours || day.totalHours;
        totalOvertimeHours += Math.max(0, totalHours - regularHours);
      }
      
      if (day.shifts && day.shifts.length > 1) {
        const gap = calculateShiftGap(day.shifts[0].logout, day.shifts[1].login);
        if (gap > 1) {
          splitShiftCount++;
        }
      }
    });

    return { overtimeCount, splitShiftCount, totalOvertimeHours };
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
                <p>Overtime Hours: {payPeriods[selectedPeriod].payStub.overtimeHours}</p>
                <p>Rate: ${payPeriods[selectedPeriod].payStub.rate}/hr</p>
              </div>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-bold mb-2">Period Summary</h3>
              <div className="space-y-2">
                {getDiscrepancySummary(selectedPeriod).overtimeCount > 0 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle size={16} />
                    <div>
                      <p>{getDiscrepancySummary(selectedPeriod).overtimeCount} days with unpaid overtime</p>
                      <p className="text-sm">Total: {getDiscrepancySummary(selectedPeriod).totalOvertimeHours.toFixed(2)} overtime hours</p>
                    </div>
                  </div>
                )}
                {getDiscrepancySummary(selectedPeriod).splitShiftCount > 0 && (
                  <div className="flex items-center gap-2 text-amber-600">
                    <Clock size={16} />
                    <p>{getDiscrepancySummary(selectedPeriod).splitShiftCount} days with split shifts</p>
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
                  <th className="p-2">Issues</th>
                </tr>
              </thead>
              <tbody>
                {payPeriods[selectedPeriod].wageDetails.map((day, index) => {
                  let isSplitShift = false;
                  if (day.shifts && day.shifts.length > 1) {
                    const gap = calculateShiftGap(day.shifts[0].logout, day.shifts[1].login);
                    isSplitShift = gap > 1;
                  }

                  return (
                    <tr key={index} className={`border-b ${(day.overtime || isSplitShift) ? 'bg-red-50' : ''}`}>
                      <td className="p-2">{day.date}</td>
                      <td className="p-2">
                        {day.shifts ? (
                          day.shifts.map((shift, idx) => (
                            <div key={idx}>
                              {shift.login} - {shift.logout}
                            </div>
                          ))
                        ) : (
                          <div>{day.login} - {day.logout}</div>
                        )}
                      </td>
                      <td className="p-2">
                        {day.hours || day.totalHours}
                      </td>
                      <td className="p-2">
                        {day.overtime && (
                          <div className="text-red-600">
                            {((day.hours || day.totalHours) - 8).toFixed(2)} hours overtime not paid
                          </div>
                        )}
                        {isSplitShift && (
                          <div className="text-amber-600">Split shift (greater than 1 hour break)</div>
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