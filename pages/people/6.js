import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

const employeeConfig = {
  name: "AREVALO ANDERSON",
  id: "195",
  address: "727 NORTON STREET NW",
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

  const calculateShiftGap = (shift1End, shift2Start) => {
    const endMinutes = timeToMinutes(shift1End);
    const startMinutes = timeToMinutes(shift2Start);
    return (startMinutes - endMinutes) / 60;
  };

  const payPeriods = {
    "05/22/2023 - 06/04/2023": {
      payStub: {
        checkNumber: "7586",
        regularHours: 11.00,
        overtimeHours: 0,
        rate: 16.50
      },
      wageDetails: [
        {
          date: "06/02/23",
          login: "11:56 AM",
          logout: "3:03 PM",
          hours: 3.11,
          overtime: false
        },
        {
          date: "06/03/23",
          login: "11:07 AM",
          logout: "3:01 PM",
          hours: 3.91,
          overtime: false
        }
      ]
    },
    "06/05/2023 - 06/18/2023": {
      payStub: {
        checkNumber: "7590",
        regularHours: 39.00,
        overtimeHours: 0,
        rate: 16.50
      },
      wageDetails: [
        {
          date: "06/06/23",
          login: "10:56 AM",
          logout: "3:00 PM",
          hours: 4.08,
          overtime: false
        },
        {
          date: "06/07/23",
          login: "11:17 AM",
          logout: "3:08 PM",
          hours: 3.84,
          overtime: false
        },
        {
          date: "06/08/23",
          login: "11:25 AM",
          logout: "3:04 PM",
          hours: 3.65,
          overtime: false
        },
        {
          date: "06/09/23",
          login: "11:06 AM",
          logout: "2:59 PM",
          hours: 3.88,
          overtime: false
        },
        {
          date: "06/10/23",
          login: "10:48 AM",
          logout: "3:16 PM",
          hours: 4.46,
          overtime: false
        },
        {
          date: "06/13/23",
          login: "10:57 AM",
          logout: "3:06 PM",
          hours: 4.14,
          overtime: false
        },
        {
          date: "06/14/23",
          login: "11:02 AM",
          logout: "3:03 PM",
          hours: 4.02,
          overtime: false
        },
        {
          date: "06/15/23",
          login: "11:05 AM",
          logout: "3:13 PM",
          hours: 4.13,
          overtime: false
        },
        {
          date: "06/16/23",
          login: "12:11 PM",
          logout: "2:59 PM",
          hours: 2.80,
          overtime: false
        },
        {
          date: "06/17/23",
          login: "11:10 AM",
          logout: "3:00 PM",
          hours: 3.84,
          overtime: false
        }
      ]
    },
    "06/19/2023 - 07/02/2023": {
      payStub: {
        checkNumber: "7604",
        regularHours: 28.00,
        overtimeHours: 0,
        rate: 16.50
      },
      wageDetails: [
        {
          date: "06/20/23",
          login: "11:08 AM",
          logout: "3:04 PM",
          hours: 3.95,
          overtime: false
        },
        {
          date: "06/21/23",
          login: "12:55 PM",
          logout: "3:06 PM",
          hours: 2.18,
          overtime: false
        },
        {
          date: "06/23/23",
          login: "11:15 AM",
          logout: "3:01 PM",
          hours: 3.76,
          overtime: false
        },
        {
          date: "06/27/23",
          login: "11:07 AM",
          logout: "2:55 PM",
          hours: 3.79,
          overtime: false
        },
        {
          date: "06/28/23",
          login: "11:11 AM",
          logout: "3:01 PM",
          hours: 3.84,
          overtime: false
        },
        {
          date: "06/29/23",
          login: "11:50 AM",
          logout: "3:04 PM",
          hours: 3.23,
          overtime: false
        },
        {
          date: "06/30/23",
          login: "11:10 AM",
          logout: "3:01 PM",
          hours: 3.84,
          overtime: false
        },
        {
          date: "07/01/23",
          login: "12:00 PM",
          logout: "3:18 PM",
          hours: 3.30,
          overtime: false
        }
      ]
    },
    "07/03/2023 - 07/16/2023": {
      payStub: {
        checkNumber: "7618",
        regularHours: 9.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: [
        {
          date: "07/04/23",
          login: "10:34 AM",
          logout: "1:01 PM",
          hours: 2.45,
          overtime: false
        },
        {
          date: "07/05/23",
          login: "12:29 PM",
          logout: "3:02 PM",
          hours: 2.55,
          overtime: false
        },
        {
          date: "07/06/23",
          login: "11:15 AM",
          logout: "2:53 PM",
          hours: 3.63,
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
    let splitShiftDates = [];
    let overtimeDates = [];
    
    data.wageDetails.forEach(day => {
      if (day.shifts) {
        const gap = calculateShiftGap(day.shifts[0].logout, day.shifts[1].login);
        if (gap > 1) {
          splitShiftCount++;
          splitShiftDates.push(day.date);
        }
      }

      const totalHours = day.hours || (day.shifts ? day.shifts.reduce((acc, shift) => acc + shift.hours, 0) : 0);
      if (totalHours > 8) {
        overtimeCount++;
        overtimeDates.push(day.date);
        totalOvertimeHours += totalHours - 8;
      }
    });

    return {
      overtimeCount,
      splitShiftCount,
      totalOvertimeHours,
      splitShiftDates,
      overtimeDates
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
                      <p>{getDiscrepancySummary(selectedPeriod).overtimeCount} days with overtime</p>
                      <p className="text-sm">{getDiscrepancySummary(selectedPeriod).totalOvertimeHours.toFixed(2)} total overtime hours</p>
                      <p className="text-sm">Dates: {getDiscrepancySummary(selectedPeriod).overtimeDates.join(', ')}</p>
                    </div>
                  </div>
                )}
                {getDiscrepancySummary(selectedPeriod).splitShiftCount > 0 && (
                  <div className="flex items-center gap-2 text-amber-600">
                    <Clock size={16} />
                    <div>
                      <p>{getDiscrepancySummary(selectedPeriod).splitShiftCount} days with split shifts</p>
                      <p className="text-sm">Dates: {getDiscrepancySummary(selectedPeriod).splitShiftDates.join(', ')}</p>
                    </div>
                  </div>
                )}
                {getDiscrepancySummary(selectedPeriod).overtimeCount === 0 && 
                 getDiscrepancySummary(selectedPeriod).splitShiftCount === 0 && (
                  <p className="text-green-600">No overtime or split shifts in this period</p>
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
                  const totalHours = day.hours || (day.shifts ? day.shifts.reduce((acc, shift) => acc + shift.hours, 0) : 0);
                  const hasOvertime = totalHours > 8;
                  let isSplitShift = false;
                  if (day.shifts && day.shifts.length > 1) {
                    const gap = calculateShiftGap(day.shifts[0].logout, day.shifts[1].login);
                    isSplitShift = gap > 1;
                  }

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
                      <td className="p-2">{totalHours.toFixed(2)}</td>
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