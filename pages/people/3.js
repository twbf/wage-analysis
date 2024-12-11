import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

const employeeConfig = {
  name: "JENNIFER RALDA ROMERO",
  id: "201",
  address: "1222 Missouri Avenue Apt 3",
  city: "Washington",
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

  const calculateShiftGap = (shift1End, shift2Start) => {
    const endMinutes = timeToMinutes(shift1End);
    const startMinutes = timeToMinutes(shift2Start);
    return (startMinutes - endMinutes) / 60;
  };

  const payPeriods = {
    "05/22/2023 - 06/04/2023": {
      payStub: {
        checkNumber: "7587",
        regularHours: 38.00,
        overtimeHours: 0,
        rate: 16.50
      },
      wageDetails: [
        {
          date: "06/18/23",
          shifts: [
            { login: "11:24 AM", logout: "2:52 PM", hours: 3.48 },
            { login: "4:18 PM", logout: "10:36 PM", hours: 6.29 }
          ],
          totalHours: 9.77,
          splitShift: true,
          overtime: true
        },
        {
          date: "06/15/23",
          login: "4:28 PM",
          logout: "9:59 PM",
          hours: 5.52
        },
        {
          date: "06/16/23",
          login: "3:58 PM",
          logout: "10:07 PM",
          hours: 6.15
        },
        {
          date: "06/17/23",
          login: "3:58 PM",
          logout: "10:11 PM",
          hours: 6.23
        }
      ]
    },
    "06/05/2023 - 06/18/2023": {
      payStub: {
        checkNumber: "7596",
        regularHours: 39.00,
        overtimeHours: 0,
        rate: 16.50
      },
      wageDetails: [
        {
          date: "06/20/23",
          login: "4:06 PM",
          logout: "9:59 PM",
          hours: 5.87
        },
        {
          date: "06/21/23",
          login: "4:01 PM",
          logout: "10:00 PM",
          hours: 5.98
        },
        {
          date: "06/22/23",
          login: "4:01 PM",
          logout: "9:47 PM",
          hours: 5.78
        },
        {
          date: "06/23/23",
          login: "4:41 PM",
          logout: "10:14 PM",
          hours: 5.55
        },
        {
          date: "06/24/23",
          login: "4:14 PM",
          logout: "9:17 PM",
          hours: 5.07
        },
        {
          date: "06/25/23",
          shifts: [
            { login: "1:24 PM", logout: "3:15 PM", hours: 1.85 },
            { login: "4:01 PM", logout: "9:52 PM", hours: 5.86 }
          ],
          totalHours: 7.71,
          splitShift: true
        }
      ]
    },
    "06/19/2023 - 07/02/2023": {
      payStub: {
        checkNumber: "7610",
        regularHours: 65.00,
        overtimeHours: 0,
        rate: 16.50
      },
      wageDetails: [
        {
          date: "06/27/23",
          login: "4:18 PM",
          logout: "10:01 PM",
          hours: 5.71
        },
        {
          date: "06/28/23",
          login: "4:04 PM",
          logout: "10:06 PM",
          hours: 6.02
        },
        {
          date: "06/29/23",
          login: "4:11 PM",
          logout: "10:02 PM",
          hours: 5.86
        },
        {
          date: "06/30/23",
          login: "4:24 PM",
          logout: "10:13 PM",
          hours: 5.82
        },
        {
          date: "07/01/23",
          login: "4:38 PM",
          logout: "10:29 PM",
          hours: 5.85
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
      if (day.overtime || (day.totalHours && day.totalHours > 8)) {
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

                  const totalHours = day.hours || day.totalHours;
                  const hasOvertime = totalHours > 8;

                  return (
                    <tr key={index} className={`border-b ${(hasOvertime || isSplitShift) ? 'bg-red-50' : ''}`}>
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
                        {totalHours}
                      </td>
                      <td className="p-2">
                        {hasOvertime && (
                          <div className="text-red-600">
                            {(totalHours - 8).toFixed(2)} hours overtime not paid
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