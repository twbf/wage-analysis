import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

const employeeData = {
  "Maria Miranda": {
    "11/17/2016 - 11/30/2016": {
      employeeInfo: {
        name: "MARIA MIRANDA",
        id: "90",
        position: "Dishwasher"
      },
      wageDetails: [
        { date: "11/19/16", shifts: [
          { login: "10:48 AM", logout: "3:31 PM", hours: 4.72 },
          { login: "4:21 PM", logout: "10:07 PM", hours: 5.76 }
        ]},
        { date: "11/26/16", shifts: [
          { login: "10:19 AM", logout: "3:28 PM", hours: 5.14 },
          { login: "4:31 PM", logout: "9:55 PM", hours: 5.39 }
        ]},
        // Regular shifts
        { date: "11/17/16", shifts: [{ login: "5:08 PM", logout: "10:16 PM", hours: 5.13 }]},
        { date: "11/18/16", shifts: [{ login: "4:47 PM", logout: "10:39 PM", hours: 5.85 }]},
        { date: "11/20/16", shifts: [{ login: "4:05 PM", logout: "9:42 PM", hours: 5.61 }]},
        { date: "11/22/16", shifts: [{ login: "4:29 PM", logout: "10:18 PM", hours: 5.82 }]},
        { date: "11/23/16", shifts: [{ login: "4:26 PM", logout: "10:33 PM", hours: 6.12 }]},
        { date: "11/25/16", shifts: [{ login: "4:26 PM", logout: "10:43 PM", hours: 6.29 }]},
        { date: "11/27/16", shifts: [{ login: "4:31 PM", logout: "10:09 PM", hours: 5.63 }]},
        { date: "11/29/16", shifts: [{ login: "4:30 PM", logout: "10:14 PM", hours: 5.74 }]},
        { date: "11/30/16", shifts: [{ login: "5:02 PM", logout: "10:18 PM", hours: 5.26 }]}
      ]
    },
    "12/01/2016 - 12/15/2016": {
      employeeInfo: {
        name: "MARIA MIRANDA",
        id: "90",
        position: "Dishwasher"
      },
      wageDetails: [
        { date: "12/10/16", shifts: [
          { login: "10:26 AM", logout: "3:38 PM", hours: 5.21 },
          { login: "4:30 PM", logout: "10:21 PM", hours: 5.85 }
        ]},
        { date: "12/03/16", shifts: [
          { login: "10:27 AM", logout: "3:37 PM", hours: 5.16 },
          { login: "4:36 PM", logout: "10:30 PM", hours: 5.90 }
        ]},
        { date: "12/17/16", shifts: [
          { login: "10:42 AM", logout: "3:24 PM", hours: 4.69 },
          { login: "4:31 PM", logout: "10:07 PM", hours: 5.60 }
        ]}
      ]
    }
  },
  "Maria Flor Argueta Vasquez": {
    "09/05/2022 - 09/18/2022": {
      employeeInfo: {
        name: "Maria Flor Argueta Vasquez",
        id: "***-**-7890",
        rate: 16.10,
        hours: 37.00,
        checkNumber: "9115"
      }
    },
    "09/19/2022 - 10/02/2022": {
      employeeInfo: {
        name: "Maria Flor Argueta Vasquez",
        id: "***-**-7890",
        rate: 16.10,
        hours: 68.00,
        checkNumber: "9124"
      }
    },
    "10/03/2022 - 10/16/2022": {
      employeeInfo: {
        name: "Maria Flor Argueta Vasquez",
        id: "***-**-7890",
        rate: 16.10,
        hours: 66.00,
        checkNumber: "9132"
      }
    }
  }
};

