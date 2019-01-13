 // todo 
// add error catching for no rooms . error message 
// add rooms for tmp and atl hard code id ?
// modularize the method for booking rooms. Reduce to 1 method maybe 2 instead of 3. 
// find way to communicate at user 
// design a logo for it
// 
function doGet(e) 
{
  //Logger.log("dogett!");
  return HtmlService.createHtmlOutput(book());
}
 

function doPost(e)
{
 // Logger.log("inside!");   

  var commandReceived = e.parameter["text"];
  
  if (commandReceived.match(/help/)) showHelp();
  if (commandReceived.match(/book/)) book();
  if (commandReceived.match(/TMP/)) bookTampa(); //TMP
  if (commandReceived.match(/GNV/)) bookGainesville(); // GNV
  if (commandReceived.match(/ATL/)) bookAtlanta(); //ATL
}


function sendMessage(message)
{
  var payload = {
    "channel": "#" + "quickmeet",
    "username": "Quick Meet",
    "icon_emoji": ":GGgarry:",
    "text": message
  };

  var url = "https://hooks.slack.com/services/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";
  var options = {
    'method': 'post',
    'payload': JSON.stringify(payload)
  };

  var response = UrlFetchApp.fetch(url, options);
}

function showHelp()
{
  var message = "*Available commands:*\n\n";
  message += "- *help*: What you see here.\n"; 
  message += "- *book*: Books a room that has no event for the next hour.\n"; 
  message += "- *Coming Soon!*: Books a room that has no event for the next hour in the XYZ Office.\n"; 
    message += "- *TMP*: Books a room that has no event for the next hour in the Tampa Office.\n"; 
    message += "- *GNV*: Books a room that has no event for the next hour in the Gainesville Office.\n"; 
    message += "- *ATL*: Books a room that has no event for the next hour in the Atlanta Office.\n"; 
  sendMessage(message);
}


function book() 
{
  // 1 Find all the rooms - All the rooms that matter : GNV ATL TMP
  //Users may not be subscribed to all of them - So force them to sub 
  
  // So Find all the rooms 
  // after finding all the rooms - Triage room base on events - Is there a room open for the next hour at least?
   
  // Then give the users the option to book - List all the rooms available. 
  
  //get all the calendars. 
  var calendars = CalendarApp.getAllCalendars();
  var openRoomsName = [];
  var openRoomsId = [];
  
  var now = new Date();
  var hourFromNow = new Date(now.getTime() + (1 * 60 * 60 * 1000));
  var endMeeting = new Date(now.getTime() + (0.5 * 60 * 60 * 1000));
 
  for(var i=0; i<calendars.length; i++) 
  {    
    var first4 = calendars[i].getName().substr(0,4);
    
    if(first4 !== 'ATL-' && first4 !== 'GNV-' && first4 !== 'TPA-')
    {
      continue;
    }
      
    // check if the calendar has events from start to end time!
    var meetingInTwoHours = calendars[i].getEvents(now, hourFromNow);
    
    if (!Array.isArray(meetingInTwoHours) || !meetingInTwoHours.length) 
       {
         // array does not exist, is not an array, or is empty
         // add this room to a list of rooms available for quick booking. 
          openRoomsName.push(calendars[i].getName().split('-')[1]);
          openRoomsId.push(calendars[i].getId());
       }   
    
  }
  
  var roomCalendar = CalendarApp.getCalendarById(openRoomsId[0]);
  if (roomCalendar == null)
  {
     var messageError = "No rooms found.";
    sendMessage(messageError);
    return messageError;
  }
  else
  {
  var stringCalendarObj= openRoomsId[0];
  var event = CalendarApp.createEvent('Apollo 11 Landing',now,endMeeting,{guests:stringCalendarObj});
  

  Logger.log('Event ID: ' + event.getId());
  Logger.log(openRoomsName);   
  var message = 'We booked ' + openRoomsName[0] + '  From right now until ' + endMeeting;
  sendMessage(message);
  return message;
  }
}


function bookTampa() 
{
  // 1 Find all the rooms - All the rooms that matter : GNV ATL TMP
  //Users may not be subscribed to all of them - So force them to sub 
  
  // So Find all the rooms 
  // after finding all the rooms - Triage room base on events - Is there a room open for the next hour at least?
   
  // Then give the users the option to book - List all the rooms available. 
  
  //make list of all tampa office rooms. 
  
  //get all the calendars. 
  var calendars = CalendarApp.getAllCalendars();
  var openRoomsName = [];
  var openRoomsId = [];
  
  var now = new Date();
  var hourFromNow = new Date(now.getTime() + (1 * 60 * 60 * 1000));
  var endMeeting = new Date(now.getTime() + (0.5 * 60 * 60 * 1000));
 
  for(var i=0; i<calendars.length; i++) 
  {    
    var first4 = calendars[i].getName().substr(0,4);
    
    if(first4 !== 'TPA-')
    {
      continue;
    }
      
    // check if the calendar has events from start to end time!
    var meetingInTwoHours = calendars[i].getEvents(now, hourFromNow);
    
    if (!Array.isArray(meetingInTwoHours) || !meetingInTwoHours.length) 
       {
         // array does not exist, is not an array, or is empty
         // add this room to a list of rooms available for quick booking. 
          openRoomsName.push(calendars[i].getName().split('-')[1]);
          openRoomsId.push(calendars[i].getId());
       }   
    
  }
  
  var roomCalendar = CalendarApp.getCalendarById(openRoomsId[0]);
  if (roomCalendar == null)
  {
     var messageError = "No rooms found.";
    sendMessage(messageError);
    return messageError;
  }
  else
  {
  var stringCalendarObj= openRoomsId[0];
  var event = CalendarApp.createEvent('Apollo 11 Landing',now,endMeeting,{guests:stringCalendarObj});
  

  Logger.log('Event ID: ' + event.getId());
  Logger.log(openRoomsName);   
  var message = 'We booked ' + openRoomsName[0] + '  From right now until ' + endMeeting;
  sendMessage(message);
  return message;
  }
}


