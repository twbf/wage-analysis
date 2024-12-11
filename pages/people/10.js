import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

const employeeConfig = {
  name: "JAIRA MELISSA DELCID",
  id: "119",
  address: "8523 GARLAND AVE #209",
  city: "TAKOMA PARK",
  state: "MD",
  zip: "20962"
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

  const payPeriods = {
    "02/04/2019 - 02/17/2019": {
      payStub: {
        checkNumber: "6252",
        regularHours: 78.00,
        rate: 13.50,
        totalPay: 1053.00
      },
      wageDetails: [
        {
          date: "02/05/19",
          shifts: [
            { login: "10:22 AM", logout: "3:28 PM" },
            { login: "2:35 PM", logout: "10:11 PM" }
          ],
          totalHours: 12.72,
          regularWages: 171.69,
          isSplitShift: true,
          overtime: 4.72
        },
        {
          date: "02/12/19",
          shifts: [
            { login: "10:29 AM", logout: "4:11 PM" },
            { login: "4:31 PM", logout: "10:04 PM" }
          ],
          totalHours: 11.25,
          regularWages: 151.89,
          isSplitShift: false,
          overtime: 3.25
        }
      ]
    },
    "02/18/2019 - 03/03/2019": {
      payStub: {
        checkNumber: "6258",
        regularHours: 78.00,
        rate: 13.50,
        totalPay: 1053.00
      },
      wageDetails: [
        {
          date: "02/19/19",
          shifts: [
            { login: "10:28 AM", logout: "3:36 PM" },
            { login: "4:39 PM", logout: "10:41 PM" }
          ],
          totalHours: 11.18,
          regularWages: 150.95,
          isSplitShift: true,
          overtime: 3.18
        }
      ]
    },
    "03/04/2019 - 03/17/2019": {
      payStub: {
        checkNumber: "6280",
        regularHours: 0.00,
        rate: 13.50,
        totalPay: 0.00,
        void: true
      },
      wageDetails: [
        {
          date: "03/05/19",
          shifts: [
            { login: "10:29 AM", logout: "5:29 PM" }
          ],
          totalHours: 7.00,
          regularWages: 94.50,
          isSplitShift: false,
          overtime: 0
        },
        {
          date: "03/08/19",
          shifts: [
            { login: "10:50 AM", logout: "7:00 PM" }
          ],
          totalHours: 8.17,
          regularWages: 110.33,
          isSplitShift: false,
          overtime: 0.17
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
      if (day.overtime > 0) {
        overtimeHours += day.overtime;
        overtimeDays.push({
          date: day.date,
          hours: day.overtime.toFixed(2)
        });
      }
      
      if (day.isSplitShift) {
        splitShiftDays.push({
          date: day.date,
          shifts: day.shifts
        });
      }
    });

    return {
      overtimeHours: overtimeHours.toFixed(2),
      overtimeDays,
      splitShiftDays,
      totalUnpaidWages: (overtimeHours * data.payStub.rate * 0.5).toFixed(2)
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
                {payPeriods[selectedPeriod].payStub.void && 
                  <p className="text-red-600 font-bold">VOID</p>
                }
              </div>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-bold mb-2">Period Summary</h3>
              <div className="space-y-2">
                {getDiscrepancySummary(selectedPeriod).overtimeDays.length > 0 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle size={16} />
                    <div>
                      <p>{getDiscrepancySummary(selectedPeriod).overtimeDays.length} days with overtime</p>
                      <p className="text-sm">Total: {getDiscrepancySummary(selectedPeriod).overtimeHours} overtime hours</p>
                      <p className="text-sm">Unpaid overtime wages: ${getDiscrepancySummary(selectedPeriod).totalUnpaidWages}</p>
                    </div>
                  </div>
                )}
                {getDiscrepancySummary(selectedPeriod).splitShiftDays.length > 0 && (
                  <div className="flex items-center gap-2 text-orange-600 mt-2">
                    <Clock size={16} />
                    <div>
                      <p>{getDiscrepancySummary(selectedPeriod).splitShiftDays.length} days with split shifts</p>
                    </div>
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
                  return (
                    <tr key={index} className={`border-b ${day.overtime > 0 || day.isSplitShift ? 'bg-red-50' : ''}`}>
                      <td className="p-2">{day.date}</td>
                      <td className="p-2">
                        {day.shifts.map((shift, idx) => (
                          <div key={idx}>
                            {shift.login} - {shift.logout}
                          </div>
                        ))}
                      </td>
                      <td className="p-2">{day.totalHours}</td>
                      <td className="p-2">${day.regularWages}</td>
                      <td className="p-2">
                        {day.overtime > 0 && (
                          <div className="text-red-600">
                            {day.overtime.toFixed(2)} hours overtime not paid at 1.5x rate
                          </div>
                        )}
                        {day.isSplitShift && (
                          <div className="text-orange-600">
                            Split shift
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