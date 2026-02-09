function doGet(e) {
  var page = e.parameter.page || 'menu';
  var template;
  if (page == 'register') template = HtmlService.createTemplateFromFile('register');
  else if (page == 'scan') template = HtmlService.createTemplateFromFile('scan');
  else template = HtmlService.createTemplateFromFile('menu');
  
  return template.evaluate()
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setTitle('Face Recognition System')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

// บันทึกหน้า (กด 1 ครั้ง = เพิ่ม 1 แถว)
function registerUser(name, faceDescriptor) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Users');
  // เก็บ TimeStamp ด้วย จะได้รู้ว่ารูปไหนเก่า/ใหม่
  sheet.appendRow([name, JSON.stringify(faceDescriptor), new Date()]); 
  return "บันทึกข้อมูลหน้าเรียบร้อย";
}

// ดึงข้อมูลทั้งหมด (Flat List: 1 คนอาจมีหลายรายการ)
function getKnownFaces() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Users');
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return [];

  let users = [];
  for (let i = 1; i < data.length; i++) {
    const name = data[i][0];
    const jsonStr = data[i][1];
    if (name && jsonStr) {
      try {
        users.push({
          label: name, // ชื่อซ้ำได้ ไม่เป็นไร
          descriptor: JSON.parse(jsonStr)
        });
      } catch (e) {
        // ข้ามแถวที่ Error
      }
    }
  }
  return users;
}

function logAttendance(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Attendance');
  const now = new Date();
  sheet.appendRow([name, now.toLocaleTimeString(), now.toLocaleDateString()]);
  return "บันทึกเวลาสำเร็จ";
}
