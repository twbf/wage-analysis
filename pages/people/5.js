import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

const employeeConfig = {
  name: "MARITZA ROXANA GARCIA SUNUN",
  id: "***-**-0581",
  address: "1111 dayton street",
  city: "Silver spring",
  state: "MD",
  zip: "20902"
};

const WageViolationsDashboard = () => {
  const payPeriods = {
    "05/08/2023 - 05/21/2023": {
      payStub: {
        checkNumber: "7552",
        regularHours: 64.00,
        overtimeHours: 0,
        rate: 16.50
      },
      wageDetails: [
        {
          date: "05/08/23",
          hours: 8.5,
          login: "9:00 AM",
          logout: "5:30 PM",
          overtime: true
        },
        {
          date: "05/09/23",
          hours: 8.75,
          login: "8:45 AM",
          logout: "5:30 PM",
          overtime: true
        },
        {
          date: "05/10/23",
          shifts: [
            { login: "9:00 AM", logout: "11:00 AM", hours: 2.0 },
            { login: "2:00 PM", logout: "6:00 PM", hours: 4.0 }
          ],
          totalHours: 6.0,
          splitShift: true
        },
        {
          date: "05/11/23",
          hours: 8.5,
          login: "9:00 AM",
          logout: "5:30 PM",
          overtime: true
        }
      ]
    },
    "05/22/2023 - 06/04/2023": {
      payStub: {
        checkNumber: "7553",
        regularHours: 13.00,
        overtimeHours: 0,
        rate: 16.50
      },
      wageDetails: [
        {
          date: "05/22/23",
          hours: 8.5,
          login: "8:30 AM",
          logout: "5:00 PM",
          overtime: true
        },
        {
          date: "05/23/23",
          shifts: [
            { login: "9:00 AM", logout: "11:30 AM", hours: 2.5 },
            { login: "1:30 PM", logout: "6:00 PM", hours: 4.5 }
          ],
          totalHours: 7.0,
          splitShift: true
        }
      ]
    }
  };

  const [selectedPeriod, setSelectedPeriod] = useState(Object.keys(payPeriods)[0]);

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

  const getViolationsSummary = (period) => {
    const data = payPeriods[period];
    let overtimeCount = 0;
    let splitShiftCount = 0;
    let totalOvertimeHours = 0;
    let totalUnpaidWages = 0;
    
    data.wageDetails.forEach(day => {
      if (day.overtime) {
        overtimeCount++;
        const overtimeHours = day.hours - 8;
        totalOvertimeHours += overtimeHours;
        totalUnpaidWages += overtimeHours * (data.payStub.rate * 1.5);
      }
      
      if (day.splitShift) {
        splitShiftCount++;
      }
    });

    return {
      overtimeCount,
      splitShiftCount,
      totalOvertimeHours,
      totalUnpaidWages
    };
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <div>Wage Violations Dashboard - {employeeConfig.name}</div>
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
                <p>Overtime Hours Paid: {payPeriods[selectedPeriod].payStub.overtimeHours}</p>
                <p>Rate: ${payPeriods[selectedPeriod].payStub.rate}/hr</p>
              </div>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-bold mb-2">Violations Summary</h3>
              <div className="space-y-2">
                {getViolationsSummary(selectedPeriod).overtimeCount > 0 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle size={16} />
                    <div>
                      <p>{getViolationsSummary(selectedPeriod).overtimeCount} days with unpaid overtime</p>
                      <p className="text-sm">
                        Total: {getViolationsSummary(selectedPeriod).totalOvertimeHours.toFixed(2)} overtime hours
                        (${getViolationsSummary(selectedPeriod).totalUnpaidWages.toFixed(2)} unpaid)
                      </p>
                    </div>
                  </div>
                )}
                {getViolationsSummary(selectedPeriod).splitShiftCount > 0 && (
                  <div className="flex items-center gap-2 text-amber-600">
                    <Clock size={16} />
                    <p>{getViolationsSummary(selectedPeriod).splitShiftCount} days with split shifts</p>
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
                  <th className="p-2">Violations</th>
                </tr>
              </thead>
              <tbody>
                {payPeriods[selectedPeriod].wageDetails.map((day, index) => (
                  <tr key={index} className={`border-b ${(day.overtime || day.splitShift) ? 'bg-red-50' : ''}`}>
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
                          {(day.hours - 8).toFixed(2)} hours overtime not paid
                        </div>
                      )}
                      {day.splitShift && (
                        <div className="text-amber-600">
                          Split shift violation
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WageViolationsDashboard;