function bookGainesville() 
{
  // 1 Find all the rooms - All the rooms that matter : GNV ATL TMP
  //Users may not be subscribed to all of them - So force them to sub 
  
  // So Find all the rooms 
  // after finding all the rooms - Triage room base on events - Is there a room open for the next hour at least?
   
  // Then give the users the option to book - List all the rooms available. 
  
  //make list of all gnv office rooms. 
  
  //get all the calendars. 
  var calendars = CalendarApp.getAllCalendars();
  var openRoomsName = [];
  var openRoomsId = [];
  
  var now = new Date();
  var hourFromNow = new Date(now.getTime() + (1 * 60 * 60 * 1000));
  var endMeeting = new Date(now.getTime() + (0.5 * 60 * 60 * 1000));
 
  for(var i=0; i<calendars.length; i++) 
  {    
    var first4 = calendars[i].getName().substr(0,4);
    
    if(first4 !== 'GNV-')
    {
      continue;
    }
      
    // check if the calendar has events from start to end time!
    var meetingInTwoHours = calendars[i].getEvents(now, hourFromNow);
    
    if (!Array.isArray(meetingInTwoHours) || !meetingInTwoHours.length) 
       {
         // array does not exist, is not an array, or is empty
         // add this room to a list of rooms available for quick booking. 
          openRoomsName.push(calendars[i].getName().split('-')[1]);
          openRoomsId.push(calendars[i].getId());
       }   
    
  }
  
  var roomCalendar = CalendarApp.getCalendarById(openRoomsId[0]);
  if (roomCalendar == null)
  {
     var messageError = "No rooms found.";
    sendMessage(messageError);
    return messageError;
  }
  else
  {
  var stringCalendarObj= openRoomsId[0];
  var event = CalendarApp.createEvent('Apollo 11 Landing',now,endMeeting,{guests:stringCalendarObj});
  

  Logger.log('Event ID: ' + event.getId());
  Logger.log(openRoomsName);   
  var message = 'We booked ' + openRoomsName[0] + '  From right now until ' + endMeeting;
  sendMessage(message);
  return message;
  }
}


function bookAtlanta() 
{
  // 1 Find all the rooms - All the rooms that matter : GNV ATL TMP
  //Users may not be subscribed to all of them - So force them to sub 
  
  // So Find all the rooms 
  // after finding all the rooms - Triage room base on events - Is there a room open for the next hour at least?
   
  // Then give the users the option to book - List all the rooms available. 
  
  //make list of all atl office rooms. 
  
  //get all the calendars. 
  var calendars = CalendarApp.getAllCalendars();
  var openRoomsName = [];
  var openRoomsId = [];
  
  var now = new Date();
  var hourFromNow = new Date(now.getTime() + (1 * 60 * 60 * 1000));
  var endMeeting = new Date(now.getTime() + (0.5 * 60 * 60 * 1000));
 
  for(var i=0; i<calendars.length; i++) 
  {    
    var first4 = calendars[i].getName().substr(0,4);
    
    if(first4 !== 'ATL-')
    {
      continue;
    }
      
    // check if the calendar has events from start to end time!
    var meetingInTwoHours = calendars[i].getEvents(now, hourFromNow);
    
    if (!Array.isArray(meetingInTwoHours) || !meetingInTwoHours.length) 
       {
         // array does not exist, is not an array, or is empty
         // add this room to a list of rooms available for quick booking. 
          openRoomsName.push(calendars[i].getName().split('-')[1]);
          openRoomsId.push(calendars[i].getId());
       }   
    
  }
  
  var roomCalendar = CalendarApp.getCalendarById(openRoomsId[0]);
  if (roomCalendar == null)
  {
     var messageError = "No rooms found.";
    sendMessage(messageError);
    return messageError;
  }
  else
  {
  var stringCalendarObj= openRoomsId[0];
  var event = CalendarApp.createEvent('Apollo 11 Landing',now,endMeeting,{guests:stringCalendarObj});
  

  Logger.log('Event ID: ' + event.getId());
  Logger.log(openRoomsName);   
  var message = 'We booked ' + openRoomsName[0] + '  From right now until ' + endMeeting;
  sendMessage(message);
  return message;
  }
}