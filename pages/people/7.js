import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

const employeeConfig = {
  name: "MELKI FUENTES SEVEK",
  id: "203",
  address: "2801 15 STREET NW #510",
  city: "WASHINGTON",
  state: "DC",
  zip: "20009"
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

  const calculateHours = (startTime, endTime) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    return (endMinutes - startMinutes) / 60;
  };

  const payPeriods = {
    "07/03/2023 - 07/16/2023": {
      payStub: {
        checkNumber: "7630",
        regularHours: 69.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: [
        {
          date: "07/08/23",
          shifts: [
            { login: "4:41 PM", logout: "4:41 PM", hours: 0.00 },
            { login: "4:41 PM", logout: "10:03 PM", hours: 5.37 },
            { login: "10:04 PM", logout: "10:04 PM", hours: 0.00 }
          ],
          totalHours: 5.37,
          splitShift: false
        },
        {
          date: "07/09/23",
          login: "12:05 PM",
          logout: "10:35 PM",
          hours: 10.49,
          overtime: true
        }
      ]
    },
    "07/17/2023 - 07/30/2023": {
      payStub: {
        checkNumber: "7641",
        regularHours: 63.00,
        overtimeHours: 0,
        rate: 17.00
      },
      wageDetails: [
        {
          date: "07/22/23",
          shifts: [
            { login: "11:25 AM", logout: "2:58 PM", hours: 3.56 },
            { login: "4:08 PM", logout: "10:42 PM", hours: 6.56 }
          ],
          totalHours: 10.12,
          splitShift: true,
          overtime: true
        },
        {
          date: "07/23/23",
          shifts: [
            { login: "11:58 AM", logout: "3:09 PM", hours: 3.18 },
            { login: "4:11 PM", logout: "10:05 PM", hours: 4.99 }
          ],
          totalHours: 8.17,
          splitShift: true,
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
      if (day.overtime || (day.hours && day.hours > 8)) {
        overtimeCount++;
        const totalHours = day.hours || day.totalHours;
        totalOvertimeHours += Math.max(0, totalHours - 8);
      }
      
      if (day.shifts && day.shifts.length > 1) {
        let isSplitShift = false;
        for (let i = 0; i < day.shifts.length - 1; i++) {
          const gap = calculateShiftGap(day.shifts[i].logout, day.shifts[i + 1].login);
          if (gap > 1) {
            isSplitShift = true;
            break;
          }
        }
        if (isSplitShift) {
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
                <p>Overtime Hours Reported: {payPeriods[selectedPeriod].payStub.overtimeHours}</p>
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
                  const totalHours = day.hours || day.totalHours;
                  const isOvertime = totalHours > 8;
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
                    <tr key={index} className={`border-b ${(isOvertime || isSplitShift) ? 'bg-red-50' : ''}`}>
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
                        {isOvertime && (
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