var SERVICE_URL =  "http://localhost:9090/service";
var SERVICE_AUTH = 'Basic Y2FmZXRlcmlhLXdpZGdldDpmaXJlZmx5';
var CAFETERIA_INFOS;

function CafeteriaWidget() {
    $.ajax({
        url: SERVICE_URL,
        cache: false,
        success: function(data) {
            CAFETERIA_INFOS = data;
            prepareSettings();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}

function prepareSettings() {
    var uniPopup = $('#universityPopup');
    uniPopup.append($('<option></option>').attr('value', 'not_set').text("Bitte wählen ..."));
    for (unikey in CAFETERIA_INFOS) {
        var uni = CAFETERIA_INFOS[unikey];
        uniPopup.append($('<option></option>').attr('value', unikey).text(uni.name));
    }
    
    uniPopup.change(function() {
        var selectedValue = $(this).find('option:selected').attr('value');
        var cafeteriaPopup = $('#cafeteriaPopup');
        if (selectedValue != 'not_set') { // TODO: constant
            cafeteriaPopup.removeAttr('disabled').empty();
            $(CAFETERIA_INFOS[selectedValue].cafeterias).each(function(index, cafeteria) {
                cafeteriaPopup.append($('<option></option>').attr('value', index).text(cafeteria.name));
            });
        } else {
            cafeteriaPopup.empty().attr('disabled', '');
        }
        alert(selectedValue);
    });
}