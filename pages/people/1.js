import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

// Employee configuration
const employeeConfig = {
  name: "MELADY M MONICO",
  id: "207",
  address: "2801 15 street NW # 101",
  city: "washington",
  state: "DC",
  zip: "20001"
};

const WageAnalysisDashboard = () => {
  // Helper functions remain the same
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
    "07/17/2023 - 07/30/2023": {
      payStub: {
        checkNumber: "7640",
        regularHours: 26.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: [
        {
          date: "07/30/23",
          login: "12:05 PM",
          logout: "10:09 PM",
          hours: 10.07,
          overtime: true
        }
      ]
    },
    "07/31/2023 - 08/13/2023": {
      payStub: {
        checkNumber: "7660",
        regularHours: 69.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: [
        {
          date: "08/01/23",
          shifts: [
            { login: "10:54 AM", logout: "3:06 PM", hours: 4.21 },
            { login: "3:06 PM", logout: "4:04 PM", hours: 0.96 }
          ],
          totalHours: 5.17,
          splitShift: false
        },
        {
          date: "08/05/23",
          shifts: [
            { login: "10:58 AM", logout: "3:17 PM", hours: 4.31 },
            { login: "4:04 PM", logout: "9:59 PM", hours: 5.93 }
          ],
          totalHours: 10.24,
          overtime: true
        },
        {
          date: "08/06/23",
          shifts: [
            { login: "10:54 AM", logout: "3:21 PM", hours: 4.45 },
            { login: "4:05 PM", logout: "9:51 PM", hours: 5.76 }
          ],
          totalHours: 10.21,
          overtime: true
        }
      ]
    },
    "08/14/2023 - 08/27/2023": {
      payStub: {
        checkNumber: "7676",
        regularHours: 57.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: [
        {
          date: "08/20/23",
          login: "11:00 AM",
          logout: "9:54 PM",
          hours: 10.90,
          overtime: true
        }
      ]
    },
    "08/28/2023 - 09/10/2023": {
      payStub: {
        checkNumber: "7692",
        regularHours: 50.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: []
    },
    "09/11/2023 - 09/24/2023": {
      payStub: {
        checkNumber: "7718",
        regularHours: 30.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: []
    },
    "09/25/2023 - 10/08/2023": {
      payStub: {
        checkNumber: "7729",
        regularHours: 43.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: []
    },
    "10/09/2023 - 10/22/2023": {
      payStub: {
        checkNumber: "7744",
        regularHours: 61.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: [
        {
          date: "10/15/23",
          login: "10:53 AM",
          logout: "9:51 PM",
          hours: 10.98,
          overtime: true
        }
      ]
    },
    "10/23/2023 - 11/05/2023": {
      payStub: {
        checkNumber: "7756",
        regularHours: 55.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: []
    },
    "11/06/2023 - 11/19/2023": {
      payStub: {
        checkNumber: "7769",
        regularHours: 50.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: []
    },
    "11/20/2023 - 12/03/2023": {
      payStub: {
        checkNumber: "7788",
        regularHours: 41.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: []
    },
    "12/04/2023 - 12/17/2023": {
      payStub: {
        checkNumber: "7803",
        regularHours: 48.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: []
    },
    "12/18/2023 - 12/31/2023": {
      payStub: {
        checkNumber: "7820", // This is a placeholder as it wasn't in the documents
        regularHours: 45.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: []
    },
    "01/01/2024 - 01/14/2024": {
      payStub: {
        checkNumber: "7835", // This is a placeholder as it wasn't in the documents
        regularHours: 40.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: []
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
        for (let i = 0; i < day.shifts.length - 1; i++) {
          const gap = calculateShiftGap(day.shifts[i].logout, day.shifts[i + 1].login);
          if (gap > 1) {
            splitShiftCount++;
            day.splitShift = true;
            break;
          }
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
        {/* Rest of the component remains the same */}
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
                  <div className="flex items-center gap-2 text-red-600">
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
                    for (let i = 0; i < day.shifts.length - 1; i++) {
                      const gap = calculateShiftGap(day.shifts[i].logout, day.shifts[i + 1].login);
                      if (gap > 1) {
                        isSplitShift = true;
                        break;
                      }
                    }
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
                          <div className="text-red-600">Split shift</div>
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