import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

const employeeData = {
  "MAURICIO RUBIO": {
    id: "170",
    payPeriods: {
      "12/28/2021 - 01/09/2022": {
        payStub: {
          regularHours: 63.79,
          rate: 11.49, // Calculated from hours and wages
          totalPay: 733.56
        },
        wageDetails: [
          {
            date: "12/28/21",
            login: "5:40 PM",
            logout: "9:28 PM",
            hours: 3.81,
            regularWages: 43.77
          },
          {
            date: "12/29/21",
            login: "4:18 PM",
            logout: "9:26 PM",
            hours: 5.13,
            regularWages: 58.97
          },
          {
            date: "12/30/21",
            login: "4:12 PM",
            logout: "10:03 PM",
            hours: 5.87,
            regularWages: 67.45
          },
          {
            date: "12/31/21",
            login: "3:57 PM",
            logout: "9:56 PM",
            hours: 5.99,
            regularWages: 68.83
          },
          {
            date: "01/01/22",
            login: "4:18 PM",
            logout: "9:02 PM",
            hours: 4.74,
            regularWages: 54.48
          },
          {
            date: "01/02/22",
            login: "3:55 PM",
            logout: "9:12 PM",
            hours: 5.28,
            regularWages: 60.69
          },
          {
            date: "01/04/22",
            login: "4:23 PM",
            logout: "9:22 PM",
            hours: 4.97,
            regularWages: 57.13
          },
          {
            date: "01/05/22",
            login: "4:09 PM",
            logout: "9:35 PM",
            hours: 5.42,
            regularWages: 62.38
          },
          {
            date: "01/06/22",
            login: "4:18 PM",
            logout: "10:01 PM",
            hours: 5.71,
            regularWages: 65.65
          },
          {
            date: "01/07/22",
            login: "3:32 PM",
            logout: "9:38 PM",
            hours: 6.10,
            regularWages: 70.16
          },
          {
            date: "01/08/22",
            login: "4:29 PM",
            logout: "9:51 PM",
            hours: 5.37,
            regularWages: 61.77
          },
          {
            date: "01/09/22",
            login: "4:00 PM",
            logout: "9:25 PM",
            hours: 5.42,
            regularWages: 62.28
          }
        ]
      }
    }
  },
  "LUCIO GOMEZ": {
    id: "***-**-4142",
    payPeriods: {
      "11/07/2022 - 11/20/2022": {
        payStub: {
          checkNumber: "7308",
          regularHours: 45.00,
          rate: 16.10,
          totalPay: 724.50
        }
      },
      "11/21/2022 - 12/04/2022": {
        payStub: {
          checkNumber: "7322",
          regularHours: 46.00,
          rate: 16.10,
          totalPay: 740.60
        }
      },
      "12/05/2022 - 12/18/2022": {
        payStub: {
          checkNumber: "7345",
          regularHours: 50.00,
          rate: 16.10,
          totalPay: 805.00
        }
      }
    }
  }
};

const WageAnalysisDashboard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(Object.keys(employeeData)[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(Object.keys(employeeData[Object.keys(employeeData)[0]].payPeriods)[0]);

  const timeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const getTimeDifference = (start, end) => {
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    return (endMinutes - startMinutes) / 60;
  };

  const getDiscrepancySummary = (employee, period) => {
    const data = employeeData[employee].payPeriods[period];
    if (!data.wageDetails) {
      return {
        overtimeHours: 0,
        overtimeDays: [],
        splitShiftDays: [],
        totalUnpaidWages: 0
      };
    }

    let overtimeHours = 0;
    let overtimeDays = [];
    let splitShiftDays = [];
    
    data.wageDetails.forEach(day => {
      // Check for overtime (over 8 hours)
      const totalHours = day.hours;
      if (totalHours > 8) {
        const overtimeAmount = totalHours - 8;
        overtimeHours += overtimeAmount;
        overtimeDays.push({
          date: day.date,
          hours: overtimeAmount.toFixed(2)
        });
      }

      // Split shift detection (more than 1 hour break between shifts)
      const timeGaps = getTimeDifference(day.login, day.logout);
      if (timeGaps > 1) {
        splitShiftDays.push({
          date: day.date,
          gap: timeGaps.toFixed(2)
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
            <div>Wage Analysis Dashboard</div>
            <div className="text-sm text-gray-500">
              Employee: {selectedEmployee} | ID: {employeeData[selectedEmployee].id}
            </div>
          </div>
          <div className="flex gap-4">
            <select 
              value={selectedEmployee}
              onChange={(e) => {
                setSelectedEmployee(e.target.value);
                setSelectedPeriod(Object.keys(employeeData[e.target.value].payPeriods)[0]);
              }}
              className="p-2 border rounded"
            >
              {Object.keys(employeeData).map(emp => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="p-2 border rounded"
            >
              {Object.keys(employeeData[selectedEmployee].payPeriods).map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded p-4">
              <h3 className="font-bold mb-2">Pay Period Details</h3>
              <div className="space-y-2">
                <p>Pay Period: {selectedPeriod}</p>
                <p>Regular Hours: {employeeData[selectedEmployee].payPeriods[selectedPeriod].payStub.regularHours}</p>
                <p>Rate: ${employeeData[selectedEmployee].payPeriods[selectedPeriod].payStub.rate}/hr</p>
                <p>Total Pay: ${employeeData[selectedEmployee].payPeriods[selectedPeriod].payStub.totalPay}</p>
              </div>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-bold mb-2">Period Summary</h3>
              <div className="space-y-2">
                {getDiscrepancySummary(selectedEmployee, selectedPeriod).overtimeDays.length > 0 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle size={16} />
                    <div>
                      <p>{getDiscrepancySummary(selectedEmployee, selectedPeriod).overtimeDays.length} days with overtime</p>
                      <p className="text-sm">Total: {getDiscrepancySummary(selectedEmployee, selectedPeriod).overtimeHours} overtime hours</p>
                      <p className="text-sm">Unpaid wages: ${getDiscrepancySummary(selectedEmployee, selectedPeriod).totalUnpaidWages}</p>
                    </div>
                  </div>
                )}
                {getDiscrepancySummary(selectedEmployee, selectedPeriod).splitShiftDays.length > 0 && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <Clock size={16} />
                    <div>
                      <p>{getDiscrepancySummary(selectedEmployee, selectedPeriod).splitShiftDays.length} split shifts detected</p>
                      {getDiscrepancySummary(selectedEmployee, selectedPeriod).splitShiftDays.map((day, idx) => (
                        <p key={idx} className="text-sm">
                          {day.date}: {day.gap} hour gap
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {employeeData[selectedEmployee].payPeriods[selectedPeriod].wageDetails && (
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
                  {employeeData[selectedEmployee].payPeriods[selectedPeriod].wageDetails.map((day, index) => {
                    const overtime = day.hours > 8;
                    const splitShift = getTimeDifference(day.login, day.logout) > 1;

                    return (
                      <tr key={index} className={`border-b ${overtime || splitShift ? 'bg-red-50' : ''}`}>
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WageAnalysisDashboard;