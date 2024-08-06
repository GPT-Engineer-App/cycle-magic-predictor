import React, { useState, useEffect } from 'react';
import { addDays, format, parseISO } from 'date-fns';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Index = () => {
  const [periods, setPeriods] = useState([]);
  const [newPeriodDate, setNewPeriodDate] = useState('');
  const [nextPeriod, setNextPeriod] = useState(null);

  useEffect(() => {
    const storedPeriods = JSON.parse(localStorage.getItem('periods') || '[]');
    setPeriods(storedPeriods);
  }, []);

  useEffect(() => {
    localStorage.setItem('periods', JSON.stringify(periods));
    if (periods.length >= 2) {
      const lastPeriod = new Date(periods[periods.length - 1]);
      const secondLastPeriod = new Date(periods[periods.length - 2]);
      const cycleDays = Math.round((lastPeriod - secondLastPeriod) / (1000 * 60 * 60 * 24));
      setNextPeriod(addDays(lastPeriod, cycleDays));
    }
  }, [periods]);

  const addPeriod = () => {
    if (newPeriodDate) {
      setPeriods([...periods, newPeriodDate].sort((a, b) => new Date(b) - new Date(a)));
      setNewPeriodDate('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Period Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                type="date"
                value={newPeriodDate}
                onChange={(e) => setNewPeriodDate(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={addPeriod} className="w-full mb-4">Add Period</Button>
            
            {nextPeriod && (
              <p className="text-lg font-semibold mb-4">
                Next period predicted: {format(nextPeriod, 'MMMM d, yyyy')}
              </p>
            )}
            
            <h3 className="text-lg font-semibold mb-2">Previous Periods:</h3>
            <ul className="space-y-2">
              {periods.map((period, index) => (
                <li key={index} className="bg-white p-2 rounded shadow">
                  {format(parseISO(period), 'MMMM d, yyyy')}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
