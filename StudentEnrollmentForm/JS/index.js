var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";

var studentDBName = "SCHOOL-DB";
var studentRelationName = "STUDENT-TABLE";


var connToken = "90935181|-31949239635418745|90958740";

$("#rollNo").focus();

resetForm();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getStudentIdAsJsonObj() {

    var rollNo = $("#rollNo").val();

    var jsonStr = {
        rollNo: rollNo
    };

    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {

    saveRecNo2LS(jsonObj);

    var data = JSON.parse(jsonObj.data).record;

    $("#fullName").val(data.fullName);
    $("#studentClass").val(data.studentClass);
    $("#birthDate").val(data.birthDate);
    $("#address").val(data.address);
    $("#enrollmentDate").val(data.enrollmentDate);
}

function resetForm() {

    $("#rollNo").val("");
    $("#fullName").val("");
    $("#studentClass").val("");
    $("#birthDate").val("");
    $("#address").val("");
    $("#enrollmentDate").val("");

    $("#rollNo").prop("disabled", false);

    $("#fullName").prop("disabled", true);
    $("#studentClass").prop("disabled", true);
    $("#birthDate").prop("disabled", true);
    $("#address").prop("disabled", true);
    $("#enrollmentDate").prop("disabled", true);

    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);

    $("#rollNo").focus();
}

function validateData() {

    var rollNo,
        fullName,
        studentClass,
        birthDate,
        address,
        enrollmentDate;

    rollNo = $("#rollNo").val();
    fullName = $("#fullName").val();
    studentClass = $("#studentClass").val();
    birthDate = $("#birthDate").val();
    address = $("#address").val();
    enrollmentDate = $("#enrollmentDate").val();

    if (rollNo === "") {
        alert("Roll No missing");
        $("#rollNo").focus();
        return "";
    }

    if (fullName === "") {
        alert("Full Name missing");
        $("#fullName").focus();
        return "";
    }

    if (studentClass === "") {
        alert("Class missing");
        $("#studentClass").focus();
        return "";
    }

    if (birthDate === "") {
        alert("Birth Date missing");
        $("#birthDate").focus();
        return "";
    }

    if (address === "") {
        alert("Address missing");
        $("#address").focus();
        return "";
    }

    if (enrollmentDate === "") {
        alert("Enrollment Date missing");
        $("#enrollmentDate").focus();
        return "";
    }

    var jsonStrObj = {
        rollNo: rollNo,
        fullName: fullName,
        studentClass: studentClass,
        birthDate: birthDate,
        address: address,
        enrollmentDate: enrollmentDate
    };

    return JSON.stringify(jsonStrObj);
}

function getStudent() {

    var studentIdJsonObj = getStudentIdAsJsonObj();

    var getRequest = createGET_BY_KEYRequest(
        connToken,
        studentDBName,
        studentRelationName,
        studentIdJsonObj
    );

    $.ajaxSetup({ async: false });

    var resJsonObj = executeCommandAtGivenBaseUrl(
        getRequest,
        jpdbBaseURL,
        jpdbIRL
    );

    $.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {

        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);

        $("#update").prop("disabled", true);

        $("#fullName").prop("disabled", false);
        $("#studentClass").prop("disabled", false);
        $("#birthDate").prop("disabled", false);
        $("#address").prop("disabled", false);
        $("#enrollmentDate").prop("disabled", false);

        $("#fullName").focus();
    }

    else if (resJsonObj.status === 200) {

        $("#rollNo").prop("disabled", true);

        fillData(resJsonObj);

        $("#fullName").prop("disabled", false);
        $("#studentClass").prop("disabled", false);
        $("#birthDate").prop("disabled", false);
        $("#address").prop("disabled", false);
        $("#enrollmentDate").prop("disabled", false);

        $("#save").prop("disabled", true);
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);

        $("#fullName").focus();
    }
}

function saveData() {

    var jsonStrObj = validateData();

    if (jsonStrObj === "") {
        return;
    }

    var putRequest = createPUTRequest(
        connToken,
        jsonStrObj,
        studentDBName,
        studentRelationName
    );

    $.ajaxSetup({ async: false });

    var resJsonObj = executeCommandAtGivenBaseUrl(
        putRequest,
        jpdbBaseURL,
        jpdbIML
    );

    $.ajaxSetup({ async: true });

    alert("Student Record Saved Successfully");

    resetForm();
}

function updateData() {

    $("#update").prop("disabled", true);

    var jsonChg = validateData();

    if (jsonChg === "") {
        return;
    }

    var updateRequest = createUPDATERecordRequest(
        connToken,
        jsonChg,
        studentDBName,
        studentRelationName,
        localStorage.getItem("recno")
    );

    $.ajaxSetup({ async: false });

    var resJsonObj = executeCommandAtGivenBaseUrl(
        updateRequest,
        jpdbBaseURL,
        jpdbIML
    );

    $.ajaxSetup({ async: true });

    alert("Student Record Updated Successfully");

    resetForm();
}