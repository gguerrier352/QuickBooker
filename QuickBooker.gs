 /* Todo 
// add rooms for tmp and atl hard code id ?
// modularize the method for booking rooms. Reduce to 1 method maybe 2 instead of 3. 
// design a logo for it   
// 1 Find all the rooms - All the rooms that matter : GNV ATL TMP
  //Users may not be subscribed to all of them - So force them to sub 
  
  // So Find all the rooms 
  // after finding all the rooms - Triage room base on events - Is there a room open for the next hour at least?
   
  // Then give the users the option to book - List all the rooms available. 
*/

function doGet(e) 
{
  //return HtmlService.createHtmlOutput(book());
}

function doPost(e)
{
  
  var commandReceived = e.parameter["text"];
 // if (welcome === " ") showWelcome();
  if (commandReceived.match(/help/) || commandReceived.match(/Help/)) showHelp();
  if (commandReceived.match(/book/)) book();
  if (commandReceived.match(/TPA/) || commandReceived.match(/tpa/)) bookTampa(); 
  if (commandReceived.match(/GNV/) || commandReceived.match(/gnv/)) bookGainesville();
  if (commandReceived.match(/ATL/) || commandReceived.match(/atl/)) bookAtlanta();
  
  return ContentService.createTextOutput(JSON.stringify({})).setMimeType(ContentService.MimeType.JSON);
  
  
}

function sendMessage(message)
{
 // var channel = e.parameter["channel_name"]
  
  var payload = {
    "channel": "#" + "quickmeet",
    "username": "Quick Meet",
    "icon_emoji": ":qm:",
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
  message += "- *book*: Books a room  (according to your susbcribed google calendar) that has no event for the next hour.\n"; 
  message += "- *TPA*: Books a room that has no event for the next hour in the Tampa Office.\n";  
  message += "- *GNV*: Books a room that has no event for the next hour in the Gainesville Office.\n"; 
  message += "- *ATL*: Books a room that has no event for the next hour in the Atlanta Office.\n"; 
  
  sendMessage(message);
}

function showWelcome()
{
  var message = "*Welcome to QuickBooker!* Books a room that is event free for at least the next hour.\n\n"; 
  message += "- _Example Booking_ - \n";
  message += "*!meet  TPA* : Will book an open conference room in Tampa\n"; 
  message += "*!meet book*  --> Books a room that has no event for the next hour in any Office, as long as subscribed.\n";  
  message += "*!meet help*  --> Shows all available commands.\n\n";   
  message += "*Available commands:*\n\n";
  message += "- *help*: What you see here.\n"; 
  message += "- *book*: Books a room that is event free for at least the next hour Dependent on your subscribed calendars.\n"; 
  message += "- *TPA*: Books a room that has no event for the next hour in the Tampa Office.\n";  
  message += "- *GNV*: Books a room that has no event for the next hour in the Gainesville Office.\n"; 
  message += "- *ATL*: Books a room that has no event for the next hour in the Atlanta Office.\n"; 
  sendMessage(message);
}


function book() 
{ 
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
    var messageError = "No rooms found in any of your subscribed calendars.";
    sendMessage(messageError);
    return messageError;
  }
  else
  {
   var stringCalendarObj= openRoomsId[0];
   var eventTitle = "Quick Meeting";
   var event = CalendarApp.createEvent(eventTitle,now,endMeeting,{guests:stringCalendarObj});  

   Logger.log('Event ID: ' + event.getId());
   Logger.log(openRoomsName);   
   var message = 'We booked ' + openRoomsName[0] + '  From right now until ' + endMeeting;
   sendMessage(message);
   return message;
  }
}


function bookTampa() 
{ 
  var fortDesotoRoomId = "352inc.com_775974472d726e5462556d30444d4f50396f72737077@resource.calendar.google.com";
  var madeiraRoomId = "352inc.com_31782d7065526f7074456149774d50564a7161726e51@resource.calendar.google.com";
  var stPeteBeach = "352inc.com_50415330743169324b6b477575487468623250334c41@resource.calendar.google.com";
  var sunsetBeachRoomId = "352inc.com_50415330743169324b6b477575487468623250334c41@resource.calendar.google.com";
  var roomsInTampa = [fortDesotoRoomId,madeiraRoomId,stPeteBeach,sunsetBeachRoomId];

  var openRoomsName = [];
  var openRoomsId = [];
  
  var now = new Date();
  var hourFromNow = new Date(now.getTime() + (1 * 60 * 60 * 1000));
  var endMeeting = new Date(now.getTime() + (0.5 * 60 * 60 * 1000));
 
  for(var i=0; i<roomsInTampa.length; i++) 
  {    
    var calendar = CalendarApp.getCalendarById(roomsInTampa[i]);      
    // check if the calendar has events from start to end time!
    var meetingInTwoHours = calendar.getEvents(now, hourFromNow);
    
    if (!Array.isArray(meetingInTwoHours) || !meetingInTwoHours.length) 
       {
         // array does not exist, is not an array, or is empty
         // add this room to a list of rooms available for quick booking. 
          openRoomsName.push(calendar.getName());
          openRoomsId.push(calendar.getId());
       }   
  }
  
    var roomCalendar = CalendarApp.getCalendarById(openRoomsId[0]);
    if (roomCalendar == null)
      {
     var messageError = "No open conference rooms found in Tampa.";
    sendMessage(messageError);
    return messageError;
       }
     else
       {
         var stringCalendarObj= openRoomsId[0];
           var eventTitle = "Quick Meeting";
           var event = CalendarApp.createEvent(eventTitle,now,endMeeting,{guests:stringCalendarObj});
         
          Logger.log('Event ID: ' + event.getId());
          Logger.log(openRoomsName);   
          var message = 'We booked ' + openRoomsName[0] + '  From right now until ' + endMeeting;
          sendMessage(message);
          return message;
         }
}


