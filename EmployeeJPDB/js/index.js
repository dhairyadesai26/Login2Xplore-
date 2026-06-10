var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";

var empDBName = "EMP-DB";
var empRelationName = "EmpData";


var connToken = "90935181|-31949239635418745|90958740";

$("#empid").focus();
resetForm();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getEmpIdAsJsonObj() {
    var empid = $("#empid").val();

    var jsonStr = {
        id: empid
    };

    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {

    saveRecNo2LS(jsonObj);

    var data = JSON.parse(jsonObj.data).record;

    $("#empname").val(data.name);
    $("#empsal").val(data.salary);
    $("#hra").val(data.hra);
    $("#da").val(data.da);
    $("#deduct").val(data.deduction);
}

function resetForm() {

    $("#empid").val("");
    $("#empname").val("");
    $("#empsal").val("");
    $("#hra").val("");
    $("#da").val("");
    $("#deduct").val("");

    $("#empid").prop("disabled", false);

    $("#empname").prop("disabled", true);
    $("#empsal").prop("disabled", true);
    $("#hra").prop("disabled", true);
    $("#da").prop("disabled", true);
    $("#deduct").prop("disabled", true);

    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);

    $("#empid").focus();
}

function validateData() {

    var empid, empname, empsal, hra, da, deduct;

    empid = $("#empid").val();
    empname = $("#empname").val();
    empsal = $("#empsal").val();
    hra = $("#hra").val();
    da = $("#da").val();
    deduct = $("#deduct").val();

    if (empid === "") {
        alert("Employee ID missing");
        $("#empid").focus();
        return "";
    }

    if (empname === "") {
        alert("Employee Name missing");
        $("#empname").focus();
        return "";
    }

    if (empsal === "") {
        alert("Employee Salary missing");
        $("#empsal").focus();
        return "";
    }

    if (hra === "") {
        alert("HRA missing");
        $("#hra").focus();
        return "";
    }

    if (da === "") {
        alert("DA missing");
        $("#da").focus();
        return "";
    }

    if (deduct === "") {
        alert("Deduction missing");
        $("#deduct").focus();
        return "";
    }

    var jsonStrObj = {
        id: empid,
        name: empname,
        salary: empsal,
        hra: hra,
        da: da,
        deduction: deduct
    };

    return JSON.stringify(jsonStrObj);
}

function getEmp() {

    var empIdJsonObj = getEmpIdAsJsonObj();

    var getRequest = createGET_BY_KEYRequest(
        connToken,
        empDBName,
        empRelationName,
        empIdJsonObj
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

        $("#change").prop("disabled", true);

        $("#empname").prop("disabled", false);
        $("#empsal").prop("disabled", false);
        $("#hra").prop("disabled", false);
        $("#da").prop("disabled", false);
        $("#deduct").prop("disabled", false);

        $("#empname").focus();
    }

    else if (resJsonObj.status === 200) {

        $("#empid").prop("disabled", true);

        fillData(resJsonObj);

        $("#empname").prop("disabled", false);
        $("#empsal").prop("disabled", false);
        $("#hra").prop("disabled", false);
        $("#da").prop("disabled", false);
        $("#deduct").prop("disabled", false);

        $("#save").prop("disabled", true);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);

        $("#empname").focus();
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
        empDBName,
        empRelationName
    );

    $.ajaxSetup({ async: false });

    var resJsonObj = executeCommandAtGivenBaseUrl(
        putRequest,
        jpdbBaseURL,
        jpdbIML
    );

    $.ajaxSetup({ async: true });

    alert("Employee Record Saved Successfully");

    resetForm();
}

function changeData() {

    $("#change").prop("disabled", true);

    var jsonChg = validateData();

    if (jsonChg === "") {
        return;
    }

    var updateRequest = createUPDATERecordRequest(
        connToken,
        jsonChg,
        empDBName,
        empRelationName,
        localStorage.getItem("recno")
    );

    $.ajaxSetup({ async: false });

    var resJsonObj = executeCommandAtGivenBaseUrl(
        updateRequest,
        jpdbBaseURL,
        jpdbIML
    );

    $.ajaxSetup({ async: true });

    alert("Employee Record Updated Successfully");

    resetForm();
}