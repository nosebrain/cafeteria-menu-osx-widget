var PREF_INFO_KEY = "uniInfos";

var SERVICE_URL =  "http://localhost:9090/service";

function CafeteriaWidget() {
    this.prefs = new Pref();
    var savedInfos = this.prefs.getPref(PREF_INFO_KEY, true);
    var self = this;
    if (savedInfos === undefined) {
        alert("loading informations");
        $.ajax({
            url: SERVICE_URL,
            success: function(data) {
                self.gotInformation(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    } else {
        this.infos = $(savedInfos);
    }
}

CafeteriaWidget.prototype.gotInformation = function(infos) {
    this.prefs.savePref(PREF_INFO_KEY, infos, true);
    this.infos = infos;
    this.prepareSettings();
}

CafeteriaWidget.prototype.prepareSettings = function() {
    $("#loadingBack").hide();
    var uniPopup = $('#universityPopup');
    uniPopup.append($('<option></option>').attr('value', 'not_set').text("Bitte wählen ..."));
    for (unikey in this.infos) {
        var uni = this.infos[unikey];
        uniPopup.append($('<option></option>').attr('value', unikey).text(uni.name));
    }
    var self = this;
    uniPopup.change(function() {
        var selectedValue = $(this).find('option:selected').attr('value');
        var cafeteriaPopup = $('#cafeteriaPopup');
        if (selectedValue != 'not_set') { // TODO: constant
            cafeteriaPopup.removeAttr('disabled').empty();
            $(self.infos[selectedValue].cafeterias).each(function(index, cafeteria) {
                cafeteriaPopup.append($('<option></option>').attr('value', index).text(cafeteria.name));
            });
        } else {
            cafeteriaPopup.empty().attr('disabled', '');
        }
    });
}