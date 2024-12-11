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

const WageViolationsAnalysis = () => {
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
    "01/13/2019 - 01/26/2019": {
      payStub: {
        checkNumber: "8177",
        regularHours: 45.00,
        rate: 13.50,
        totalPay: 607.50
      },
      wageDetails: []
    },
    "01/27/2019 - 02/09/2019": {
      payStub: {
        checkNumber: "8192",
        regularHours: 78.00,
        rate: 13.50,
        totalPay: 1053.00
      },
      wageDetails: [
        {
          date: "02/05/19",
          login: "10:22 AM",
          logout: "3:28 PM",
          secondLogin: "2:35 PM",
          secondLogout: "10:11 PM",
          totalHours: 12.72,
          regularWages: 171.69,
          violations: ["split_shift", "overtime"]
        },
        {
          date: "02/03/19",
          login: "10:26 AM",
          logout: "4:34 PM",
          totalHours: 6.13,
          regularWages: 82.69
        }
      ]
    },
    "02/10/2019 - 02/23/2019": {
      payStub: {
        checkNumber: "8192",
        regularHours: 78.00,
        rate: 13.50,
        totalPay: 1053.00
      },
      wageDetails: [
        {
          date: "02/19/19",
          login: "10:28 AM",
          logout: "3:36 PM",
          secondLogin: "4:39 PM",
          secondLogout: "10:41 PM",
          totalHours: 11.18,
          regularWages: 150.95,
          violations: ["split_shift", "overtime"]
        }
      ]
    }
  };

  const [selectedPeriod, setSelectedPeriod] = useState(Object.keys(payPeriods)[0]);

  const getViolationsSummary = (period) => {
    const data = payPeriods[period];
    let overtimeHours = 0;
    let overtimeDays = [];
    let splitShiftDays = [];
    
    data.wageDetails.forEach(day => {
      if (day.violations) {
        if (day.violations.includes("overtime")) {
          const overtimeAmount = day.totalHours - 8;
          overtimeHours += overtimeAmount;
          overtimeDays.push({
            date: day.date,
            hours: overtimeAmount.toFixed(2)
          });
        }
        if (day.violations.includes("split_shift")) {
          splitShiftDays.push({
            date: day.date,
            firstShift: `${day.login} - ${day.logout}`,
            secondShift: `${day.secondLogin} - ${day.secondLogout}`
          });
        }
      }
    });

    return {
      overtimeHours: overtimeHours.toFixed(2),
      overtimeDays,
      splitShiftDays,
      totalUnpaidOvertime: (overtimeHours * data.payStub.rate * 1.5).toFixed(2)
    };
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <div>Wage Violations Analysis - {employeeConfig.name}</div>
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
              <h3 className="font-bold mb-2">Pay Period Details</h3>
              <div className="space-y-2">
                <p>Check #: {payPeriods[selectedPeriod].payStub.checkNumber}</p>
                <p>Regular Hours: {payPeriods[selectedPeriod].payStub.regularHours}</p>
                <p>Rate: ${payPeriods[selectedPeriod].payStub.rate}/hr</p>
                <p>Total Pay: ${payPeriods[selectedPeriod].payStub.totalPay}</p>
              </div>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-bold mb-2">Violations Summary</h3>
              <div className="space-y-2">
                {getViolationsSummary(selectedPeriod).splitShiftDays.length > 0 && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <Clock size={16} />
                    <p>{getViolationsSummary(selectedPeriod).splitShiftDays.length} split shift violations</p>
                  </div>
                )}
                {getViolationsSummary(selectedPeriod).overtimeHours > 0 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle size={16} />
                    <div>
                      <p>{getViolationsSummary(selectedPeriod).overtimeDays.length} overtime violations</p>
                      <p className="text-sm">Total: {getViolationsSummary(selectedPeriod).overtimeHours} overtime hours</p>
                      <p className="text-sm">Unpaid wages: ${getViolationsSummary(selectedPeriod).totalUnpaidOvertime}</p>
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
                  <th className="p-2">Violations</th>
                </tr>
              </thead>
              <tbody>
                {payPeriods[selectedPeriod].wageDetails.map((day, index) => (
                  <tr key={index} className={`border-b ${day.violations?.length ? 'bg-red-50' : ''}`}>
                    <td className="p-2">{day.date}</td>
                    <td className="p-2">
                      {day.login} - {day.logout}
                      {day.secondLogin && (
                        <div className="text-sm text-gray-500">
                          {day.secondLogin} - {day.secondLogout}
                        </div>
                      )}
                    </td>
                    <td className="p-2">{day.totalHours}</td>
                    <td className="p-2">${day.regularWages}</td>
                    <td className="p-2">
                      {day.violations?.includes("overtime") && (
                        <div className="text-red-600">
                          {(day.totalHours - 8).toFixed(2)} hours overtime not paid
                        </div>
                      )}
                      {day.violations?.includes("split_shift") && (
                        <div className="text-orange-600">
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

export default WageViolationsAnalysis;