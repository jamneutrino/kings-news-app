import React from 'react';
import { X } from 'lucide-react';

interface Game {
  date: string;
  opponent: string;
  time: string;
  isAway: boolean;
}

interface SchedulePopupProps {
  onClose: () => void;
}

const games: Game[] = [
  { date: "Jan 1, 2025", opponent: "Philadelphia", time: "10:00PM", isAway: false },
  { date: "Jan 3, 2025", opponent: "Memphis", time: "10:00PM", isAway: false },
  { date: "Jan 5, 2025", opponent: "Golden St.", time: "8:30PM", isAway: true },
  { date: "Jan 6, 2025", opponent: "Miami", time: "10:00PM", isAway: false },
  { date: "Jan 10, 2025", opponent: "Boston", time: "7:30PM", isAway: true },
  { date: "Jan 12, 2025", opponent: "Chicago", time: "3:30PM", isAway: true },
  { date: "Jan 14, 2025", opponent: "Milwaukee", time: "8:00PM", isAway: true },
  { date: "Jan 16, 2025", opponent: "Houston", time: "10:00PM", isAway: false },
  { date: "Jan 19, 2025", opponent: "Washington", time: "9:00PM", isAway: false },
  { date: "Jan 22, 2025", opponent: "Golden St.", time: "10:00PM", isAway: false },
  { date: "Jan 23, 2025", opponent: "Denver", time: "9:00PM", isAway: true },
  { date: "Jan 25, 2025", opponent: "New York", time: "7:30PM", isAway: true },
  { date: "Jan 27, 2025", opponent: "Brooklyn", time: "7:30PM", isAway: true },
  { date: "Jan 29, 2025", opponent: "Philadelphia", time: "7:30PM", isAway: true },
  { date: "Feb 1, 2025", opponent: "Oklahoma City", time: "8:00PM", isAway: true },
  { date: "Feb 3, 2025", opponent: "Minnesota", time: "8:00PM", isAway: true },
  { date: "Feb 5, 2025", opponent: "Orlando", time: "10:00PM", isAway: false },
  { date: "Feb 6, 2025", opponent: "Portland", time: "10:00PM", isAway: true },
  { date: "Feb 8, 2025", opponent: "New Orleans", time: "10:00PM", isAway: false },
  { date: "Feb 10, 2025", opponent: "Dallas", time: "8:30PM", isAway: true },
  { date: "Feb 12, 2025", opponent: "New Orleans", time: "8:00PM", isAway: true },
  { date: "Feb 13, 2025", opponent: "New Orleans", time: "8:00PM", isAway: true },
  { date: "Feb 21, 2025", opponent: "Golden St.", time: "10:00PM", isAway: false },
  { date: "Feb 24, 2025", opponent: "Charlotte", time: "10:00PM", isAway: false },
  { date: "Feb 26, 2025", opponent: "Utah", time: "9:00PM", isAway: true },
  { date: "Mar 1, 2025", opponent: "Houston", time: "8:00PM", isAway: true },
  { date: "Mar 3, 2025", opponent: "Dallas", time: "8:30PM", isAway: true },
  { date: "Mar 5, 2025", opponent: "Denver", time: "9:00PM", isAway: true },
  { date: "Mar 7, 2025", opponent: "San Antonio", time: "10:00PM", isAway: false },
  { date: "Mar 9, 2025", opponent: "L.A. Clippers", time: "9:30PM", isAway: true },
  { date: "Mar 10, 2025", opponent: "New York", time: "10:30PM", isAway: false },
  { date: "Mar 13, 2025", opponent: "Golden St.", time: "10:00PM", isAway: true },
  { date: "Mar 14, 2025", opponent: "Phoenix", time: "10:00PM", isAway: true },
  { date: "Mar 17, 2025", opponent: "Memphis", time: "10:00PM", isAway: false },
  { date: "Mar 19, 2025", opponent: "Cleveland", time: "10:00PM", isAway: false },
  { date: "Mar 20, 2025", opponent: "Chicago", time: "10:00PM", isAway: false },
  { date: "Mar 22, 2025", opponent: "Milwaukee", time: "10:00PM", isAway: false },
  { date: "Mar 24, 2025", opponent: "Boston", time: "10:00PM", isAway: false },
  { date: "Mar 25, 2025", opponent: "Oklahoma City", time: "10:00PM", isAway: false },
  { date: "Mar 27, 2025", opponent: "Portland", time: "10:00PM", isAway: false },
  { date: "Mar 29, 2025", opponent: "Orlando", time: "5:00PM", isAway: true },
  { date: "Mar 31, 2025", opponent: "Indiana", time: "7:00PM", isAway: true },
  { date: "Apr 2, 2025", opponent: "Washington", time: "7:00PM", isAway: true },
  { date: "Apr 4, 2025", opponent: "Charlotte", time: "7:00PM", isAway: true },
  { date: "Apr 6, 2025", opponent: "Cleveland", time: "6:00PM", isAway: true },
  { date: "Apr 7, 2025", opponent: "Detroit", time: "7:00PM", isAway: true },
  { date: "Apr 9, 2025", opponent: "Denver", time: "10:00PM", isAway: false },
  { date: "Apr 11, 2025", opponent: "L.A. Clippers", time: "10:00PM", isAway: false },
  { date: "Apr 13, 2025", opponent: "Phoenix", time: "3:30PM", isAway: false }
];

export default function SchedulePopup({ onClose }: SchedulePopupProps) {
  const now = new Date();
  const upcomingGames = games.filter(game => {
    const dateParts = game.date.split(' ');
    const month = dateParts[0];
    const day = dateParts[1].replace(',', '');
    const [time, period] = game.time.split(/(?=[AP]M)/);
    const [hours, minutes] = time.split(':');
    let gameHours = parseInt(hours);
    
    // Convert to 24-hour format
    if (period === 'PM' && gameHours !== 12) {
      gameHours += 12;
    } else if (period === 'AM' && gameHours === 12) {
      gameHours = 0;
    }

    const gameDate = new Date(2025, 
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month), 
      parseInt(day), 
      gameHours, 
      parseInt(minutes)
    );

    return gameDate >= now;
  });

  const formatGameDate = (gameDate: string) => {
    const today = new Date();
    const dateParts = gameDate.split(' ');
    const month = dateParts[0];
    const day = dateParts[1].replace(',', '');
    const gameDateTime = new Date(2025, 
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month), 
      parseInt(day)
    );

    if (
      today.getFullYear() === gameDateTime.getFullYear() &&
      today.getMonth() === gameDateTime.getMonth() &&
      today.getDate() === gameDateTime.getDate()
    ) {
      return 'Today';
    }
    return gameDate;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Kings Schedule</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          <div className="space-y-4">
            {upcomingGames.map((game, index) => (
              <div key={index} className="flex items-center space-x-4 py-2 border-b last:border-b-0">
                <div className="flex-1">
                  <div className="text-sm text-gray-500">{formatGameDate(game.date)}</div>
                  <div className="font-medium">
                    {game.isAway ? '@ ' : 'vs '}{game.opponent}
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {game.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 