import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

const employeeConfig = {
  name: "DANIEL ALFREDO CASTILLO",
  id: "185",
  address: "7701 GEORGIA AVE NW",
  city: "WASHINGTON",
  state: "DC",
  zip: "20012"
};

const WageAnalysisDashboard = () => {
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
    "12/19/2022 - 01/01/2023": {
      payStub: {
        checkNumber: "7347",
        regularHours: 65.00,
        overtimeHours: 0,
        rate: 16.10
      },
      wageDetails: [
        {
          date: "12/20/22",
          login: "10:56 AM",
          logout: "9:39 PM",
          hours: 10.72,
          overtime: true
        },
        {
          date: "12/21/22",
          login: "10:58 AM",
          logout: "9:53 PM",
          hours: 10.91,
          overtime: true
        },
        {
          date: "12/22/22",
          login: "10:55 AM",
          logout: "7:47 PM",
          hours: 8.88,
          overtime: true
        }
      ]
    },
    "01/02/2023 - 01/15/2023": {
      payStub: {
        checkNumber: "7383",
        regularHours: 64.00,
        overtimeHours: 0,
        rate: 16.50
      },
      wageDetails: [
        {
          date: "01/03/23",
          shifts: [
            { login: "11:00 AM", logout: "3:02 PM", hours: 4.04 },
            { login: "4:00 PM", logout: "9:46 PM", hours: 5.76 }
          ],
          totalHours: 9.80,
          splitShift: true,
          overtime: true
        },
        {
          date: "01/04/23",
          login: "11:00 AM",
          logout: "2:46 PM",
          hours: 3.76,
          overtime: false
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