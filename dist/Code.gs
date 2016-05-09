function copy(){function e(e){for(;e.length>0&&!r;)p=e.pop(),s=(new Date).getTime(),r=s-f>=c,d=t(p),d.id?log(o,["Copied",d.title,'=HYPERLINK("https://drive.google.com/open?id='+d.id+'","'+d.title+'")',d.id,Utilities.formatDate(new Date,m,"MM-dd-yy hh:mm:ss aaa")]):log(o,["Error, "+d,p.title,'=HYPERLINK("https://drive.google.com/open?id='+p.id+'","'+p.title+'")',p.id,Utilities.formatDate(new Date,m,"MM-dd-yy hh:mm:ss aaa")]),n.permissions&&("application/vnd.google-apps.document"==p.mimeType||"application/vnd.google-apps.folder"==p.mimeType||"application/vnd.google-apps.spreadsheet"==p.mimeType||"application/vnd.google-apps.presentation"==p.mimeType||"application/vnd.google-apps.drawing"==p.mimeType||"application/vnd.google-apps.form"==p.mimeType||"application/vnd.google-apps.script"==p.mimeType)&&copyPermissions(p.id,p.owners,d.id)}function t(e){if("application/vnd.google-apps.folder"==p.mimeType)try{var t=Drive.Files.insert({description:e.description,title:e.title,parents:[{kind:"drive#fileLink",id:n.map[e.parents[0].id]}],mimeType:"application/vnd.google-apps.folder"});return n.remaining.push(e.id),n.map[e.id]=t.id,t}catch(i){return log(o,[i.message,i.fileName,i.lineNumber]),i}else try{return Drive.Files.copy({title:e.title,parents:[{kind:"drive#fileLink",id:n.map[e.parents[0].id]}]},e.id)}catch(i){return log(o,[i.message,i.fileName,i.lineNumber]),i}}function i(){try{n.leftovers=l&&l.items?l:n.leftovers,n.pageToken=n.leftovers.nextPageToken}catch(e){log(o,[e.message,e.fileName,e.lineNumber])}try{saveProperties(n),exponentialBackoff(createTrigger,"Error setting trigger.  There has been a server error with Google Apps Script.To successfully finish copying, please Copy Folder.")}catch(e){log(o,[e.message,e.fileName,e.lineNumber])}}var r,s,o,n,a,l,p,g,d,m,c=306e3,f=(new Date).getTime();try{n=exponentialBackoff(loadProperties,"Error restarting script, will retry in 1-2 minutes")}catch(h){return log(null,[h.message,h.fileName,h.lineNumber]),void exponentialBackoff(createTrigger,"Error setting trigger.  There has been a server error with Google Apps Script.To successfully finish copying, please Copy Folder.")}if(o=SpreadsheetApp.openById(n.spreadsheetId).getSheetByName("Log"),m=SpreadsheetApp.openById(n.spreadsheetId).getSpreadsheetTimeZone(),void 0!==n.triggerId)try{deleteTrigger(n.triggerId)}catch(h){log(o,[h.message,h.fileName,h.lineNumber])}for(n.leftovers.items&&n.leftovers.items.length>0&&(Logger.log("beginning processFiles on leftovers"),n.destFolder=n.leftovers.items[0].parents[0].id,e(n.leftovers.items)),Logger.log("beginning processFiles on next remaining folder");n.remaining.length>0&&!r;){try{g=n.pageToken?n.destFolder:n.remaining.shift()}catch(h){log(o,[h.message,h.fileName,h.lineNumber])}a='"'+g+'" in parents and trashed = false';do{try{l=getFiles(a,n.pageToken)}catch(h){log(o,[h.message,h.fileName,h.lineNumber])}l.items&&l.items.length>0?e(l.items):Logger.log("No children found."),n.pageToken=l.nextPageToken}while(n.pageToken&&!r)}if(r)log(o,["Paused due to Google quota limits - copy will resume in 1-2 minutes"]),i();else{try{Drive.Files.update({labels:{trashed:!0}},n.propertiesDocId)}catch(h){log(o,[h.message,h.fileName,h.lineNumber])}o.getRange(2,3,1,1).setValue("Complete").setBackground("#66b22c"),o.getRange(2,4,1,1).setValue(Utilities.formatDate(new Date,m,"MM-dd-yy hh:mm:ss a"))}}function copyPermissions(e,t,i){var r,s,o,n;try{r=getPermissions(e).items}catch(a){log(null,[a.message,a.fileName,a.lineNumber])}if(r&&r.length>0)for(o=0;o<r.length;o++)try{if(r[o].emailAddress){if("owner"==r[o].role)continue;Drive.Permissions.insert({role:r[o].role,type:r[o].type,value:r[o].emailAddress},i,{sendNotificationEmails:"false"})}else Drive.Permissions.insert({role:r[o].role,type:r[o].type,id:r[o].id,withLink:r[o].withLink},i,{sendNotificationEmails:"false"})}catch(a){}if(t&&t.length>0)for(o=0;o<t.length;o++)try{Drive.Permissions.insert({role:"writer",type:"user",value:t[o].emailAddress},i,{sendNotificationEmails:"false"})}catch(a){}try{s=getPermissions(i).items}catch(a){log(null,[a.message,a.fileName,a.lineNumber])}if(s&&s.length>0)for(o=0;o<s.length;o++)for(n=0;n<r.length&&s[o].id!=r[n].id;n++)n==r.length&&Drive.Permissions.remove(i,s[o].id)}function getOAuthToken(){return ScriptApp.getOAuthToken()}function getMetadata(e){return Drive.Files.get(e)}function getPermissions(e){return Drive.Permissions.list(e)}function getFiles(e,t){var i;return i=Drive.Files.list({q:e,maxResults:1e3,pageToken:t})}function log(e,t){return e?e.getRange(e.getLastRow()+1,1,1,t.length).setValues([t]):(e=SpreadsheetApp.openById(PropertiesService.getUserProperties().getProperties().spreadsheetId).getSheetByName("Log"),e.getRange(e.getLastRow()+1,1,1,t.length).setValues([t]))}function exponentialBackoff(e,t){for(var i=0;6>i;i++)try{return e()}catch(r){if(log(null,[r.message,r.fileName,r.lineNumber]),5==i)throw log(null,[t]),r;Utilities.sleep(1e3*Math.pow(2,i)+Math.round(1e3*Math.random()))}}function doGet(e){var t=HtmlService.createTemplateFromFile("Index");return t.thisForm=e.parameter.thisForm,t.evaluate().setTitle("Copy a Google Drive folder").setSandboxMode(HtmlService.SandboxMode.IFRAME)}function initialize(e){var t,i,r,s,o=Utilities.formatDate(new Date,"GMT-5","MM-dd-yyyy");try{t=Drive.Files.insert({description:"Copy of "+e.srcName+", created "+o,title:e.destName,parents:[{kind:"drive#fileLink",id:"same"==e.destLocation?e.srcParentId:DriveApp.getRootFolder().getId()}],mimeType:"application/vnd.google-apps.folder"})}catch(n){Logger.log(n.message)}try{i=Drive.Files.copy({title:"Copy Folder Log "+o,parents:[{kind:"drive#fileLink",id:t.id}]},"17xHN9N5KxVie9nuFFzCur7WkcMP7aLG4xsPis8Ctxjg")}catch(n){Logger.log(n.message)}try{r=Drive.Files.insert({description:"This document will be deleted after the folder copy is complete.  It is only used to store properties necessary to complete the copying procedure",title:"DO NOT DELETE OR MODIFY - will be deleted after copying completes",parents:[{kind:"drive#fileLink",id:t.id}],mimeType:"application/vnd.google-apps.document"})}catch(n){Logger.log(n.message)}return e.permissions&&copyPermissions(e.srcId,null,t.id),SpreadsheetApp.openById(i.id).getSheetByName("Log").getRange(2,5).setValue('=HYPERLINK("https://drive.google.com/open?id='+t.id+'","'+e.destName+'")'),e.destId=t.id,e.spreadsheetId=i.id,e.propertiesDocId=r.id,e.leftovers={},e.map={},e.map[e.srcId]=e.destId,e.remaining=[e.srcId],s=PropertiesService.getUserProperties(),s.setProperty("spreadsheetId",e.spreadsheetId),s.setProperty("propertiesDocId",e.propertiesDocId),saveProperties(e),{spreadsheetId:e.spreadsheetId,destId:e.destId}}function loadProperties(){var e,t,i;try{e=PropertiesService.getUserProperties().getProperties(),i=DocumentApp.openById(e.propertiesDocId).getBody(),t=JSON.parse(i.getText())}catch(r){throw r}try{t.map=JSON.parse(t.map),t.leftovers=JSON.parse(t.leftovers),t.remaining=JSON.parse(t.remaining)}catch(r){throw r}return t}function saveProperties(e){var t,i,r,s;try{t=PropertiesService.getUserProperties().getProperties(),i=DocumentApp.openById(t.propertiesDocId).getBody(),r={},s=SpreadsheetApp.openById(t.spreadsheetId).getSheetByName("Log")}catch(o){log(null,[o.message,o.fileName,o.lineNumber])}if(""!==i.getText())try{r=JSON.parse(i.getText())}catch(o){log(s,[o.message,o.fileName,o.lineNumber])}for(var n in e)e.hasOwnProperty(n)&&("object"==typeof e[n]&&(e[n]=JSON.stringify(e[n])),r[n]=e[n]);i.setText(JSON.stringify(r))}function getTriggersQuantity(){return ScriptApp.getProjectTriggers().length}function createTrigger(){var e=ScriptApp.newTrigger("copy").timeBased().after(121e3).create();e&&saveProperties({triggerId:e.getUniqueId()})}function deleteTrigger(e){try{for(var t=ScriptApp.getProjectTriggers(),i=0;i<t.length;i++)if(t[i].getUniqueId()==e){ScriptApp.deleteTrigger(t[i]);break}}catch(r){log(ss,[r.message,r.fileName,r.lineNumber])}}function deleteAllTriggers(){for(var e=ScriptApp.getProjectTriggers(),t=0;t<e.length;t++)ScriptApp.deleteTrigger(e[t])}