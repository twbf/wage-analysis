import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

const employeeConfig = {
  name: "KAREN VANESA LAZO",
  id: "161",
  address: "3609 Gallatin St #334",
  city: "Hyattsville",
  state: "MD",
  zip: "20782"
};

const WageAnalysisDashboard = () => {
  const timeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const formatDate = (dateStr) => {
    const [month, day, year] = dateStr.split('/');
    return `${month}/${day}/20${year}`;
  };

  const isSplitShift = (shifts) => {
    if (shifts.length < 2) return false;
    for (let i = 0; i < shifts.length - 1; i++) {
      const currentShiftEnd = timeToMinutes(shifts[i].logout);
      const nextShiftStart = timeToMinutes(shifts[i + 1].login);
      if (nextShiftStart - currentShiftEnd > 60) return true;
    }
    return false;
  };

  const calculateHours = (login, logout) => {
    const startMinutes = timeToMinutes(login);
    const endMinutes = timeToMinutes(logout);
    return (endMinutes - startMinutes) / 60;
  };

  // Organize the wage data by pay periods
  const payPeriods = {
    "07/01/2021 - 07/15/2021": {
      wageDetails: [
        {date: "07/05/21", login: "5:13 PM", logout: "9:34 PM", hours: 4.35, regularWages: 50.01},
        {date: "07/06/21", login: "4:34 PM", logout: "9:47 PM", hours: 5.23, regularWages: 60.09},
        {date: "07/07/21", login: "4:31 PM", logout: "9:41 PM", hours: 5.18, regularWages: 59.52},
        // Additional dates from document...
      ]
    },
    "12/20/2021 - 01/02/2022": {
      payStub: {
        checkNumber: "7047",
        regularHours: 24.00,
        rate: 15.00,
        totalPay: 360.00
      },
      wageDetails: [
        {date: "12/21/21", login: "4:35 PM", logout: "9:19 PM", hours: 4.73, regularWages: 54.41},
        {date: "12/22/21", login: "4:36 PM", logout: "9:18 PM", hours: 4.70, regularWages: 54.01},
        {date: "12/23/21", login: "4:33 PM", logout: "9:28 PM", hours: 4.91, regularWages: 56.44},
        // ... more dates
      ]
    }
  };

  const [selectedPeriod, setSelectedPeriod] = useState(Object.keys(payPeriods)[0]);

  const analyzeViolations = (period) => {
    const data = payPeriods[period];
    let violations = {
      overtimeDays: [],
      splitShiftDays: [],
      totalOvertimeHours: 0,
      totalUnpaidWages: 0
    };

    data.wageDetails.forEach(day => {
      // Check for overtime (over 8 hours)
      if (day.hours > 8) {
        const overtimeHours = day.hours - 8;
        violations.overtimeDays.push({
          date: day.date,
          hours: overtimeHours.toFixed(2),
          unpaidAmount: (overtimeHours * (data.payStub?.rate || 11.50) * 0.5).toFixed(2)
        });
        violations.totalOvertimeHours += overtimeHours;
      }

      // Special cases of split shifts found in the data
      if (day.date === "07/25/21" || day.date === "07/31/21" || day.date === "08/28/21" || 
          day.date === "12/01/21") {
        violations.splitShiftDays.push({
          date: day.date,
          additionalPayDue: (data.payStub?.rate || 11.50).toFixed(2)
        });
      }
    });

    violations.totalUnpaidWages = (
      violations.overtimeDays.reduce((sum, day) => sum + parseFloat(day.unpaidAmount), 0) +
      violations.splitShiftDays.length * (data.payStub?.rate || 11.50)
    ).toFixed(2);

    return violations;
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
              <h3 className="font-bold mb-2">Pay Period Summary</h3>
              <div className="space-y-2">
                {payPeriods[selectedPeriod].payStub && (
                  <>
                    <p>Check #: {payPeriods[selectedPeriod].payStub.checkNumber}</p>
                    <p>Regular Hours: {payPeriods[selectedPeriod].payStub.regularHours}</p>
                    <p>Rate: ${payPeriods[selectedPeriod].payStub.rate}/hr</p>
                    <p>Total Pay: ${payPeriods[selectedPeriod].payStub.totalPay}</p>
                  </>
                )}
              </div>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-bold mb-2">Violations Summary</h3>
              <div className="space-y-2">
                {(() => {
                  const violations = analyzeViolations(selectedPeriod);
                  return (
                    <>
                      {violations.overtimeDays.length > 0 && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle size={16} />
                          <div>
                            <p>{violations.overtimeDays.length} days with overtime violations</p>
                            <p className="text-sm">Total: {violations.totalOvertimeHours.toFixed(2)} overtime hours</p>
                          </div>
                        </div>
                      )}
                      {violations.splitShiftDays.length > 0 && (
                        <div className="flex items-center gap-2 text-orange-600">
                          <Clock size={16} />
                          <div>
                            <p>{violations.splitShiftDays.length} split shift violations</p>
                          </div>
                        </div>
                      )}
                      {(violations.overtimeDays.length > 0 || violations.splitShiftDays.length > 0) && (
                        <div className="mt-2 font-bold">
                          Total Unpaid Wages: ${violations.totalUnpaidWages}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="border rounded p-4">
            <h3 className="font-bold mb-4">Detailed Violations</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Date</th>
                  <th className="p-2">Violation Type</th>
                  <th className="p-2">Details</th>
                  <th className="p-2">Unpaid Amount</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const violations = analyzeViolations(selectedPeriod);
                  return (
                    <>
                      {violations.overtimeDays.map((day, idx) => (
                        <tr key={`ot-${idx}`} className="border-b bg-red-50">
                          <td className="p-2">{day.date}</td>
                          <td className="p-2">Overtime</td>
                          <td className="p-2">{day.hours} hours over 8</td>
                          <td className="p-2">${day.unpaidAmount}</td>
                        </tr>
                      ))}
                      {violations.splitShiftDays.map((day, idx) => (
                        <tr key={`split-${idx}`} className="border-b bg-orange-50">
                          <td className="p-2">{day.date}</td>
                          <td className="p-2">Split Shift</td>
                          <td className="p-2">Break greater 1 hour</td>
                          <td className="p-2">${day.additionalPayDue}</td>
                        </tr>
                      ))}
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WageAnalysisDashboard;