function bookGainesville() 
{ 
  var chromeRoomId = "352inc.com_37726846516d335a5f45793949714a61594f754a4677@resource.calendar.google.com";  
  var explorerRoomId = "352inc.com_6974416a6c505374616b5330357234464b6a33637267@resource.calendar.google.com";  
  var firefoxRoomId = "352inc.com_3038486f464a62464d30362d4b4c767266796c784451@resource.calendar.google.com";  
  var incognitoRoomId = "352inc.com_37464750696657486a556d465039457265392d4f4351@resource.calendar.google.com";  
  var operaRoomId = "352inc.com_622d544570554146486b7948794742392d4a4c386567@resource.calendar.google.com";  
  var safariRoomID = "352inc.com_616c4132465247504f6b6147635f7853555a444e4e41@resource.calendar.google.com";
  var seamonkeyRoomID = "352inc.com_455841424d503651756b6577684a6131326877745541@resource.calendar.google.com";
  var silkRoomId = "352inc.com_467058326657387a6d6b5357415767464e56584d7541@resource.calendar.google.com";
  
  var roomsInGainesville = [chromeRoomId,explorerRoomId,firefoxRoomId,incognitoRoomId,operaRoomId,safariRoomID,seamonkeyRoomID,silkRoomId];
  
  var openRoomsName = [];
  var openRoomsId = [];
  
  var now = new Date();
  var hourFromNow = new Date(now.getTime() + (1 * 60 * 60 * 1000));
  var endMeeting = new Date(now.getTime() + (0.5 * 60 * 60 * 1000));
 
  for(var i=0; i<roomsInGainesville.length; i++) 
  {    
    var calendar = CalendarApp.getCalendarById(roomsInGainesville[i]);      
    // check if the calendar has events from start to end time!
    var meetingInTwoHours = calendar.getEvents(now, hourFromNow);
    
    if (!Array.isArray(meetingInTwoHours) || !meetingInTwoHours.length) 
       {
         // array does not exist, is not an array, or is empty
         // add this room to a list of rooms available for quick booking. 
          openRoomsName.push(calendar.getName());
          openRoomsId.push(calendar.getId());
       }   
  }
  
    var roomCalendar = CalendarApp.getCalendarById(openRoomsId[0]);
    if (roomCalendar == null)
      {
        var messageError = "No open conference rooms found in Gainesville.";
         sendMessage(messageError);
          return messageError;
       }
     else
       {
         var stringCalendarObj= openRoomsId[0];
         var eventTitle = "Quick Meeting";
         var event = CalendarApp.createEvent(eventTitle,now,endMeeting,{guests:stringCalendarObj});
         
          Logger.log('Event ID: ' + event.getId());
          Logger.log(openRoomsName);   
          var message = 'We booked ' + openRoomsName[0] + '  From right now until ' + endMeeting;
          sendMessage(message);
          return message;
         }
}


function bookAtlanta() 
{
  var beltlineRoomId = "352inc.com_6d656c4e7773546546556d36374642324e4d72415167@resource.calendar.google.com";  
  var piedmontParkRoomId = "352inc.com_55334c5a67766e3031302d4c7a435749345576485f51@resource.calendar.google.com";  
  var theGultchRoomId = "352inc.com_77515f76382d764b2d304f30363047675135366c6267@resource.calendar.google.com";
  var roomsInAtlanta = [beltlineRoomId,piedmontParkRoomId,theGultchRoomId];
  
  var openRoomsName = [];
  var openRoomsId = [];
  
  var now = new Date();
  var hourFromNow = new Date(now.getTime() + (1 * 60 * 60 * 1000));
  var endMeeting = new Date(now.getTime() + (0.5 * 60 * 60 * 1000));
 
  for(var i=0; i<roomsInAtlanta.length; i++) 
  {         
    var calendar = CalendarApp.getCalendarById(roomsInAtlanta[i]);      
    // check if the calendar has events from start to end time!
    var meetingInTwoHours = calendar.getEvents(now, hourFromNow);
    
    if (!Array.isArray(meetingInTwoHours) || !meetingInTwoHours.length) 
       {
         // array does not exist, is not an array, or is empty
         // add this room to a list of rooms available for quick booking. 
          openRoomsName.push(calendar.getName());
          openRoomsId.push(calendar.getId());
       }   
  }
  var roomCalendar = CalendarApp.getCalendarById(openRoomsId[0]);
  if (roomCalendar == null)
  {
     var messageError = "No open rooms conference rooms in Atlanta.";
    sendMessage(messageError);
    return messageError;
  }
  else
  {
  var stringCalendarObj= openRoomsId[0];
  var eventTitle = "Quick Meeting";
  var event = CalendarApp.createEvent(eventTitle,now,endMeeting,{guests:stringCalendarObj});
  
  Logger.log('Event ID: ' + event.getId());
  Logger.log(openRoomsName);   
  var message = 'We booked ' + openRoomsName[0] + '  From right now until ' + endMeeting;
  sendMessage(message);
  return message;
  }
}