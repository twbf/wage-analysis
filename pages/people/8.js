import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

const employeeConfig = {
  name: "PEDRO SALGADO",
  id: "204",
  address: "3537 11 ST NW #202",
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

  const calculateShiftGap = (shift1End, shift2Start) => {
    const endMinutes = timeToMinutes(shift1End);
    const startMinutes = timeToMinutes(shift2Start);
    return (startMinutes - endMinutes) / 60;
  };

  const payPeriods = {
    "07/03/2023 - 07/16/2023": {
      payStub: {
        checkNumber: "7627",
        regularHours: 22.00,
        rate: 17.00,
        totalPay: 374.00
      },
      wageDetails: [
        {
          date: "07/14/23",
          login: "10:57 AM",
          logout: "3:14 PM",
          hours: 4.28,
          regularWages: 72.73
        },
        {
          date: "07/18/23",
          login: "11:18 AM",
          logout: "3:11 PM",
          hours: 3.90,
          regularWages: 66.24
        },
        {
          date: "07/19/23",
          login: "10:50 AM",
          logout: "3:26 PM",
          hours: 4.60,
          regularWages: 78.19
        },
        {
          date: "07/20/23",
          login: "11:04 AM",
          logout: "3:11 PM",
          hours: 4.12,
          regularWages: 70.07
        },
        {
          date: "07/21/23",
          login: "11:00 AM",
          logout: "3:10 PM",
          hours: 4.16,
          regularWages: 70.75
        }
      ]
    },
    "07/17/2023 - 07/30/2023": {
      payStub: {
        checkNumber: "7642",
        regularHours: 17.00,
        rate: 17.00,
        totalPay: 289.00
      },
      wageDetails: [
        {
          date: "07/18/23",
          login: "11:18 AM",
          logout: "3:11 PM",
          hours: 3.90,
          regularWages: 66.24
        },
        {
          date: "07/19/23",
          login: "10:50 AM",
          logout: "3:26 PM",
          hours: 4.60,
          regularWages: 78.19
        },
        {
          date: "07/20/23",
          login: "11:04 AM",
          logout: "3:11 PM",
          hours: 4.12,
          regularWages: 70.07
        },
        {
          date: "07/21/23",
          login: "11:00 AM",
          logout: "3:10 PM",
          hours: 4.16,
          regularWages: 70.75
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
        overtimeHours += (totalHours - 8);
        overtimeDays.push({
          date: day.date,
          hours: totalHours - 8
        });
      }
      
      if (day.shifts && day.shifts.length > 1) {
        const gap = calculateShiftGap(day.shifts[0].logout, day.shifts[1].login);
        if (gap > 1) {
          splitShiftDays.push({
            date: day.date,
            gap: gap.toFixed(2)
          });
        }
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
                {getDiscrepancySummary(selectedPeriod).splitShiftDays.length > 0 && (
                  <div className="flex items-center gap-2 text-amber-600">
                    <Clock size={16} />
                    <p>{getDiscrepancySummary(selectedPeriod).splitShiftDays.length} days with split shifts</p>
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
                  const hours = day.hours;
                  const overtime = hours > 8;
                  const splitShift = day.shifts && day.shifts.length > 1 && 
                    calculateShiftGap(day.shifts[0].logout, day.shifts[1].login) > 1;

                  return (
                    <tr key={index} className={`border-b ${(overtime || splitShift) ? 'bg-red-50' : ''}`}>
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
                      <td className="p-2">{hours}</td>
                      <td className="p-2">${day.regularWages}</td>
                      <td className="p-2">
                        {overtime && (
                          <div className="text-red-600">
                            {(hours - 8).toFixed(2)} hours overtime not paid
                          </div>
                        )}
                        {splitShift && (
                          <div className="text-amber-600">
                            Split shift gap: {calculateShiftGap(day.shifts[0].logout, day.shifts[1].login).toFixed(2)} hours
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