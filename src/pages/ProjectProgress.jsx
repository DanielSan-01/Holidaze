import React, { useState, useEffect } from 'react';

const ProjectProgress = () => {
  const [overallProgress, setOverallProgress] = useState(0);
  const [userStories, setUserStories] = useState([
    // All Users
    { id: 1, category: "All Users", story: "View a list of Venues", completed: false },
    { id: 2, category: "All Users", story: "Search for a specific Venue", completed: false },
    { id: 3, category: "All Users", story: "View a specific Venue page by id", completed: false },
    { id: 4, category: "All Users", story: "Register as a customer with a stud.noroff.no email address and password", completed: false },
    { id: 5, category: "All Users", story: "Register as a Venue Manager with a stud.noroff.no email address and password", completed: false },
    { id: 6, category: "All Users", story: "View a calendar with available dates for a Venue (with booked dates indicated)", completed: false },
    
    // Customers
    { id: 7, category: "Customers", story: "Login and log out once registered", completed: false },
    { id: 8, category: "Customers", story: "Create a booking at a Venue", completed: false },
    { id: 9, category: "Customers", story: "View their upcoming bookings", completed: false },
    { id: 10, category: "Customers", story: "Update their avatar/profile picture", completed: false },
    
    // Venue Managers
    { id: 11, category: "Venue Managers", story: "Login and log out once registered", completed: false },
    { id: 12, category: "Venue Managers", story: "Create a Venue", completed: false },
    { id: 13, category: "Venue Managers", story: "Edit/update a Venue they manage", completed: false },
    { id: 14, category: "Venue Managers", story: "Delete a Venue they manage", completed: false },
    { id: 15, category: "Venue Managers", story: "View upcoming bookings made at a Venue they manage", completed: false },
    { id: 16, category: "Venue Managers", story: "Update their avatar/profile picture", completed: false }
  ]);

  // Project data
  const projectData = [
    {
      phase: "Phase 1: Setup & Foundation",
      tasks: [
        { name: "Project Setup", start: "2025-04-14", end: "2025-04-15", hours: "8-12", completed: true },
        { name: "Basic Routing & Layout", start: "2025-04-16", end: "2025-04-20", hours: "12-16", completed: true }
      ]
    },
    {
      phase: "Phase 2: Authentication & User Management",
      tasks: [
        { name: "Authentication System", start: "2025-04-21", end: "2025-04-25", hours: "16-20", completed: true },
        { name: "User Profile", start: "2025-04-26", end: "2025-04-27", hours: "8-12", completed: true }
      ]
    },
    {
      phase: "Phase 3: Venue Display & Search",
      tasks: [
        { name: "Venue Listing", start: "2025-04-28", end: "2025-05-02", hours: "12-16", completed: true },
        { name: "Search & Filtering", start: "2025-05-03", end: "2025-05-04", hours: "8-12", completed: true }
      ]
    },
    {
      phase: "Phase 4: Individual Venue Pages",
      tasks: [
        { name: "Venue Details", start: "2025-05-05", end: "2025-05-09", hours: "12-16", completed: true },
        { name: "Booking System", start: "2025-05-10", end: "2025-05-11", hours: "8-12", completed: true }
      ]
    },
    {
      phase: "Phase 5: Venue Management",
      tasks: [
        { name: "Create/Edit Venues", start: "2025-05-12", end: "2025-05-16", hours: "16-20", completed: true },
        { name: "Booking Management", start: "2025-05-17", end: "2025-05-18", hours: "8-12", completed: true }
      ]
    },
    {
      phase: "Phase 6: Polish & Mobile Optimization",
      tasks: [
        { name: "Mobile Responsiveness", start: "2025-05-19", end: "2025-05-23", hours: "12-16", completed: true },
        { name: "Component Refactoring", start: "2025-05-24", end: "2025-05-26", hours: "8-12", completed: true }
      ]
    }
  ];

  // Generate date range
  const generateDateRange = (startDate, endDate) => {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Check if date is weekend
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Calculate days between dates
  const daysBetween = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Toggle user story completion
  const toggleUserStory = (id) => {
    setUserStories(prev => 
      prev.map(story => 
        story.id === id ? { ...story, completed: !story.completed } : story
      )
    );
  };

  // Calculate overall progress
  const calculateProgress = () => {
    const totalTasks = projectData.reduce((acc, phase) => acc + phase.tasks.length, 0);
    const completedTasks = projectData.reduce((acc, phase) => 
      acc + phase.tasks.filter(task => task.completed).length, 0
    );
    return Math.round((completedTasks / totalTasks) * 100);
  };

  // Calculate user stories progress
  const calculateUserStoriesProgress = () => {
    const completedStories = userStories.filter(story => story.completed).length;
    return Math.round((completedStories / userStories.length) * 100);
  };

  // Download as CSV
  const downloadCSV = () => {
    let csv = 'Task,Start Date,End Date,Duration,Hours,Status\n';
    
    projectData.forEach(phaseData => {
      csv += `"${phaseData.phase}",,,Phase,,\n`;
      phaseData.tasks.forEach(task => {
        csv += `"  ${task.name}","${task.start}","${task.end}","${daysBetween(task.start, task.end)} days","${task.hours}h","${task.completed ? 'Completed' : 'Pending'}"\n`;
      });
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'holidaze-project-progress.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    let text = 'Task\tStart Date\tEnd Date\tDuration\tHours\tStatus\n';
    
    projectData.forEach(phaseData => {
      text += `${phaseData.phase}\t\t\tPhase\t\t\n`;
      phaseData.tasks.forEach(task => {
        text += `  ${task.name}\t${task.start}\t${task.end}\t${daysBetween(task.start, task.end)} days\t${task.hours}h\t${task.completed ? 'Completed' : 'Pending'}\n`;
      });
    });
    
    try {
      await navigator.clipboard.writeText(text);
      alert('Table data copied to clipboard! You can now paste it into Excel or Google Sheets.');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  useEffect(() => {
    setOverallProgress(calculateProgress());
  }, []);

  const dates = generateDateRange('2025-04-14', '2025-05-26');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Holidaze Project Development Timeline
          </h1>
          <p className="text-lg text-gray-600">
            Track the progress of our React venue booking application
          </p>
        </div>

        {/* Project Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">Project Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-800">Project:</span>
              <p className="text-blue-700">React Venue Booking Application</p>
            </div>
            <div>
              <span className="font-medium text-blue-800">Duration:</span>
              <p className="text-blue-700">6 weeks (April 14 - May 26, 2025)</p>
            </div>
            <div>
              <span className="font-medium text-blue-800">Submission:</span>
              <p className="text-blue-700">May 26, 2025 at 23:59</p>
            </div>
            <div>
              <span className="font-medium text-blue-800">Est. Hours:</span>
              <p className="text-blue-700">252-320 hours</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-700">April</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-700">May</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">Phase Duration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Task Duration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 bg-gray-400 rounded"></div>
            <span className="text-sm text-gray-700">Completed Task</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-sm text-gray-700">Weekend</span>
          </div>
        </div>



        {/* Gantt Chart */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-green-600 text-white p-3 text-left font-semibold border border-gray-300 min-w-[200px]">
                    Task
                  </th>
                  <th className="bg-green-600 text-white p-3 text-center font-semibold border border-gray-300 min-w-[80px]">
                    Start
                  </th>
                  <th className="bg-green-600 text-white p-3 text-center font-semibold border border-gray-300 min-w-[80px]">
                    End
                  </th>
                  <th className="bg-green-600 text-white p-3 text-center font-semibold border border-gray-300 min-w-[60px]">
                    Days
                  </th>
                  <th className="bg-green-600 text-white p-3 text-center font-semibold border border-gray-300 min-w-[60px]">
                    Hours
                  </th>
                  {dates.map((date, index) => {
                    const month = date.getMonth(); // 3 = April, 4 = May
                    const isApril = month === 3;
                    const isMay = month === 4;
                    
                    let bgColor = 'bg-green-600';
                    if (isWeekend(date)) {
                      bgColor = 'bg-red-100';
                    } else if (isToday(date)) {
                      bgColor = 'bg-yellow-300';
                    } else if (isApril) {
                      bgColor = 'bg-yellow-500';
                    } else if (isMay) {
                      bgColor = 'bg-purple-500';
                    }
                    
                    return (
                      <th
                        key={index}
                        className={`${bgColor} text-white p-1 text-center font-semibold border border-gray-300 min-w-[30px]`}
                        style={{ fontSize: '12px', height: '60px' }}
                      >
                        <div className={`${isWeekend(date) ? 'text-gray-700' : 'text-white'}`}>
                          {date.getDate()}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {projectData.map((phaseData, phaseIndex) => (
                  <React.Fragment key={phaseIndex}>
                    {/* Phase Header Row */}
                    <tr className="bg-blue-600 text-white">
                      <td colSpan={5} className="p-3 font-semibold border border-gray-300">
                        {phaseData.phase}
                      </td>
                      {dates.map((date, dateIndex) => {
                        const isPhaseActive = phaseData.tasks.some(task => {
                          const taskStart = new Date(task.start);
                          const taskEnd = new Date(task.end);
                          return date >= taskStart && date <= taskEnd;
                        });
                        
                        return (
                          <td
                            key={dateIndex}
                            className={`p-1 border border-gray-300 ${
                              isWeekend(date) ? 'bg-red-100' : 'bg-white'
                            } ${isToday(date) ? 'bg-yellow-200' : ''}`}
                          >
                            {isPhaseActive && (
                              <div className="bg-blue-500 h-5 rounded mx-auto"></div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* Task Rows */}
                    {phaseData.tasks.map((task, taskIndex) => (
                      <tr key={taskIndex} className={taskIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="p-3 border border-gray-300">
                          <div className="flex items-center gap-2">
                            <span className="ml-4">{task.name}</span>
                            {task.completed && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                ✓ Done
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 border border-gray-300 text-center text-sm">
                          {task.start}
                        </td>
                        <td className="p-3 border border-gray-300 text-center text-sm">
                          {task.end}
                        </td>
                        <td className="p-3 border border-gray-300 text-center text-sm">
                          {daysBetween(task.start, task.end)}
                        </td>
                        <td className="p-3 border border-gray-300 text-center text-sm">
                          {task.hours}h
                        </td>
                        {dates.map((date, dateIndex) => {
                          const taskStart = new Date(task.start);
                          const taskEnd = new Date(task.end);
                          const isTaskActive = date >= taskStart && date <= taskEnd;
                          
                          return (
                            <td
                              key={dateIndex}
                              className={`p-1 border border-gray-300 ${
                                isWeekend(date) ? 'bg-red-100' : 'bg-white'
                              } ${isToday(date) ? 'bg-yellow-200' : ''}`}
                            >
                              {isTaskActive && (
                                <div className={`h-5 rounded mx-auto ${
                                  task.completed ? 'bg-gray-400' : 'bg-green-500'
                                }`}></div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Progress Overview</h3>
          <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-1000 ease-out"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="text-center mt-3 text-lg font-medium text-gray-700">
            {overallProgress}% Complete ({projectData.reduce((acc, phase) => 
              acc + phase.tasks.filter(task => task.completed).length, 0
            )} of {projectData.reduce((acc, phase) => acc + phase.tasks.length, 0)} tasks completed)
          </p>
        </div>

        {/* User Stories Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">User Stories Checklist</h3>
          
          {/* User Stories Progress Bar */}
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden mb-6">
            <div
              className="bg-blue-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${calculateUserStoriesProgress()}%` }}
            ></div>
          </div>
          <p className="text-center mb-6 text-sm font-medium text-gray-600">
            {calculateUserStoriesProgress()}% Complete ({userStories.filter(story => story.completed).length} of {userStories.length} user stories)
          </p>

          {/* User Stories by Category */}
          {['All Users', 'Customers', 'Venue Managers'].map(category => (
            <div key={category} className="mb-6">
              <h4 className="text-lg font-medium text-gray-800 mb-3 border-b border-gray-200 pb-2">
                {category}
              </h4>
              <div className="space-y-2">
                {userStories
                  .filter(story => story.category === category)
                  .map(story => (
                    <div key={story.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        id={`story-${story.id}`}
                        checked={story.completed}
                        onChange={() => toggleUserStory(story.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`story-${story.id}`}
                        className={`text-sm cursor-pointer ${
                          story.completed 
                            ? 'text-gray-500 line-through' 
                            : 'text-gray-700'
                        }`}
                      >
                        {story.story}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          ))}
          
          {/* Note about persistence */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">📝 Note:</span> Checkbox states are not stored anywhere and will reset on page refresh. 
              Make sure to merge your branch to preserve any checked items for future reference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgress; 