const WageAnalysisDashboard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(Object.keys(employeeData)[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(Object.keys(employeeData[Object.keys(employeeData)[0]])[0]);

  const timeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const getBreakDuration = (shift1End, shift2Start) => {
    const end = timeToMinutes(shift1End);
    const start = timeToMinutes(shift2Start);
    return (start - end) / 60;
  };

  const analyzeViolations = (period) => {
    const data = employeeData[selectedEmployee][period];
    if (!data.wageDetails) return { splitShifts: [], overtime: [], totalUnpaidWages: 0 };

    let violations = {
      splitShifts: [],
      overtime: [],
      totalUnpaidWages: 0
    };

    data.wageDetails.forEach(day => {
      // Check for split shifts
      if (day.shifts && day.shifts.length > 1) {
        for (let i = 0; i < day.shifts.length - 1; i++) {
          const breakDuration = getBreakDuration(day.shifts[i].logout, day.shifts[i + 1].login);
          if (breakDuration > 1) {
            violations.splitShifts.push({
              date: day.date,
              breakDuration: breakDuration.toFixed(2),
              firstShift: `${day.shifts[i].login} - ${day.shifts[i].logout}`,
              secondShift: `${day.shifts[i + 1].login} - ${day.shifts[i + 1].logout}`
            });
          }
        }
      }

      // Calculate total daily hours and check for overtime
      const totalDailyHours = day.shifts.reduce((total, shift) => total + shift.hours, 0);
      if (totalDailyHours > 8) {
        const overtimeHours = totalDailyHours - 8;
        violations.overtime.push({
          date: day.date,
          totalHours: totalDailyHours.toFixed(2),
          overtimeHours: overtimeHours.toFixed(2),
          unpaidWages: (overtimeHours * (data.employeeInfo.rate || 11.50) * 0.5).toFixed(2)
        });
        violations.totalUnpaidWages += overtimeHours * (data.employeeInfo.rate || 11.50) * 0.5;
      }
    });

    return violations;
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <div>Wage Analysis Dashboard</div>
            <div className="text-sm text-gray-500">
              Select Employee and Period:
            </div>
          </div>
          <div className="flex gap-4">
            <select 
              value={selectedEmployee}
              onChange={(e) => {
                setSelectedEmployee(e.target.value);
                setSelectedPeriod(Object.keys(employeeData[e.target.value])[0]);
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
              {Object.keys(employeeData[selectedEmployee]).map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {employeeData[selectedEmployee][selectedPeriod].employeeInfo && (
              <div className="border rounded p-4">
                <h3 className="font-bold mb-2">Employee Information</h3>
                <div className="space-y-2">
                  <p>Name: {employeeData[selectedEmployee][selectedPeriod].employeeInfo.name}</p>
                  <p>ID: {employeeData[selectedEmployee][selectedPeriod].employeeInfo.id}</p>
                  {employeeData[selectedEmployee][selectedPeriod].employeeInfo.rate && (
                    <p>Rate: ${employeeData[selectedEmployee][selectedPeriod].employeeInfo.rate}/hr</p>
                  )}
                  {employeeData[selectedEmployee][selectedPeriod].employeeInfo.checkNumber && (
                    <p>Check Number: {employeeData[selectedEmployee][selectedPeriod].employeeInfo.checkNumber}</p>
                  )}
                </div>
              </div>
            )}

            {employeeData[selectedEmployee][selectedPeriod].wageDetails && (
              <>
                <div className="border rounded p-4">
                  <h3 className="font-bold mb-2">Violations Summary</h3>
                  <div className="space-y-4">
                    {analyzeViolations(selectedPeriod).splitShifts.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-semibold text-amber-600">Split Shift Violations:</p>
                        {analyzeViolations(selectedPeriod).splitShifts.map((violation, idx) => (
                          <div key={idx} className="pl-4 border-l-2 border-amber-600">
                            <p>Date: {violation.date}</p>
                            <p>Break Duration: {violation.breakDuration} hours</p>
                            <p>Shifts: {violation.firstShift} and {violation.secondShift}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {analyzeViolations(selectedPeriod).overtime.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-semibold text-red-600">Overtime Violations:</p>
                        {analyzeViolations(selectedPeriod).overtime.map((violation, idx) => (
                          <div key={idx} className="pl-4 border-l-2 border-red-600">
                            <p>Date: {violation.date}</p>
                            <p>Total Hours: {violation.totalHours}</p>
                            <p>Overtime Hours: {violation.overtimeHours}</p>
                            <p>Unpaid Wages: ${violation.unpaidWages}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {analyzeViolations(selectedPeriod).totalUnpaidWages > 0 && (
                      <div className="mt-4 font-bold text-red-600">
                        Total Unpaid Wages for Period: ${analyzeViolations(selectedPeriod).totalUnpaidWages.toFixed(2)}
                      </div>
                    )}

                    {analyzeViolations(selectedPeriod).splitShifts.length === 0 && 
                     analyzeViolations(selectedPeriod).overtime.length === 0 && (
                      <p className="text-green-600">No violations found for this period.</p>
                    )}
                  </div>
                </div>

                <div className="border rounded p-4">
                  <h3 className="font-bold mb-4">Detailed Time Records</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="p-2">Date</th>
                        <th className="p-2">Shifts</th>
                        <th className="p-2">Total Hours</th>
                        <th className="p-2">Issues</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeData[selectedEmployee][selectedPeriod].wageDetails.map((day, index) => {
                        const totalHours = day.shifts.reduce((sum, shift) => sum + shift.hours, 0);
                        const overtime = totalHours > 8;
                        const splitShift = day.shifts.length > 1 && getBreakDuration(day.shifts[0].logout, day.shifts[1].login) > 1;

                        return (
                          <tr key={index} className={`border-b ${overtime ? 'bg-red-50' : ''} ${splitShift ? 'bg-amber-50' : ''}`}>
                            <td className="p-2">{day.date}</td>
                            <td className="p-2">
                              {day.shifts.map((shift, idx) => (
                                <div key={idx}>
                                  {shift.login} - {shift.logout}
                                </div>
                              ))}
                            </td>
                            <td className="p-2">{totalHours.toFixed(2)}</td>
                            <td className="p-2">
                              {overtime && (
                                <div className="text-red-600">
                                  {(totalHours - 8).toFixed(2)} hours overtime
                                </div>
                              )}
                              {splitShift && (
                                <div className="text-amber-600">
                                  Split shift violation
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WageAnalysisDashboard;