import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

const WageAnalysisDashboard = () => {
  const payPeriods = {
    // Previous periods remain the same
    "06/10/2019 - 06/23/2019": {
      payStub: {
        checkNumber: "6392",
        regularHours: 69.00,
        overtimeHours: 0,
        rate: 14.00
      },
      wageDetails: [
        {
          date: "06/11/19",
          login: "10:45 AM",
          logout: "9:59 PM",
          hours: 11.23,
          overtime: true
        },
        {
          date: "06/18/19",
          login: "10:31 AM",
          logout: "9:36 PM",
          hours: 11.09,
          overtime: true
        }
      ]
    },
    "06/24/2019 - 07/07/2019": {
      payStub: {
        checkNumber: "6405",
        regularHours: 69.00,
        overtimeHours: 0,
        rate: 14.00
      },
      wageDetails: [
        {
          date: "06/25/19",
          login: "10:34 AM",
          logout: "10:02 PM",
          hours: 11.47,
          overtime: true
        },
        {
          date: "07/02/19",
          login: "10:28 AM",
          logout: "9:51 PM",
          hours: 11.37,
          overtime: true
        }
      ]
    },
    "07/08/2019 - 07/21/2019": {
      payStub: {
        checkNumber: "6424",
        regularHours: 79.00,
        overtimeHours: 0,
        rate: 14.00
      },
      wageDetails: [
        {
          date: "07/09/19",
          login: "10:29 AM",
          logout: "9:53 PM",
          hours: 11.39,
          overtime: true
        },
        {
          date: "07/16/19",
          login: "10:26 AM",
          logout: "10:04 PM",
          hours: 11.64,
          overtime: true
        }
      ]
    },
    "07/22/2019 - 08/04/2019": {
      payStub: {
        checkNumber: "6437",
        regularHours: 79.00,
        overtimeHours: 0,
        rate: 14.00
      },
      wageDetails: [
        {
          date: "07/23/19",
          login: "10:44 AM",
          logout: "9:52 PM",
          hours: 11.13,
          overtime: true
        },
        {
          date: "07/30/19",
          login: "10:42 AM",
          logout: "9:53 PM",
          hours: 11.18,
          overtime: true
        },
        {
          date: "07/27/19",
          shifts: [
            { login: "10:31 AM", logout: "11:18 AM", hours: 0.77 },
            { login: "11:19 AM", logout: "3:36 PM", hours: 4.29 }
          ],
          totalHours: 5.06,
          splitShift: true
        }
      ]
    },
    "08/05/2019 - 08/18/2019": {
      payStub: {
        checkNumber: "6456",
        regularHours: 76.00,
        overtimeHours: 0,
        rate: 14.00
      },
      wageDetails: [
        {
          date: "08/06/19",
          login: "10:27 AM",
          logout: "9:47 PM",
          hours: 11.33,
          overtime: true
        },
        {
          date: "08/13/19",
          login: "10:37 AM",
          logout: "9:43 PM",
          hours: 11.10,
          overtime: true
        },
        {
          date: "08/09/19",
          login: "10:36 AM",
          logout: "6:05 PM",
          hours: 7.49,
          splitShift: true
        }
      ]
    },
    "08/19/2019 - 09/01/2019": {
      payStub: {
        checkNumber: "6469",
        regularHours: 70.00,
        overtimeHours: 0,
        rate: 14.00
      },
      wageDetails: [
        {
          date: "08/20/19",
          login: "10:25 AM",
          logout: "10:01 PM",
          hours: 11.59,
          overtime: true
        },
        {
          date: "08/27/19",
          login: "10:25 AM",
          logout: "9:53 PM",
          hours: 11.48,
          overtime: true
        }
      ]
    },
    "09/02/2019 - 09/15/2019": {
      payStub: {
        checkNumber: "6487",
        regularHours: 69.00,
        overtimeHours: 0,
        rate: 14.00
      },
      wageDetails: [
        {
          date: "09/03/19",
          login: "10:28 AM",
          logout: "9:29 PM",
          hours: 11.02,
          overtime: true
        },
        {
          date: "09/10/19",
          login: "10:27 AM",
          logout: "9:27 PM",
          hours: 10.99,
          overtime: true
        }
      ]
    },
    "09/16/2019 - 09/29/2019": {
      payStub: {
        checkNumber: "6499",
        regularHours: 70.00,
        overtimeHours: 0,
        rate: 14.00
      },
      wageDetails: [
        {
          date: "09/17/19",
          login: "10:28 AM",
          logout: "10:08 PM",
          hours: 11.66,
          overtime: true
        },
        {
          date: "09/24/19",
          login: "10:31 AM",
          logout: "9:48 PM",
          hours: 11.29,
          overtime: true
        }
      ]
    },
    "09/30/2019 - 10/13/2019": {
      payStub: {
        checkNumber: "6516",
        regularHours: 70.00,
        overtimeHours: 0,
        rate: 14.00
      },
      wageDetails: [
        {
          date: "10/01/19",
          login: "10:25 AM",
          logout: "9:34 PM",
          hours: 11.15,
          overtime: true
        },
        {
          date: "10/08/19",
          login: "10:28 AM",
          logout: "9:51 PM",
          hours: 11.37,
          overtime: true
        }
      ]
    },
    "10/14/2019 - 10/27/2019": {
      payStub: {
        checkNumber: "N/A",
        regularHours: 68.00,
        overtimeHours: 0,
        rate: 14.00
      },
      wageDetails: [
        {
          date: "10/15/19",
          login: "10:28 AM",
          logout: "9:51 PM",
          hours: 11.37,
          overtime: true
        },
        {
          date: "10/22/19",
          login: "10:27 AM",
          logout: "9:41 PM",
          hours: 11.23,
          overtime: true
        }
      ]
    },
    "10/28/2019 - 11/10/2019": {
      payStub: {
        checkNumber: "6563",
        regularHours: 34.00,
        overtimeHours: 0,
        rate: 14.00
      },
      wageDetails: [
        {
          date: "10/29/19",
          login: "10:30 AM",
          logout: "9:50 PM",
          hours: 11.33,
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
      if (day.overtime) {
        overtimeCount++;
        totalOvertimeHours += (day.hours || day.totalHours) - 8;
      }
      if (day.splitShift) splitShiftCount++;
    });

    return { overtimeCount, splitShiftCount, totalOvertimeHours };
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>Wage Analysis Dashboard - Full 2019 Report</div>
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
                          {((day.hours || day.totalHours) - 8).toFixed(2)} hours overtime not paid
                        </div>
                      )}
                      {day.splitShift && (
                        <div className="text-red-600">Split shift</div>
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

export default WageAnalysisDashboard;
